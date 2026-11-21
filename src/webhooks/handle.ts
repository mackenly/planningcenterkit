/**
 * One-call webhook handling for runtimes with a standard `Request` (Cloudflare Workers, Bun,
 * Deno, Next.js App Router, Remix, Hono, ...).
 */
import { PcoWebhookError } from '../core/errors.js';
import { PcoWebhookVerificationError } from './errors.js';
import { parseWebhook, type WebhookEvent, type WebhookEventName } from './events.js';
import { verifyWebhookSignature, WEBHOOK_SIGNATURE_HEADER } from './signature.js';

/** One secret, several, or none. */
export type WebhookSecrets = string | readonly string[] | undefined;

/**
 * Looks up the `authenticity_secret`(s) for an event name. Return `undefined` for events you
 * don't handle, which rejects the delivery with a 401.
 */
export type WebhookSecretResolver = (eventName: string) => WebhookSecrets | Promise<WebhookSecrets>;

/** Options for {@link handleWebhook}. */
export interface HandleWebhookOptions {
    /**
     * The subscription `authenticity_secret` to verify against. Every subscription (one per event
     * name) has its own secret, so pass an array of all of them, or a function that returns the
     * secret(s) for a given event name. The delivery is accepted if any candidate matches.
     */
    secret: string | readonly string[] | WebhookSecretResolver;
}

/**
 * Verifies and parses a webhook delivery from a standard `Request`.
 *
 * Reads the body once as raw bytes, checks the `X-PCO-Webhooks-Authenticity` header against the
 * candidate secrets, and returns the parsed events. Respond `200` quickly (do slow work after
 * responding, e.g. with `ctx.waitUntil()` or a queue): any other status is retried up to 16 times
 * over about 5 days, and a `410` response deactivates the subscription. Deliveries can be
 * redelivered, so dedupe on {@link WebhookEvent.id} if processing twice would hurt.
 *
 * @throws {PcoWebhookVerificationError} (`status` 401) if the signature is missing or matches no secret.
 * @throws {PcoWebhookParseError} (`status` 400) if the body is malformed.
 * @throws {PcoWebhookError} if the request body was already read.
 *
 * @example Cloudflare Workers (or any fetch-style handler: Bun.serve, Deno.serve, Hono)
 * ```ts
 * import { handleWebhook, isEvent, PcoWebhookError } from '@mackenly/planningcenterkit/webhooks';
 *
 * export default {
 *     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
 *         try {
 *             const events = await handleWebhook(request, {
 *                 secret: [env.PCO_PERSON_CREATED_SECRET, env.PCO_PERSON_UPDATED_SECRET],
 *             });
 *             // Acknowledge fast; keep working after the response is sent.
 *             ctx.waitUntil(Promise.all(events.map(async (event) => {
 *                 if (isEvent(event, 'people.v2.events.person.created')) {
 *                     await env.QUEUE.send({ personId: event.payload.data.id });
 *                 }
 *             })));
 *             return new Response('ok');
 *         } catch (err) {
 *             // 401 for a bad signature, 400 for a malformed body. Never 410 (that deactivates the subscription).
 *             const status = err instanceof PcoWebhookError && 'status' in err ? Number(err.status) : 500;
 *             return new Response('Rejected', { status });
 *         }
 *     },
 * };
 * ```
 *
 * @example Next.js App Router, in app/api/webhooks/pco/route.ts
 * ```ts
 * import { after } from 'next/server';
 * import { handleWebhook, PcoWebhookParseError, PcoWebhookVerificationError } from '@mackenly/planningcenterkit/webhooks';
 *
 * const secrets: Record<string, string | undefined> = {
 *     'people.v2.events.person.created': process.env.PCO_PERSON_CREATED_SECRET,
 *     'people.v2.events.person.destroyed': process.env.PCO_PERSON_DESTROYED_SECRET,
 * };
 *
 * export async function POST(request: Request) {
 *     try {
 *         const events = await handleWebhook(request, { secret: (name) => secrets[name] });
 *         after(() => processEvents(events)); // respond 200 now, process afterwards
 *         return new Response(null, { status: 200 });
 *     } catch (err) {
 *         if (err instanceof PcoWebhookVerificationError || err instanceof PcoWebhookParseError) {
 *             return new Response(err.message, { status: err.status });
 *         }
 *         throw err;
 *     }
 * }
 * ```
 *
 * @example Express, using the lower-level helpers with a raw body since there is no Request object
 * ```ts
 * import express from 'express';
 * import { parseWebhook, verifyWebhookSignature } from '@mackenly/planningcenterkit/webhooks';
 *
 * const app = express();
 * // express.raw() keeps the exact bytes Planning Center signed. express.json() would parse and
 * // discard them, and the signature could never match. Register this before any global json().
 * app.post('/webhooks/pco', express.raw({ type: 'application/json' }), async (req, res) => {
 *     const ok = await verifyWebhookSignature({
 *         body: req.body, // Buffer
 *         signature: req.get('X-PCO-Webhooks-Authenticity'),
 *         secret: process.env.PCO_WEBHOOK_SECRET!,
 *     });
 *     if (!ok) return res.sendStatus(401);
 *     const events = parseWebhook(req.body);
 *     res.sendStatus(200); // acknowledge before doing slow work
 *     for (const event of events) await processEvent(event);
 * });
 * ```
 */
export async function handleWebhook(
    request: Request,
    options: HandleWebhookOptions,
): Promise<WebhookEvent<WebhookEventName>[]> {
    if (request.bodyUsed) {
        throw new PcoWebhookError('The webhook request body was already read; pass an unread Request to handleWebhook');
    }
    const body = new Uint8Array(await request.arrayBuffer());
    const signature = request.headers.get(WEBHOOK_SIGNATURE_HEADER);
    if (!signature) {
        throw new PcoWebhookVerificationError(`Missing ${WEBHOOK_SIGNATURE_HEADER} header`);
    }

    const { secret } = options;
    if (typeof secret === 'function') {
        // The secret depends on the event name, so parse first. Nothing from the unverified body
        // is returned until the signature checks out, and an unparseable unverified body is a 401
        // (not a 400) so it reveals nothing to an unauthenticated sender.
        let events: WebhookEvent<WebhookEventName>[];
        try {
            events = parseWebhook(body);
        } catch {
            throw new PcoWebhookVerificationError('Unverifiable webhook delivery');
        }
        // Each subscription has its own secret and Planning Center sends one event name per
        // delivery. A mixed body could otherwise borrow one subscription's secret to authorize
        // events of another, so refuse it.
        const names = [...new Set(events.map((event) => event.name))];
        if (names.length !== 1) {
            throw new PcoWebhookVerificationError(
                `Expected one event name per delivery, got ${names.length ? names.join(', ') : 'none'}`,
            );
        }
        const resolved = await secret(names[0]!);
        const candidates = typeof resolved === 'string' ? [resolved] : [...(resolved ?? [])];
        if (candidates.length === 0) {
            throw new PcoWebhookVerificationError(`No webhook secret configured for ${names[0]}`);
        }
        await assertSignature(body, signature, candidates);
        return events;
    }

    await assertSignature(body, signature, secret);
    return parseWebhook(body);
}

async function assertSignature(body: Uint8Array, signature: string, secret: string | readonly string[]): Promise<void> {
    if (!(await verifyWebhookSignature({ body, signature, secret }))) {
        throw new PcoWebhookVerificationError(`Invalid ${WEBHOOK_SIGNATURE_HEADER} signature`);
    }
}
