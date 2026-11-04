/**
 * Error classes thrown by Planning Center Kit.
 *
 * Every error extends {@link PcoError}, so `err instanceof PcoError` catches anything the
 * library throws. API responses with a non-2xx status become a {@link PcoApiError} subclass
 * chosen by status code.
 *
 * @see https://api.planningcenteronline.com/docs/overview/errors
 */

/** A single entry from a JSON:API `errors` array. */
export interface PcoErrorObject {
    id?: string;
    status?: string;
    code?: string;
    title?: string;
    detail?: string;
    source?: { pointer?: string; parameter?: string };
    meta?: Record<string, unknown>;
}

/**
 * Error hints Planning Center may include in error responses, with what they mean.
 * @see https://api.planningcenteronline.com/docs/overview/errors
 */
export const PCO_ERROR_HINTS = {
    BLACKBIRD: 'The request includes an unsupported kind parameter.',
    CHINCHILLA: 'The client application was not found or is invalid.',
    FLAMINGO: 'The authenticated user does not exist.',
    LEMMING: 'The authenticated organization does not exist.',
    PELICAN: 'The provided OAuth token does not have a required scope.',
    BABOON: 'The provided OAuth access token is expired.',
    CAPUCHIN: 'The provided OAuth access token has been revoked.',
    TRASH_PANDA: 'The authenticated person does not have access to the requested application.',
    WEASEL: "The signature's scope is not valid for the requested path.",
    ANTEATER: 'Signature validation failed with a missing authorization header.',
    BLUE_JAY: 'Signature authentication failed because the authorization header is an incorrect format.',
    MOCKINGBIRD: 'The signature authentication failed because of an invalid token.',
} as const;

export type PcoErrorHint = keyof typeof PCO_ERROR_HINTS;

/** Base class for every error thrown by this library. */
export class PcoError extends Error {
    constructor(message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = new.target.name;
    }
}

/** Details used to construct a {@link PcoApiError}. */
export interface PcoApiErrorInit {
    status: number;
    method: string;
    url: string;
    errors?: PcoErrorObject[];
    headers?: Headers;
    body?: unknown;
}

/** A non-2xx response from the Planning Center API. */
export class PcoApiError extends PcoError {
    /** HTTP status code. */
    readonly status: number;
    /** HTTP method of the failed request. */
    readonly method: string;
    /** Full URL of the failed request. */
    readonly url: string;
    /** The JSON:API `errors` array from the response, if any. */
    readonly errors: PcoErrorObject[];
    /** Planning Center error hint (e.g. `BABOON`) if one was found in the response. */
    readonly hint?: PcoErrorHint;
    /** Response headers. */
    readonly headers?: Headers;
    /** Parsed response body (or raw text when it was not JSON). */
    readonly body?: unknown;

    constructor(init: PcoApiErrorInit) {
        const errors = init.errors ?? [];
        const hint = findHint(errors, init.body);
        super(formatMessage(init, errors, hint));
        this.status = init.status;
        this.method = init.method;
        this.url = init.url;
        this.errors = errors;
        this.hint = hint;
        this.headers = init.headers;
        this.body = init.body;
    }

    /** Builds the most specific {@link PcoApiError} subclass for a status code. */
    static from(init: PcoApiErrorInit): PcoApiError {
        switch (init.status) {
            case 400: return new PcoBadRequestError(init);
            case 401: return new PcoAuthenticationError(init);
            case 403: return new PcoForbiddenError(init);
            case 404: return new PcoNotFoundError(init);
            case 409: return new PcoConflictError(init);
            case 422: return new PcoValidationError(init);
            case 429: return new PcoRateLimitError(init);
            default:
                return init.status >= 500 ? new PcoServerError(init) : new PcoApiError(init);
        }
    }
}

/** 400: something is wrong with the request. */
export class PcoBadRequestError extends PcoApiError {}
/** 401: missing, invalid, expired, or revoked credentials. Check {@link PcoApiError.hint}. */
export class PcoAuthenticationError extends PcoApiError {}
/** 403: the user can't access this resource or lacks the required role or scope. */
export class PcoForbiddenError extends PcoApiError {}
/** 404: the URL or resource ID doesn't exist. */
export class PcoNotFoundError extends PcoApiError {}
/** 409: a uniqueness conflict, usually from concurrent creates. */
export class PcoConflictError extends PcoApiError {}

