/**
 * Authentication strategies. Pass one of these shapes as `auth` when creating a client:
 *
 * - {@link PersonalAccessTokenAuth}: `{ applicationId, secret }` for scripts and servers you control
 * - {@link OAuthAuth}: `{ accessToken, ... }` for apps used by multiple organizations, with
 *   automatic refresh when you also pass `refreshToken`, `clientId`, and `clientSecret`
 * - {@link TokenProviderAuth}: `{ getAccessToken }` when you manage tokens yourself
 *
 * @see https://api.planningcenteronline.com/docs/overview/authentication
 */
import { PcoError, PcoOAuthError } from './errors.js';
import { refreshAccessToken } from './oauth.js';
import type { OAuthTokens } from './oauth.js';

/**
 * Personal access token (PAT), sent as HTTP Basic auth.
 * Create one at https://api.planningcenteronline.com/oauth/applications.
 *
 * @example
 * ```ts
 * const auth = { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! };
 * ```
 */
export interface PersonalAccessTokenAuth {
    /** The personal access token's Application ID. */
    applicationId: string;
    /** The personal access token's secret. */
    secret: string;
}

/**
 * OAuth 2.0 access token, sent as a Bearer token.
 *
 * When `refreshToken`, `clientId`, and `clientSecret` are all set, the client refreshes the
 * access token automatically: shortly before `expiresAt`, and once after any 401 response.
 *
 * IMPORTANT: Planning Center refresh tokens ROTATE. Each refresh returns a new refresh token and
 * invalidates the old one. The client keeps the new tokens in memory, but you must persist them
 * in `onTokenRefresh`, or after a restart you will be holding a dead refresh token and the user
 * will have to re-authorize.
 *
 * @example
 * ```ts
 * const auth = {
 *     accessToken: saved.accessToken,
 *     refreshToken: saved.refreshToken,
 *     expiresAt: saved.expiresAt,
 *     clientId: process.env.PCO_CLIENT_ID!,
 *     clientSecret: process.env.PCO_CLIENT_SECRET!,
 *     onTokenRefresh: (tokens) => db.saveTokens(userId, tokens),
 * };
 * ```
 */
export interface OAuthAuth {
    /** Current access token. */
    accessToken: string;
    /** Refresh token. Required (with `clientId` and `clientSecret`) for automatic refresh. */
    refreshToken?: string;
    /** OAuth application client ID. */
    clientId?: string;
    /** OAuth application client secret. */
    clientSecret?: string;
    /** When `accessToken` expires: milliseconds since the epoch, or a `Date`. */
    expiresAt?: number | Date;
    /**
     * Called after every successful refresh with the new tokens (including the rotated refresh
     * token). Persist them here. If it throws or rejects, the request that triggered the refresh
     * fails with a `PcoOAuthError` whose `cause` is your error; the new tokens are still used in
     * memory.
     */
    onTokenRefresh?: (tokens: OAuthTokens) => void | Promise<void>;
}

/**
 * Supplies a Bearer token per request, for when your app owns token storage and refresh.
 *
 * @example
 * ```ts
 * const auth = { getAccessToken: () => tokenStore.getFreshToken(userId) };
 * ```
 */
export interface TokenProviderAuth {
    /** Returns the access token to use. Called before every request attempt. */
    getAccessToken: () => string | Promise<string>;
}

/** Any supported authentication strategy, distinguished by shape. */
export type PcoAuth = PersonalAccessTokenAuth | OAuthAuth | TokenProviderAuth;

/** Refresh the access token this long before it expires. */
const REFRESH_SKEW_MS = 60_000;

/**
 * Applies credentials to requests. Created by the transport from a {@link PcoAuth}.
 * @internal
 */
export interface Authenticator {
    /** Returns the `Authorization` header value for the next attempt. */
    getAuthorization(signal?: AbortSignal): Promise<string>;
    /**
     * Called after a 401. Returns `true` when credentials changed (refreshed) and the request
     * should be replayed with a fresh {@link getAuthorization} value.
     */
    handleUnauthorized(usedAuthorization: string, signal?: AbortSignal): Promise<boolean>;
}

