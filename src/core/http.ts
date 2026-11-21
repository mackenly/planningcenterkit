/**
 * The HTTP transport: authentication, query encoding, retries, rate limiting, timeouts,
 * concurrency limiting, and file uploads. Uses only web-standard globals (`fetch`, `Headers`,
 * `AbortSignal`, `FormData`, `Blob`), so it runs on Node 22+, Bun, Deno, Workers, and browsers.
 *
 * @see https://api.planningcenteronline.com/docs/overview/rate-limiting
 */
import { createAuthenticator } from './auth.js';
import type { PcoAuth } from './auth.js';
import { PcoApiError, PcoError, PcoNetworkError, PcoRateLimitError, PcoTimeoutError } from './errors.js';
import type { PcoErrorObject } from './errors.js';
import type { HttpMethod, PcoRequest, PcoTransport, QueryValue, UploadedFile, UploadOptions } from './transport.js';

/** Default API origin. */
export const DEFAULT_BASE_URL = 'https://api.planningcenteronline.com';
/** Default file upload endpoint. */
export const DEFAULT_UPLOAD_URL = 'https://upload.planningcenteronline.com/v2/files';
/** Base `User-Agent` sent with every request. */
export const DEFAULT_USER_AGENT = 'planningcenterkit';

/** Retry behavior for {@link TransportOptions.retry}. */
export interface RetryOptions {
    /** Maximum retries after the first attempt. Default `3`. `0` disables retries. */
    maxRetries?: number;
    /**
     * Retry 5xx responses, network errors, and timeouts for idempotent requests (GET, DELETE).
     * POST and PATCH are never retried for these, since they may have been applied. Default `true`.
     */
    retryServerErrors?: boolean;
    /**
     * Longest `Retry-After` (in seconds) a 429 may ask for before we give up and throw a
     * `PcoRateLimitError` instead of waiting. Default `60`.
     */
    maxRetryAfterSeconds?: number;
}

/** Proactive rate limiting for {@link TransportOptions.rateLimit}. */
export interface RateLimitOptions {
    /**
     * Pace requests using the `X-PCO-API-Request-Rate-*` headers: once the reported count reaches
     * the reported limit, later requests wait until the window is likely to have reset. A 429
     * also pauses every request on this transport for its `Retry-After`. Default `true`.
     */
    throttle?: boolean;
}

/** Passed to {@link TransportHooks.onRequest} before each attempt. */
export interface RequestInfo {
    method: string;
    /** Full request URL (never includes credentials). */
    url: string;
    /** `0` for the first attempt, `1` for the first retry, and so on. */
    attempt: number;
}

/** Passed to {@link TransportHooks.onResponse} after each attempt that got a response. */
export interface ResponseInfo extends RequestInfo {
    status: number;
    /** Time from sending the request to reading the full body. */
    durationMs: number;
}

/** Passed to {@link TransportHooks.onRetry} before waiting to retry. */
export interface RetryInfo extends RequestInfo {
    /** How long we will wait before the next attempt. */
    delayMs: number;
    /** Why we are retrying. */
    reason: 'rate_limit' | 'server_error' | 'network_error' | 'timeout';
    /** Response status, when there was a response. */
    status?: number;
    /** The underlying error, for network errors and timeouts. */
    error?: unknown;
}

/** Passed to {@link TransportHooks.onThrottle} when a request waits for the rate limit window. */
export interface ThrottleInfo {
    method: string;
    url: string;
    delayMs: number;
}

/**
 * Logging/telemetry callbacks. Errors thrown by hooks are ignored. Hooks never receive the
 * `Authorization` header or any other credentials.
 *
 * @example
 * ```ts
 * hooks: {
 *     onResponse: ({ method, url, status, durationMs }) => console.log(method, url, status, `${durationMs}ms`),
 *     onRetry: ({ reason, delayMs }) => console.warn(`retrying (${reason}) in ${delayMs}ms`),
 * }
 * ```
 */
export interface TransportHooks {
    onRequest?: (info: RequestInfo) => void;
    onResponse?: (info: ResponseInfo) => void;
    onRetry?: (info: RetryInfo) => void;
    onThrottle?: (info: ThrottleInfo) => void;
}