/** 422: one or more attributes failed validation. */
export class PcoValidationError extends PcoApiError {
    /** Validation messages keyed by attribute name (from each error's `source.pointer`). */
    get fieldErrors(): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        for (const error of this.errors) {
            const pointer = error.source?.pointer ?? error.source?.parameter;
            const field = pointer ? pointer.split('/').pop() || pointer : 'base';
            (result[field] ??= []).push(error.detail ?? error.title ?? 'is invalid');
        }
        return result;
    }
}

/** 429: rate limit exceeded and retries (if enabled) were exhausted. */
export class PcoRateLimitError extends PcoApiError {
    /** Seconds the API asked us to wait, from the `Retry-After` header (seconds or HTTP date). */
    get retryAfter(): number | undefined {
        const value = this.headers?.get('retry-after')?.trim();
        if (!value) return undefined;
        const seconds = Number(value);
        if (Number.isFinite(seconds)) return Math.max(0, seconds);
        const date = Date.parse(value);
        return Number.isNaN(date) ? undefined : Math.max(0, Math.ceil((date - Date.now()) / 1000));
    }
}

/** 5xx: Planning Center had a problem or is down for maintenance. */
export class PcoServerError extends PcoApiError {}

/** The request never got a response (DNS, connection reset, etc.). */
export class PcoNetworkError extends PcoError {}

/** The request took longer than the configured timeout. */
export class PcoTimeoutError extends PcoError {}

/** Details attached to a {@link PcoOAuthError}. */
export interface PcoOAuthErrorOptions {
    cause?: unknown;
    /** HTTP status of the OAuth endpoint response, when there was one. */
    status?: number;
    /** OAuth `error` code, e.g. `invalid_grant` (the refresh token was already used or revoked). */
    error?: string;
    /** OAuth `error_description`. */
    errorDescription?: string;
}

/**
 * An OAuth endpoint call (code exchange, refresh, revoke, introspect) failed, including automatic
 * token refreshes made by the client.
 *
 * @example
 * ```ts
 * try {
 *     await refreshAccessToken({ clientId, clientSecret, refreshToken });
 * } catch (err) {
 *     if (err instanceof PcoOAuthError && err.error === 'invalid_grant') {
 *         // The refresh token was used or revoked: send the user through OAuth again.
 *     }
 * }
 * ```
 */
export class PcoOAuthError extends PcoError {
    readonly status?: number;
    readonly error?: string;
    readonly errorDescription?: string;

    constructor(message: string, options: PcoOAuthErrorOptions = {}) {
        super(message, { cause: options.cause });
        this.status = options.status;
        this.error = options.error;
        this.errorDescription = options.errorDescription;
    }
}

/** A webhook delivery failed signature verification or could not be parsed. */
export class PcoWebhookError extends PcoError {}

function findHint(errors: PcoErrorObject[], body: unknown): PcoErrorHint | undefined {
    const haystack = [
        ...errors.flatMap((e) => [e.code, e.title, e.detail, typeof e.meta?.hint === 'string' ? e.meta.hint : undefined]),
        typeof body === 'string' ? body : undefined,
    ];
    for (const text of haystack) {
        if (!text) continue;
        for (const hint of Object.keys(PCO_ERROR_HINTS) as PcoErrorHint[]) {
            if (new RegExp(`\\b${hint}\\b`).test(text)) return hint;
        }
    }
    return undefined;
}

function formatMessage(init: PcoApiErrorInit, errors: PcoErrorObject[], hint?: PcoErrorHint): string {
    const details = errors
        .map((e) => [e.title, e.detail].filter(Boolean).join(': '))
        .filter(Boolean)
        .join('; ');
    let message = `${init.method} ${init.url} failed with ${init.status}`;
    if (details) message += `: ${details}`;
    if (hint) message += ` (${hint}: ${PCO_ERROR_HINTS[hint]})`;
    return message;
}