/** Dependencies {@link createAuthenticator} needs from the transport. @internal */
export interface AuthenticatorContext {
    /** Returns the fetch implementation to use for token refreshes. */
    fetch: () => typeof fetch;
    /** Origin of the OAuth server (normally the API base URL). */
    baseUrl: string;
    /** Current time in ms. */
    now: () => number;
}

/**
 * Checks that `auth` is exactly one valid {@link PcoAuth} shape, throwing a {@link PcoError}
 * that explains what is wrong otherwise.
 */
export function validateAuth(auth: unknown): asserts auth is PcoAuth {
    if (!auth || typeof auth !== 'object') {
        throw new PcoError(
            'auth is required: pass { applicationId, secret } (personal access token), '
            + '{ accessToken } (OAuth), or { getAccessToken } (token provider).',
        );
    }
    const a = auth as Record<string, unknown>;
    const kinds = [
        ('applicationId' in a || 'secret' in a) && 'personal access token (applicationId/secret)',
        'accessToken' in a && 'OAuth (accessToken)',
        'getAccessToken' in a && 'token provider (getAccessToken)',
    ].filter(Boolean);
    if (kinds.length === 0) {
        throw new PcoError(
            'auth must have applicationId and secret (personal access token), accessToken (OAuth), '
            + 'or getAccessToken (token provider).',
        );
    }
    if (kinds.length > 1) {
        throw new PcoError(`auth mixes ${kinds.join(' and ')}; use exactly one strategy.`);
    }
    if ('getAccessToken' in a) {
        if (typeof a.getAccessToken !== 'function') throw new PcoError('auth.getAccessToken must be a function.');
        return;
    }
    if ('accessToken' in a) {
        nonEmpty(a.accessToken, 'auth.accessToken');
        for (const key of ['refreshToken', 'clientId', 'clientSecret'] as const) {
            if (a[key] !== undefined) nonEmpty(a[key], `auth.${key}`);
        }
        const refreshFields = [a.refreshToken, a.clientId, a.clientSecret].filter((v) => v !== undefined).length;
        if (refreshFields !== 0 && refreshFields !== 3) {
            throw new PcoError(
                'auth: automatic OAuth refresh needs refreshToken, clientId, and clientSecret together; '
                + 'pass all three, or none to use the access token as-is.',
            );
        }
        if (a.expiresAt !== undefined && toEpochMs(a.expiresAt) === undefined) {
            throw new PcoError('auth.expiresAt must be a millisecond timestamp or a valid Date.');
        }
        if (a.onTokenRefresh !== undefined && typeof a.onTokenRefresh !== 'function') {
            throw new PcoError('auth.onTokenRefresh must be a function.');
        }
        return;
    }
    nonEmpty(a.applicationId, 'auth.applicationId');
    nonEmpty(a.secret, 'auth.secret');
}

/**
 * Builds an {@link Authenticator} for a validated {@link PcoAuth}.
 * @internal
 */
export function createAuthenticator(auth: PcoAuth, context: AuthenticatorContext): Authenticator {
    validateAuth(auth);
    if ('getAccessToken' in auth) {
        const provider = auth.getAccessToken;
        return {
            async getAuthorization() {
                const token = await provider();
                if (typeof token !== 'string' || token === '') {
                    throw new PcoError('auth.getAccessToken() must return a non-empty string.');
                }
                return `Bearer ${token}`;
            },
            async handleUnauthorized() {
                return false;
            },
        };
    }
    if ('accessToken' in auth) return createOAuthAuthenticator(auth, context);
    const header = `Basic ${base64Utf8(`${auth.applicationId}:${auth.secret}`)}`;
    return {
        async getAuthorization() {
            return header;
        },
        async handleUnauthorized() {
            return false;
        },
    };
}