/** Options for {@link createTransport}. */
export interface TransportOptions {
    /** Credentials: a personal access token, OAuth tokens, or a token provider. */
    auth: PcoAuth;
    /** API origin. Default `https://api.planningcenteronline.com`. */
    baseUrl?: string;
    /** File upload endpoint. Default `https://upload.planningcenteronline.com/v2/files`. */
    uploadUrl?: string;
    /** Custom `fetch`. Defaults to the global `fetch`, looked up at call time. */
    fetch?: typeof fetch;
    /** Appended to the default `User-Agent` (`planningcenterkit`), e.g. `my-app/1.2`. */
    userAgent?: string;
    /** Headers sent with every request. */
    headers?: Record<string, string>;
    /** Per-attempt timeout in milliseconds. Default `30000`. */
    timeoutMs?: number;
    /** Retry behavior. */
    retry?: RetryOptions;
    /** Proactive rate limiting. */
    rateLimit?: RateLimitOptions;
    /**
     * Maximum requests in flight at once on this transport; extra requests queue. Default `10`,
     * which keeps bursts well inside Planning Center's default 100 requests per 20 seconds.
     */
    maxConcurrency?: number;
    /** Logging/telemetry callbacks. */
    hooks?: TransportHooks;
}

/**
 * Clock and randomness overrides so tests don't wait in real time.
 * @internal
 */
export interface TransportInternals {
    /** Current time in ms. Default `Date.now`. */
    now?: () => number;
    /** Waits `ms`, rejecting with `signal.reason` if it aborts. */
    sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
    /** Returns a number in [0, 1). Default `Math.random`. */
    random?: () => number;
}

const IDEMPOTENT: ReadonlySet<string> = new Set(['GET', 'DELETE']);
const BACKOFF_BASE_MS = 500;
const BACKOFF_CAP_MS = 10_000;

/**
 * Creates the {@link PcoTransport} the client uses for every request.
 *
 * @example
 * ```ts
 * const transport = createTransport({
 *     auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! },
 *     userAgent: 'my-app/1.0',
 * });
 * const me = await transport.request({ method: 'GET', path: '/people/v2/me' });
 * ```
 */
