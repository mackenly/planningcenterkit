/**
 * Webhook error classes that carry a suggested HTTP status for your response.
 */
import { PcoWebhookError } from '../core/errors.js';

/**
 * A webhook delivery failed signature verification: the `X-PCO-Webhooks-Authenticity` header
 * was missing, malformed, or did not match any of the configured secrets.
 *
 * Respond with {@link PcoWebhookVerificationError.status} (401). Do not respond with 410, since
 * that tells Planning Center to deactivate the subscription.
 *
 * @example
 * ```ts
 * try {
 *     const events = await handleWebhook(request, { secret: env.PCO_WEBHOOK_SECRET });
 * } catch (err) {
 *     if (err instanceof PcoWebhookVerificationError) {
 *         return new Response('Invalid signature', { status: err.status }); // 401
 *     }
 *     throw err;
 * }
 * ```
 */
export class PcoWebhookVerificationError extends PcoWebhookError {
    /** Suggested HTTP status to respond with. */
    readonly status = 401 as const;
}

/**
 * A webhook delivery body (or the JSON:API document inside one of its `payload` strings) could
 * not be parsed.
 *
 * Respond with {@link PcoWebhookParseError.status} (400). Planning Center retries any non-200
 * response, so a delivery that keeps failing will eventually deactivate the subscription.
 *
 * @example
 * ```ts
 * try {
 *     const events = parseWebhook(rawBody);
 * } catch (err) {
 *     if (err instanceof PcoWebhookParseError) {
 *         return new Response(err.message, { status: err.status }); // 400
 *     }
 *     throw err;
 * }
 * ```
 */
export class PcoWebhookParseError extends PcoWebhookError {
    /** Suggested HTTP status to respond with. */
    readonly status = 400 as const;
}
