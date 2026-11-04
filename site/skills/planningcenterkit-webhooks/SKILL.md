---
name: planningcenterkit-webhooks
description: Receive Planning Center webhooks with @mackenly/planningcenterkit/webhooks. Covers verifying the X-PCO-Webhooks-Authenticity HMAC signature against the raw body, per-subscription secrets, parsing typed events, framework handlers (Cloudflare Workers, Next.js, Express), responding correctly, testing, and managing subscriptions.
---

# Receiving Planning Center webhooks

Use `@mackenly/planningcenterkit/webhooks` (WebCrypto, no Node built-ins). Don't confuse it with `pco.webhooks` / `@mackenly/planningcenterkit/webhooks-api`, which is the Webhooks *product API* for managing subscriptions.

Full guide: https://planningcenterkit.mackenly.com/guides/webhooks/

## Rules

- Each subscription (one per event name, e.g. `people.v2.events.person.created`) has its own **authenticity secret**. Keep secrets in environment variables or a secret store.
- `X-PCO-Webhooks-Authenticity` is the hex HMAC-SHA256 of the **raw request body**. Verify the exact bytes: never `JSON.stringify(parsedBody)`, and don't read the body (`request.json()`/`text()`) before `handleWebhook`.
- Respond `200` fast and do slow work afterwards (`ctx.waitUntil`, Next.js `after()`). Other statuses are retried (up to 16 times over about 5 days). **Never return `410`**: it deactivates the subscription. Reject bad signatures with `401`, malformed bodies with `400`.
- Deliveries can repeat: dedupe on `event.id` when processing twice would hurt.

## Fetch-style runtimes (Workers, Next.js App Router, Bun, Deno, Hono)

```ts
import { handleWebhook, isEvent, PcoWebhookError } from '@mackenly/planningcenterkit/webhooks';

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            const events = await handleWebhook(request, {
                // a string, an array (any match is accepted), or (eventName) => secret | undefined (may be async)
                secret: [env.PCO_PERSON_CREATED_SECRET, env.PCO_PERSON_UPDATED_SECRET],
            });
            ctx.waitUntil(Promise.all(events.map(async (event) => {
                if (isEvent(event, 'people.v2.events.person.created')) await onNewPerson(event.payload.data.id);
            })));
            return new Response('ok');
        } catch (err) {
            // PcoWebhookVerificationError -> 401, PcoWebhookParseError -> 400
            const status = err instanceof PcoWebhookError && 'status' in err ? Number(err.status) : 500;
            return new Response('Rejected', { status });
        }
    },
};
```

## Express and other Node servers

```ts
import express from 'express';
import { parseWebhook, verifyWebhookSignature } from '@mackenly/planningcenterkit/webhooks';

const app = express();
// Register before any global express.json() so this route keeps the raw Buffer.
app.post('/webhooks/pco', express.raw({ type: 'application/json' }), async (req, res) => {
    const ok = await verifyWebhookSignature({
        body: req.body,
        signature: req.get('X-PCO-Webhooks-Authenticity'),
        secret: process.env.PCO_WEBHOOK_SECRET!,
    }); // returns false (never throws) on a missing/malformed header or mismatch; constant-time
    if (!ok) return res.sendStatus(401);
    const events = parseWebhook(req.body); // parseWebhook does not verify: always verify first
    res.sendStatus(200);
    for (const event of events) await processEvent(event);
});
```

## Events

Each body can hold several events: `{ id, name, product, resource, action, attempt, payload: { data, included, meta }, organizationId, raw }`. `isEvent(event, name | names[])` narrows `product`, `resource`, and `action`. The payload is a generic resource; cast it to the type you subscribed to (`event.payload.data as unknown as People.Person`). `parseEventName(name)` splits a name into `{ product, version, resource, action }`. Event names: https://api.planningcenteronline.com/webhooks/v2/available_events.

## Test a handler

```ts
import { handleWebhook, signWebhookBody } from '@mackenly/planningcenterkit/webhooks';

const body = JSON.stringify({ data: [{ id: 'test-1', type: 'EventDelivery', attributes: {
    name: 'people.v2.events.person.created', attempt: 1,
    payload: JSON.stringify({ data: { type: 'Person', id: '1', attributes: { first_name: 'Ada' } } }),
} }] });
const request = new Request('http://localhost/webhooks/pco', {
    method: 'POST', body, headers: { 'X-PCO-Webhooks-Authenticity': await signWebhookBody(body, 'test-secret') },
});
const events = await handleWebhook(request, { secret: 'test-secret' });
```

## Manage subscriptions

```ts
await pco.webhooks.webhook_subscriptions.create({ name: 'people.v2.events.person.created', url: 'https://example.com/webhooks/pco', active: true });
const available = await pco.webhooks.available_events.toArray();
```

Reference: https://planningcenterkit.mackenly.com/reference/webhooks/ · Example Worker: https://github.com/mackenly/planningcenterkit/blob/main/examples/cloudflare-worker-webhooks.ts
