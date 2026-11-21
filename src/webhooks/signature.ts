/**
 * HMAC-SHA256 signature verification for Planning Center webhook deliveries, built on WebCrypto
 * so it runs on Node 22+, Bun, Deno, Cloudflare Workers, and edge runtimes.
 *
 * @see https://api.planningcenteronline.com/docs/overview/webhooks
 */

/** Name of the header Planning Center signs every webhook delivery with. */
export const WEBHOOK_SIGNATURE_HEADER = 'X-PCO-Webhooks-Authenticity';

/**
 * A raw webhook request body, exactly as received. A Node `Buffer` is a `Uint8Array`, so
 * `express.raw()` bodies work as-is.
 */
export type WebhookBody = string | Uint8Array | ArrayBuffer;

/** Options for {@link verifyWebhookSignature}. */
export interface VerifyWebhookSignatureOptions {
    /**
     * The RAW request body, byte for byte. Do not pass `JSON.stringify(parsedBody)`: re-serializing
     * changes the bytes and the signature will not match.
     */
    body: WebhookBody;
    /** Value of the `X-PCO-Webhooks-Authenticity` header (a hex HMAC-SHA256 digest). */
    signature: string | null | undefined;
    /**
     * The subscription's `authenticity_secret` (shown at https://api.planningcenteronline.com/webhooks).
     * Pass an array to accept any of several secrets, since each subscription has its own.
     */
    secret: string | readonly string[];
}

const encoder = new TextEncoder();

/**
 * Checks a webhook delivery's `X-PCO-Webhooks-Authenticity` header.
 *
 * The header is the lowercase hex HMAC-SHA256 of the raw body, keyed with the subscription's
 * `authenticity_secret`. Comparison is constant time (via `crypto.subtle.verify`). Returns
 * `false`, never throws, for a missing or malformed signature, an empty secret, or a mismatch.
 *
 * @returns `true` if the signature matches any of the given secrets.
 *
 * @example Fetch-style handler (Workers, Bun, Deno)
 * ```ts
 * const body = await request.text();
 * const ok = await verifyWebhookSignature({
 *     body,
 *     signature: request.headers.get('X-PCO-Webhooks-Authenticity'),
 *     secret: env.PCO_WEBHOOK_SECRET,
 * });
 * if (!ok) return new Response('Invalid signature', { status: 401 });
 * ```
 *
 * @example Express (the body must be raw bytes, not parsed JSON)
 * ```ts
 * app.post('/webhooks/pco', express.raw({ type: 'application/json' }), async (req, res) => {
 *     const ok = await verifyWebhookSignature({
 *         body: req.body, // Buffer
 *         signature: req.get('X-PCO-Webhooks-Authenticity'),
 *         secret: [process.env.PCO_PERSON_CREATED_SECRET!, process.env.PCO_PERSON_UPDATED_SECRET!],
 *     });
 *     if (!ok) return res.sendStatus(401);
 *     const events = parseWebhook(req.body);
 *     res.sendStatus(200);
 * });
 * ```
 */
export async function verifyWebhookSignature(options: VerifyWebhookSignatureOptions): Promise<boolean> {
    const { body, signature, secret } = options ?? ({} as VerifyWebhookSignatureOptions);
    const expected = typeof signature === 'string' ? hexToBytes(signature.trim()) : undefined;
    if (!expected || expected.length !== 32) return false;

    let data: Uint8Array<ArrayBuffer>;
    try {
        data = toBytes(body);
    } catch {
        return false;
    }

    const secrets = typeof secret === 'string' ? [secret] : Array.isArray(secret) ? secret : [];
    for (const candidate of secrets) {
        if (typeof candidate !== 'string' || candidate.length === 0) continue;
        try {
            const key = await importKey(candidate, ['verify']);
            if (await crypto.subtle.verify('HMAC', key, expected, data)) return true;
        } catch {
            // Treat any crypto failure for this secret as a mismatch.
        }
    }
    return false;
}

/**
 * Computes the `X-PCO-Webhooks-Authenticity` value Planning Center would send for a body: the
 * lowercase hex HMAC-SHA256 of the body keyed with `secret`. Useful for testing your own handler.
 *
 * @example
 * ```ts
 * const body = JSON.stringify({ data: [] });
 * const response = await app.fetch(new Request('http://localhost/webhooks/pco', {
 *     method: 'POST',
 *     body,
 *     headers: { 'X-PCO-Webhooks-Authenticity': await signWebhookBody(body, 'test-secret') },
 * }));
 * ```
 */
export async function signWebhookBody(body: WebhookBody, secret: string): Promise<string> {
    const key = await importKey(secret, ['sign']);
    const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, toBytes(body)));
    let hex = '';
    for (const byte of mac) hex += byte.toString(16).padStart(2, '0');
    return hex;
}

function importKey(secret: string, usages: KeyUsage[]): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, usages);
}

/**
 * Converts a body to bytes, copying so WebCrypto always gets a plain ArrayBuffer-backed view.
 * @internal
 */
export function toBytes(body: WebhookBody): Uint8Array<ArrayBuffer> {
    if (typeof body === 'string') return encoder.encode(body);
    if (body instanceof ArrayBuffer) return new Uint8Array(body.slice(0));
    if (ArrayBuffer.isView(body)) {
        const copy = new Uint8Array(body.byteLength);
        copy.set(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
        return copy;
    }
    throw new TypeError('Webhook body must be a string, Uint8Array, or ArrayBuffer');
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> | undefined {
    if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return undefined;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return bytes;
}