export function createTransport(options: TransportOptions, internals: TransportInternals = {}): PcoTransport {
    const baseUrl = new URL(options.baseUrl ?? DEFAULT_BASE_URL);
    const baseHref = baseUrl.href.replace(/\/+$/, '');
    const uploadUrl = options.uploadUrl ?? DEFAULT_UPLOAD_URL;
    const timeoutMs = options.timeoutMs ?? 30_000;
    const maxRetries = Math.max(0, options.retry?.maxRetries ?? 3);
    const retryServerErrors = options.retry?.retryServerErrors ?? true;
    const maxRetryAfterMs = (options.retry?.maxRetryAfterSeconds ?? 60) * 1000;
    const hooks = options.hooks ?? {};
    const now = internals.now ?? Date.now;
    const sleep = internals.sleep ?? defaultSleep;
    const random = internals.random ?? Math.random;
    const getFetch = (): typeof fetch => options.fetch ?? globalThis.fetch;
    const userAgent = options.userAgent ? `${DEFAULT_USER_AGENT} ${options.userAgent}` : DEFAULT_USER_AGENT;
    const maxConcurrency = options.maxConcurrency ?? 10;
    if (!(maxConcurrency >= 1)) throw new PcoError('maxConcurrency must be at least 1.');

    const auth = createAuthenticator(options.auth, { fetch: getFetch, baseUrl: baseUrl.origin, now });
    const limiter = new Semaphore(maxConcurrency);
    const throttle = new Throttle(options.rateLimit?.throttle ?? true, now);

    const backoff = (attempt: number) => Math.round(random() * Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** attempt));

    async function execute(
        method: HttpMethod,
        url: string,
        headers: Headers,
        body: BodyInit | undefined,
        signal: AbortSignal | undefined,
    ): Promise<unknown> {
        let attempt = 0;
        let replayedAfterRefresh = false;
        const idempotent = IDEMPOTENT.has(method);

        const retry = async (info: Omit<RetryInfo, 'method' | 'url' | 'attempt'>) => {
            safeHook(hooks.onRetry, { method, url, attempt, ...info });
            await sleep(info.delayMs, signal);
            attempt++;
        };

        for (;;) {
            signal?.throwIfAborted();
            const release = await limiter.acquire(signal);
            const wait = throttle.delay();
            if (wait > 0) {
                release();
                safeHook(hooks.onThrottle, { method, url, delayMs: wait });
                await sleep(wait, signal);
                continue; // re-check: other requests may have updated the window meanwhile
            }

            let authorization: string;
            try {
                authorization = await auth.getAuthorization(signal);
            } catch (error) {
                release();
                throw error;
            }
            headers.set('Authorization', authorization);

            let response: Response;
            let text: string;
            const started = now();
            const timeout = AbortSignal.timeout(timeoutMs);
            try {
                safeHook(hooks.onRequest, { method, url, attempt });
                throttle.sent();
                response = await getFetch()(url, {
                    method,
                    headers,
                    body,
                    signal: anySignal(signal ? [signal, timeout] : [timeout]),
                });
                text = await response.text();
            } catch (error) {
                release();
                if (signal?.aborted) throw signal.reason;
                const timedOut = timeout.aborted;
                const wrapped = timedOut
                    ? new PcoTimeoutError(`${method} ${url} timed out after ${timeoutMs}ms`, { cause: error })
                    : new PcoNetworkError(`${method} ${url} failed: ${describe(error)}`, { cause: error });
                if (idempotent && retryServerErrors && attempt < maxRetries) {
                    await retry({ delayMs: backoff(attempt), reason: timedOut ? 'timeout' : 'network_error', error });
                    continue;
                }
                throw wrapped;
            }
            release();

            throttle.update(response.headers);
            const { status } = response;
            safeHook(hooks.onResponse, { method, url, attempt, status, durationMs: now() - started });
            const parsed = parseBody(text);
            if (response.ok) return parsed;

            if (status === 401 && !replayedAfterRefresh && (await auth.handleUnauthorized(authorization, signal))) {
                replayedAfterRefresh = true;
                continue;
            }

            const errorInit = {
                status,
                method,
                url,
                errors: extractErrors(parsed),
                headers: response.headers,
                body: parsed,
            };

            if (status === 429) {
                // A 429 means the request was not processed, so retrying is safe for any method.
                const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'), now);
                if (retryAfterMs !== undefined && retryAfterMs > maxRetryAfterMs) {
                    throw new PcoRateLimitError(errorInit);
                }
                if (attempt < maxRetries) {
                    const delayMs = retryAfterMs ?? backoff(attempt);
                    throttle.pauseFor(delayMs);
                    await retry({ delayMs, reason: 'rate_limit', status });
                    continue;
                }
            } else if (status >= 500 && idempotent && retryServerErrors && attempt < maxRetries) {
                const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'), now);
                const delayMs = retryAfterMs !== undefined && retryAfterMs <= maxRetryAfterMs
                    ? Math.max(retryAfterMs, backoff(attempt))
                    : backoff(attempt);
                await retry({ delayMs, reason: 'server_error', status });
                continue;
            }

            throw PcoApiError.from(errorInit);
        }
    }

    function baseHeaders(extra?: Record<string, string>): Headers {
        const headers = new Headers({ Accept: 'application/json' });
        for (const source of [options.headers, extra]) {
            if (!source) continue;
            for (const [key, value] of Object.entries(source)) headers.set(key, value);
        }
        headers.set('User-Agent', userAgent);
        return headers;
    }

    return {
        async request<T = unknown>(req: PcoRequest): Promise<T> {
            const url = buildUrl(baseUrl, baseHref, req.path, req.query);
            const headers = baseHeaders(req.headers);
            let body: string | undefined;
            if (req.body !== undefined) {
                body = JSON.stringify(req.body);
                headers.set('Content-Type', 'application/json');
            }
            if (req.version) headers.set('X-PCO-API-Version', req.version);
            return (await execute(req.method, url, headers, body, req.signal)) as T;
        },

        async upload(file: Blob | ArrayBuffer | Uint8Array, uploadOptions: UploadOptions = {}): Promise<UploadedFile> {
            let blob: Blob;
            if (file instanceof Blob) {
                blob = uploadOptions.contentType && uploadOptions.contentType !== file.type
                    ? new Blob([file], { type: uploadOptions.contentType })
                    : file;
            } else if (file instanceof ArrayBuffer || ArrayBuffer.isView(file)) {
                blob = new Blob([file as BlobPart], { type: uploadOptions.contentType ?? 'application/octet-stream' });
            } else {
                throw new PcoError('upload() expects a Blob, File, ArrayBuffer, or Uint8Array.');
            }
            const fileName = (file as { name?: unknown }).name;
            const filename = uploadOptions.filename
                ?? (typeof fileName === 'string' && fileName ? fileName : 'upload');
            const form = new FormData();
            form.append('file', blob, filename);
            // No Content-Type: fetch sets multipart/form-data with the boundary.
            const result = await execute('POST', uploadUrl, baseHeaders(), form, uploadOptions.signal);
            const first = (result as { data?: unknown } | undefined)?.data;
            const entry = (Array.isArray(first) ? first[0] : first) as
                | { id?: unknown; attributes?: Record<string, unknown> }
                | undefined;
            if (!entry || typeof entry.id !== 'string') {
                throw new PcoError('Unexpected response from the upload service: no file id returned.');
            }
            return { ...(entry.attributes ?? {}), id: entry.id } as UploadedFile;
        },
    };
}

