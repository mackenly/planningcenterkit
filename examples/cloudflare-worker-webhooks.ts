/**
 * A Cloudflare Worker that receives Planning Center webhooks, verifies their signatures, and
 * processes the events after responding.
 *
 * Shows: `handleWebhook()` with one secret per subscription, `isEvent()` narrowing, responding
 * 200 fast and doing the work in `ctx.waitUntil()`, deduping redeliveries on `event.id`, and the
 * error statuses to send back (401 bad signature, 400 malformed body, never 410).
 *
 * Deploy it:
 *
 *     1. Copy this file into a Worker project as src/index.ts and change the import to
 *        '@mackenly/planningcenterkit/webhooks'.
 *     2. Add a KV namespace binding named SEEN (used to drop duplicate deliveries).
 *     3. Store each subscription's authenticity secret (https://api.planningcenteronline.com/webhooks):
 *            npx wrangler secret put PCO_PERSON_CREATED_SECRET
 *            npx wrangler secret put PCO_PERSON_UPDATED_SECRET
 *            npx wrangler secret put PCO_PERSON_DESTROYED_SECRET
 *     4. npx wrangler deploy, then point the webhook subscriptions at https://<worker>/webhooks/pco.
 *
 * Test it locally with `signWebhookBody()` to produce a valid X-PCO-Webhooks-Authenticity header.
 *
 * The Env and ExecutionContext types are declared below so this file has no dependency on
 * @cloudflare/workers-types; in a real Worker use the generated `Env` from `wrangler types`.
 */
import { handleWebhook, isEvent, PcoWebhookError, type WebhookEvent } from '../src/entries/webhooks.js';

/** The subset of a KV namespace this example uses. */
interface KVNamespaceLike {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface Env {
    PCO_PERSON_CREATED_SECRET: string;
    PCO_PERSON_UPDATED_SECRET: string;
    PCO_PERSON_DESTROYED_SECRET: string;
    SEEN: KVNamespaceLike;
}

export interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
}

/** Each webhook subscription has its own secret; look it up by event name. */
function secretFor(env: Env, eventName: string): string | undefined {
    switch (eventName) {
        case 'people.v2.events.person.created':
            return env.PCO_PERSON_CREATED_SECRET;
        case 'people.v2.events.person.updated':
            return env.PCO_PERSON_UPDATED_SECRET;
        case 'people.v2.events.person.destroyed':
            return env.PCO_PERSON_DESTROYED_SECRET;
        default:
            return undefined; // unknown events are rejected with 401
    }
}

async function processEvent(event: WebhookEvent, env: Env): Promise<void> {
    // Planning Center may deliver the same event more than once.
    if (await env.SEEN.get(event.id)) return;
    await env.SEEN.put(event.id, '1', { expirationTtl: 60 * 60 * 24 * 7 });

    if (isEvent(event, 'people.v2.events.person.created')) {
        const person = event.payload.data;
        console.log(`New person ${person.id}: ${String(person.attributes?.name ?? '')}`);
    } else if (isEvent(event, ['people.v2.events.person.updated', 'people.v2.events.person.destroyed'])) {
        console.log(`Person ${event.payload.data.id} was ${event.action}`);
    }
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        if (request.method !== 'POST' || url.pathname !== '/webhooks/pco') {
            return new Response('Not found', { status: 404 });
        }

        let events: WebhookEvent[];
        try {
            events = await handleWebhook(request, { secret: (name) => secretFor(env, name) });
        } catch (error) {
            // PcoWebhookVerificationError has status 401, PcoWebhookParseError has 400.
            // Never respond 410: that tells Planning Center to deactivate the subscription.
            const status = error instanceof PcoWebhookError && 'status' in error ? Number(error.status) : 500;
            return new Response('Rejected', { status });
        }

        // Acknowledge right away; anything other than a quick 200 is retried.
        ctx.waitUntil(Promise.all(events.map((event) => processEvent(event, env))));
        return new Response('ok');
    },
};