function createOAuthAuthenticator(auth: OAuthAuth, context: AuthenticatorContext): Authenticator {
    let accessToken = auth.accessToken;
    let refreshToken = auth.refreshToken;
    let expiresAt = toEpochMs(auth.expiresAt);
    const { clientId, clientSecret, onTokenRefresh } = auth;
    const canRefresh = Boolean(refreshToken && clientId && clientSecret);
    let inFlight: Promise<void> | undefined;
    // After a proactive refresh fails while the old token is still valid, wait before trying
    // again, so a dead refresh token doesn't cost one failing token request per API call.
    let proactiveRetryAt = 0;

    // Single-flight: concurrent callers share one refresh. Not tied to any caller's signal, so
    // one caller aborting doesn't cancel the refresh for everyone else.
    function refresh(): Promise<void> {
        inFlight ??= (async () => {
            try {
                const tokens = await refreshAccessToken({
                    clientId: clientId!,
                    clientSecret: clientSecret!,
                    refreshToken: refreshToken!,
                    fetch: context.fetch(),
                    baseUrl: context.baseUrl,
                });
                accessToken = tokens.accessToken;
                // Refresh tokens rotate; fall back to the old one only if none was returned.
                if (tokens.refreshToken) refreshToken = tokens.refreshToken;
                else tokens.refreshToken = refreshToken;
                expiresAt = tokens.expiresAt;
                await onTokenRefresh?.(tokens);
            } finally {
                inFlight = undefined;
            }
        })();
        return inFlight;
    }

    return {
        async getAuthorization(signal) {
            const now = context.now();
            const due = canRefresh && expiresAt !== undefined && now >= expiresAt - REFRESH_SKEW_MS && now >= proactiveRetryAt;
            if (inFlight || due) {
                const before = accessToken;
                try {
                    await raceAbort(inFlight ?? refresh(), signal);
                } catch (error) {
                    if (signal?.aborted) throw signal.reason;
                    // A changed token means the refresh worked and onTokenRefresh threw: surface it.
                    // Otherwise the old token may still be valid for a few seconds; only fail once it isn't.
                    if (accessToken !== before || context.now() >= (expiresAt ?? 0)) throw toOAuthError(error);
                    proactiveRetryAt = context.now() + PROACTIVE_RETRY_COOLDOWN_MS;
                }
            }
            return `Bearer ${accessToken}`;
        },
        async handleUnauthorized(usedAuthorization, signal) {
            if (!canRefresh) return false;
            // Another request already refreshed since this one was sent: just replay.
            if (usedAuthorization !== `Bearer ${accessToken}`) return true;
            try {
                await raceAbort(inFlight ?? refresh(), signal);
            } catch (error) {
                if (signal?.aborted) throw signal.reason;
                throw toOAuthError(error);
            }
            return true;
        },
    };
}

const PROACTIVE_RETRY_COOLDOWN_MS = 10_000;

/** Every refresh failure surfaces as a {@link PcoOAuthError}; the original error is its `cause`. */
function toOAuthError(error: unknown): PcoOAuthError {
    if (error instanceof PcoOAuthError) return error;
    return new PcoOAuthError(`OAuth token refresh failed: ${String((error as Error)?.message ?? error)}`, { cause: error });
}

/** Waits for `promise`, rejecting early with the abort reason if `signal` aborts. */
function raceAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
    if (!signal) return promise;
    if (signal.aborted) return Promise.reject(signal.reason);
    return new Promise<T>((resolve, reject) => {
        const onAbort = () => reject(signal.reason);
        signal.addEventListener('abort', onAbort, { once: true });
        promise.then(
            (value) => {
                signal.removeEventListener('abort', onAbort);
                resolve(value);
            },
            (error) => {
                signal.removeEventListener('abort', onAbort);
                reject(error);
            },
        );
    });
}

function nonEmpty(value: unknown, name: string): void {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new PcoError(`${name} must be a non-empty string.`);
    }
}

function toEpochMs(value: unknown): number | undefined {
    if (value === undefined) return undefined;
    const ms = value instanceof Date ? value.getTime() : value;
    return typeof ms === 'number' && Number.isFinite(ms) ? ms : undefined;
}

function base64Utf8(text: string): string {
    let binary = '';
    for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
    return btoa(binary);
}