/**
 * Encodes query parameters. Keys are used verbatim (e.g. `where[created_at][gte]`) and
 * percent-encoded along with values, so a literal `%` (partial-match wildcard) becomes `%25`.
 * Arrays are joined with commas, Dates become ISO 8601, `undefined`/`null` are skipped.
 *
 * @example
 * ```ts
 * encodeQuery({ 'where[first_name]': 'Tim%', include: ['emails', 'phone_numbers'] });
 * // 'where%5Bfirst_name%5D=Tim%25&include=emails%2Cphone_numbers'
 * ```
 */
export function encodeQuery(query: Record<string, QueryValue> | undefined): string {
    if (!query) return '';
    const parts: string[] = [];
    for (const [key, value] of Object.entries(query)) {
        const encoded = encodeQueryValue(value);
        if (encoded === undefined) continue;
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(encoded)}`);
    }
    return parts.join('&');
}

function encodeQueryValue(value: QueryValue): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(String).join(',');
    return String(value);
}

function buildUrl(base: URL, baseHref: string, path: string, query: Record<string, QueryValue> | undefined): string {
    let url: URL;
    if (/^[a-z][a-z\d+.-]*:/i.test(path)) {
        try {
            url = new URL(path);
        } catch (error) {
            throw new PcoError(`Invalid request URL: ${path}`, { cause: error });
        }
        // Never send credentials to another host, even if a response's links point there.
        if (url.origin !== base.origin) {
            throw new PcoError(
                `Refusing to send an authenticated request to ${url.origin}; only ${base.origin} is allowed.`,
            );
        }
    } else {
        url = new URL(baseHref + (path.startsWith('/') ? path : `/${path}`));
    }
    const encoded = encodeQuery(query);
    if (!encoded) return url.href;
    if (url.search && url.search !== '?') {
        // Override any keys already present (e.g. on a links.next URL).
        const keys = new Set(Object.keys(query!).filter((k) => encodeQueryValue(query![k]) !== undefined));
        const kept = url.search.slice(1).split('&').filter((pair) => {
            const key = decodeURIComponent(pair.split('=')[0]!.replace(/\+/g, ' '));
            return !keys.has(key);
        });
        url.search = `?${[...kept, encoded].join('&')}`;
    } else {
        url.search = `?${encoded}`;
    }
    return url.href;
}

function parseBody(text: string): unknown {
    if (!text.trim()) return undefined;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function extractErrors(body: unknown): PcoErrorObject[] | undefined {
    const errors = (body as { errors?: unknown } | undefined)?.errors;
    if (Array.isArray(errors)) return errors as PcoErrorObject[];
    return undefined;
}

/** Parses `Retry-After` (seconds or an HTTP date) into milliseconds. */
function parseRetryAfter(value: string | null, now: () => number): number | undefined {
    if (!value) return undefined;
    const seconds = Number(value.trim());
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);
    return Number.isNaN(date) ? undefined : Math.max(0, date - now());
}

/** Parses `X-PCO-API-Request-Rate-Period` (e.g. `20 seconds`) into milliseconds. */
function parsePeriod(value: string | null): number | undefined {
    if (!value) return undefined;
    const match = /^\s*(\d+(?:\.\d+)?)\s*([a-z]*)/i.exec(value);
    if (!match) return undefined;
    const amount = Number(match[1]);
    const unit = match[2]!.toLowerCase();
    const factor = unit.startsWith('m') && !unit.startsWith('ms') && !unit.startsWith('milli')
        ? 60_000
        : unit.startsWith('h')
            ? 3_600_000
            : unit.startsWith('ms') || unit.startsWith('milli')
                ? 1
                : 1000;
    return amount * factor;
}

/**
 * Tracks the rate limit window reported by Planning Center and how long new requests should
 * wait. The limit is never assumed: it comes from the response headers.
 */
class Throttle {
    private limit?: number;
    private count = 0;
    /** Last count the server reported (excludes our local in-flight increments). */
    private serverCount = 0;
    private periodMs?: number;
    private windowStart?: number;
    private pausedUntil = 0;

    constructor(private readonly enabled: boolean, private readonly now: () => number) {}

    /** Milliseconds the next request should wait (0 = go). */
    delay(): number {
        if (!this.enabled) return 0;
        const now = this.now();
        if (now < this.pausedUntil) return this.pausedUntil - now;
        if (this.limit === undefined || this.periodMs === undefined || this.windowStart === undefined) return 0;
        const resetAt = this.windowStart + this.periodMs;
        if (now >= resetAt) {
            // Window has rolled over; start counting a fresh one.
            this.windowStart = now;
            this.count = 0;
            return 0;
        }
        return this.count >= this.limit ? resetAt - now : 0;
    }

    /** Counts a request we are about to send, so concurrent bursts don't overshoot. */
    sent(): void {
        if (this.enabled && this.limit !== undefined) this.count++;
    }

    /** Records the server's view of the window from a response. */
    update(headers: Headers): void {
        if (!this.enabled) return;
        const limit = Number(headers.get('x-pco-api-request-rate-limit'));
        const count = Number(headers.get('x-pco-api-request-rate-count'));
        if (!headers.has('x-pco-api-request-rate-limit') || !Number.isFinite(limit) || limit <= 0) return;
        if (!headers.has('x-pco-api-request-rate-count') || !Number.isFinite(count)) return;
        const period = parsePeriod(headers.get('x-pco-api-request-rate-period')) ?? this.periodMs ?? 20_000;
        const now = this.now();
        // A server count lower than the server's previous count means a new window began (roughly)
        // now. Compare against the server's own numbers: our local count includes in-flight
        // requests, so comparing to it would restart the window on every concurrent burst.
        if (this.windowStart === undefined || count < this.serverCount || now >= this.windowStart + period) {
            this.windowStart = now;
        }
        this.limit = limit;
        this.serverCount = count;
        this.count = count;
        this.periodMs = period;
    }

    /** Pauses all requests on this transport (after a 429). */
    pauseFor(ms: number): void {
        if (this.enabled) this.pausedUntil = Math.max(this.pausedUntil, this.now() + ms);
    }
}

/** A FIFO counting semaphore with abortable waits. */
class Semaphore {
    private active = 0;
    private readonly queue: Array<() => void> = [];

    constructor(private readonly max: number) {}

    async acquire(signal?: AbortSignal): Promise<() => void> {
        signal?.throwIfAborted();
        if (this.active < this.max) {
            this.active++;
            return this.releaser();
        }
        await new Promise<void>((resolve, reject) => {
            const grant = () => {
                signal?.removeEventListener('abort', onAbort);
                resolve();
            };
            const onAbort = () => {
                const index = this.queue.indexOf(grant);
                if (index !== -1) this.queue.splice(index, 1);
                reject(signal!.reason);
            };
            this.queue.push(grant);
            signal?.addEventListener('abort', onAbort, { once: true });
        });
        return this.releaser();
    }

    private releaser(): () => void {
        let released = false;
        return () => {
            if (released) return;
            released = true;
            const next = this.queue.shift();
            if (next) next(); // hand the slot straight to the next waiter
            else this.active--;
        };
    }
}

function defaultSleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(signal.reason);
        const onAbort = () => {
            clearTimeout(timer);
            reject(signal!.reason);
        };
        const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        signal?.addEventListener('abort', onAbort, { once: true });
    });
}

/** `AbortSignal.any`, with a fallback for runtimes that lack it. */
function anySignal(signals: AbortSignal[]): AbortSignal {
    if (signals.length === 1) return signals[0]!;
    if (typeof AbortSignal.any === 'function') return AbortSignal.any(signals);
    const controller = new AbortController();
    for (const s of signals) {
        if (s.aborted) {
            controller.abort(s.reason);
            break;
        }
        s.addEventListener('abort', () => controller.abort(s.reason), { once: true });
    }
    return controller.signal;
}

function safeHook<T>(hook: ((info: T) => void) | undefined, info: T): void {
    if (!hook) return;
    try {
        hook(info);
    } catch {
        // Hooks are for observation only; never let them break a request.
    }
}

function describe(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
