/**
 * Planning Center webhooks: signature verification (WebCrypto, constant time) and typed delivery
 * parsing. Zero dependencies, no Node built-ins, so it runs on Node 22+, Bun, Deno, Cloudflare
 * Workers, and Vercel/Next.js route handlers.
 *
 * - {@link handleWebhook}: verify + parse a standard `Request` in one call.
 * - {@link verifyWebhookSignature} and {@link parseWebhook}: the building blocks, for frameworks
 *   without a `Request` (Express: use `express.raw({ type: 'application/json' })`).
 * - {@link isEvent}: narrow an event by name.
 *
 * Respond `200` quickly. Any other status is retried (up to 16 times over about 5 days), `429`
 * and `503` responses may include `Retry-After` (capped at 1 hour), and a `410` response
 * deactivates the subscription.
 *
 * @example
 * ```ts
 * import { handleWebhook, isEvent } from '@mackenly/planningcenterkit/webhooks';
 *
 * const events = await handleWebhook(request, { secret: env.PCO_WEBHOOK_SECRET });
 * for (const event of events) {
 *     if (isEvent(event, 'people.v2.events.person.created')) console.log(event.payload.data.id);
 * }
 * ```
 *
 * @see https://api.planningcenteronline.com/docs/overview/webhooks
 * @module
 */
export { PcoWebhookError } from '../core/errors.js';
export { PcoWebhookParseError, PcoWebhookVerificationError } from './errors.js';
export {
    signWebhookBody,
    verifyWebhookSignature,
    WEBHOOK_SIGNATURE_HEADER,
    type VerifyWebhookSignatureOptions,
    type WebhookBody,
} from './signature.js';
export {
    isEvent,
    parseEventName,
    parseWebhook,
    type EventAction,
    type EventProduct,
    type EventResource,
    type ParsedEventName,
    type WebhookAction,
    type WebhookEvent,
    type WebhookEventName,
} from './events.js';
export {
    handleWebhook,
    type HandleWebhookOptions,
    type WebhookSecretResolver,
    type WebhookSecrets,
} from './handle.js';
