/**
 * OAuth 2.0 helpers for Planning Center. They work on their own (no client needed), so you can
 * use them in the route handlers that run your OAuth flow.
 *
 * Planning Center supports the authorization code flow with PKCE (S256), refresh tokens (which
 * rotate on every refresh), token revocation, and token introspection.
 *
 * @see https://api.planningcenteronline.com/docs/overview/authentication
 */
import { PcoError, PcoNetworkError, PcoOAuthError } from './errors.js';

/** Default origin for the OAuth endpoints. */
const DEFAULT_OAUTH_BASE_URL = 'https://api.planningcenteronline.com';

/**
 * Every OAuth scope Planning Center documents. Each product is its own scope; `openid` adds an
 * OpenID Connect `id_token` to the token response. Webhooks endpoints need no scope.
 *
 * `resources` is not in the docs' scope table but is listed in Planning Center's OIDC discovery
 * document (`/.well-known/openid-configuration`).
 */
export const PCO_OAUTH_SCOPES = [
    'api',
    'calendar',
    'check_ins',
    'giving',
    'groups',
    'home',
    'people',
    'publishing',
    'registrations',
    'resources',
    'services',
    'openid',
] as const;

/** A documented Planning Center OAuth scope. */
export type PcoOAuthScope = (typeof PCO_OAUTH_SCOPES)[number];

/**
 * OAuth tokens, normalized from Planning Center's token response.
 *
 * Refresh tokens rotate: every successful refresh returns a new refresh token and the old one
 * stops working, so always persist the latest `refreshToken`.
 */
export interface OAuthTokens {
    /** Bearer token for API requests. Expires 2 hours after it is issued. */
    accessToken: string;
    /** Token used to get a new access token. Honored for up to 90 days. */
    refreshToken?: string;
    /** When the access token expires, in milliseconds since the epoch. */
    expiresAt?: number;
    /** Scopes granted to the token. */
    scope?: string[];
    /** Token type, normally `bearer`. */
    tokenType?: string;
    /** OIDC ID token (a JWT), present when the `openid` scope was granted. */
    idToken?: string;
    /** The token response exactly as Planning Center returned it. */
    raw: Record<string, unknown>;
}

/** Options shared by every helper that calls a Planning Center OAuth endpoint. */
export interface OAuthRequestOptions {
    /** Custom `fetch` implementation. Defaults to the global `fetch`. */
    fetch?: typeof fetch;
    /** OAuth server origin. Defaults to `https://api.planningcenteronline.com`. */
    baseUrl?: string;
    /** Cancels the request. */
    signal?: AbortSignal;
}

/** Options for {@link getAuthorizationUrl}. */
export interface AuthorizationUrlOptions {
    /** Your OAuth application's client ID. */
    clientId: string;
    /** Where Planning Center redirects the user afterwards. Must match your app's settings. */
    redirectUri: string;
    /** Scopes to request, e.g. `['people', 'services']`. */
    scopes: readonly (PcoOAuthScope | (string & {}))[];
    /** Unguessable value to prevent CSRF. Verify it matches when the user is redirected back. */
    state?: string;
    /** PKCE code challenge from {@link createPkceChallenge}. */
    codeChallenge?: string;
    /** PKCE method. Planning Center supports only `S256` (the default when `codeChallenge` is set). */
    codeChallengeMethod?: 'S256';
    /** OIDC nonce, included in the ID token to prevent replay attacks. */
    nonce?: string;
    /** OIDC prompt: `select_account` lets the user pick an account, `login` forces a fresh login. */
    prompt?: 'select_account' | 'login' | (string & {});
    /** OAuth server origin. Defaults to `https://api.planningcenteronline.com`. */
    baseUrl?: string;
}

/** A PKCE verifier/challenge pair. Keep `codeVerifier` secret until you exchange the code. */
export interface PkceChallenge {
    /** High-entropy random string. Send it to {@link exchangeCodeForToken}. */
    codeVerifier: string;
    /** `BASE64URL(SHA-256(codeVerifier))`. Send it to {@link getAuthorizationUrl}. */
    codeChallenge: string;
    /** Always `S256`. */
    codeChallengeMethod: 'S256';
}

/** Options for {@link exchangeCodeForToken}. */
export interface ExchangeCodeOptions extends OAuthRequestOptions {
    clientId: string;
    /** Client secret. Omit only for public applications using PKCE. */
    clientSecret?: string;
    /** The `code` query parameter Planning Center redirected back with. */
    code: string;
    /** The same redirect URI used to build the authorization URL. */
    redirectUri: string;
    /** PKCE verifier, when the authorization URL included a `codeChallenge`. */
    codeVerifier?: string;
}

/** Options for {@link refreshAccessToken}. */
export interface RefreshTokenOptions extends OAuthRequestOptions {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

/** Options for {@link revokeToken}. */
export interface RevokeTokenOptions extends OAuthRequestOptions {
    clientId: string;
    clientSecret: string;
    /** The access token or refresh token to revoke. */
    token: string;
    /** Which kind of token `token` is. Revoking a refresh token also revokes its access token. */
    tokenTypeHint?: 'access_token' | 'refresh_token';
}

/** Options for {@link introspectToken}. */
export interface IntrospectTokenOptions extends OAuthRequestOptions {
    clientId: string;
    clientSecret: string;
    /** The token to inspect. */
    token: string;
}

/** Result of {@link introspectToken}. Inactive, expired, or revoked tokens return `{ active: false }`. */
export interface TokenIntrospection {
    active: boolean;
    scope?: string;
    client_id?: string;
    token_type?: string;
    /** Expiry, in seconds since the epoch. */
    exp?: number;
    /** Issued at, in seconds since the epoch. */
    iat?: number;
    [key: string]: unknown;
}

/**
 * Builds the URL to redirect a user to so they can authorize your application.
 *
 * @example
 * ```ts
 * const pkce = await createPkceChallenge();
 * const url = getAuthorizationUrl({
 *     clientId: process.env.PCO_CLIENT_ID!,
 *     redirectUri: 'https://example.com/auth/complete',
 *     scopes: ['people', 'services'],
 *     state: crypto.randomUUID(),
 *     codeChallenge: pkce.codeChallenge,
 * });
 * return Response.redirect(url);
 * ```
 */
export function getAuthorizationUrl(options: AuthorizationUrlOptions): string {
    requireString(options.clientId, 'clientId');
    requireString(options.redirectUri, 'redirectUri');
    if (!Array.isArray(options.scopes) || options.scopes.length === 0) {
        throw new PcoError('getAuthorizationUrl: `scopes` must list at least one scope, e.g. [\'people\'].');
    }
    const url = new URL('/oauth/authorize', options.baseUrl ?? DEFAULT_OAUTH_BASE_URL);
    const params = url.searchParams;
    params.set('client_id', options.clientId);
    params.set('redirect_uri', options.redirectUri);
    params.set('response_type', 'code');
    params.set('scope', options.scopes.join(' '));
    if (options.state !== undefined) params.set('state', options.state);
    if (options.codeChallenge !== undefined) {
        params.set('code_challenge', options.codeChallenge);
        params.set('code_challenge_method', options.codeChallengeMethod ?? 'S256');
    }
    if (options.nonce !== undefined) params.set('nonce', options.nonce);
    if (options.prompt !== undefined) params.set('prompt', options.prompt);
    return url.toString();
}

/**
 * Generates a PKCE code verifier and its S256 code challenge using WebCrypto.
 *
 * @example
 * ```ts
 * const { codeVerifier, codeChallenge } = await createPkceChallenge();
 * // store codeVerifier in the session, put codeChallenge in the authorization URL
 * ```
 */
export async function createPkceChallenge(): Promise<PkceChallenge> {
    const bytes = new Uint8Array(32);
    globalThis.crypto.getRandomValues(bytes);
    const codeVerifier = base64Url(bytes);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    return { codeVerifier, codeChallenge: base64Url(new Uint8Array(digest)), codeChallengeMethod: 'S256' };
}

/**
 * Exchanges the authorization `code` from the redirect for access and refresh tokens.
 *
 * @throws {@link PcoOAuthError} with Planning Center's `error`/`error_description` on failure.
 * @example
 * ```ts
 * const tokens = await exchangeCodeForToken({
 *     clientId, clientSecret,
 *     code: url.searchParams.get('code')!,
 *     redirectUri: 'https://example.com/auth/complete',
 *     codeVerifier: session.codeVerifier,
 * });
 * await db.saveTokens(tokens);
 * ```
 */
export async function exchangeCodeForToken(options: ExchangeCodeOptions): Promise<OAuthTokens> {
    requireString(options.clientId, 'clientId');
    requireString(options.code, 'code');
    requireString(options.redirectUri, 'redirectUri');
    const params: Record<string, string | undefined> = {
        grant_type: 'authorization_code',
        code: options.code,
        client_id: options.clientId,
        client_secret: options.clientSecret,
        redirect_uri: options.redirectUri,
        code_verifier: options.codeVerifier,
    };
    return normalizeTokens(await tokenRequest('/oauth/token', params, options, 'token exchange'));
}

/**
 * Uses a refresh token to get a new access token.
 *
 * Refresh tokens ROTATE: the response contains a new refresh token and the one you sent stops
 * working. Persist the returned tokens before using them, or the user will have to re-authorize.
 *
 * @throws {@link PcoOAuthError} with Planning Center's `error`/`error_description` on failure.
 * @example
 * ```ts
 * const tokens = await refreshAccessToken({ clientId, clientSecret, refreshToken: saved.refreshToken });
 * await db.saveTokens(tokens); // the old refresh token is now invalid
 * ```
 */
export async function refreshAccessToken(options: RefreshTokenOptions): Promise<OAuthTokens> {
    requireString(options.clientId, 'clientId');
    requireString(options.clientSecret, 'clientSecret');
    requireString(options.refreshToken, 'refreshToken');
    const params = {
        grant_type: 'refresh_token',
        refresh_token: options.refreshToken,
        client_id: options.clientId,
        client_secret: options.clientSecret,
    };
    return normalizeTokens(await tokenRequest('/oauth/token', params, options, 'token refresh'));
}

/**
 * Revokes an access token or refresh token, e.g. when a user disconnects your integration.
 * Planning Center returns success even if the token was already revoked or invalid.
 *
 * @example
 * ```ts
 * await revokeToken({ clientId, clientSecret, token: saved.refreshToken, tokenTypeHint: 'refresh_token' });
 * ```
 */
export async function revokeToken(options: RevokeTokenOptions): Promise<void> {
    requireString(options.clientId, 'clientId');
    requireString(options.clientSecret, 'clientSecret');
    requireString(options.token, 'token');
    await tokenRequest('/oauth/revoke', {
        token: options.token,
        token_type_hint: options.tokenTypeHint,
        client_id: options.clientId,
        client_secret: options.clientSecret,
    }, options, 'token revocation');
}

/**
 * Checks whether a token is still active and returns its metadata.
 *
 * @example
 * ```ts
 * const { active, scope } = await introspectToken({ clientId, clientSecret, token: accessToken });
 * ```
 */
export async function introspectToken(options: IntrospectTokenOptions): Promise<TokenIntrospection> {
    requireString(options.clientId, 'clientId');
    requireString(options.clientSecret, 'clientSecret');
    requireString(options.token, 'token');
    const raw = await tokenRequest('/oauth/introspect', {
        token: options.token,
        client_id: options.clientId,
        client_secret: options.clientSecret,
    }, options, 'token introspection');
    return { ...raw, active: raw.active === true };
}

/**
 * Normalizes a raw Planning Center token response (`access_token`, `expires_in`, `created_at`,
 * ...) into {@link OAuthTokens}. Useful if you already have a stored raw response.
 *
 * `expiresAt` is `(created_at + expires_in) * 1000`, using the current time when `created_at`
 * is missing.
 */
export function normalizeTokens(raw: Record<string, unknown>): OAuthTokens {
    const accessToken = raw.access_token;
    if (typeof accessToken !== 'string' || accessToken === '') {
        throw new PcoOAuthError('OAuth token response did not include an access_token.', { cause: { body: raw } });
    }
    const tokens: OAuthTokens = { accessToken, raw };
    if (typeof raw.refresh_token === 'string' && raw.refresh_token) tokens.refreshToken = raw.refresh_token;
    const expiresIn = toNumber(raw.expires_in);
    if (expiresIn !== undefined) {
        const createdAt = toNumber(raw.created_at) ?? Date.now() / 1000;
        tokens.expiresAt = Math.round((createdAt + expiresIn) * 1000);
    }
    if (typeof raw.scope === 'string' && raw.scope.trim()) tokens.scope = raw.scope.trim().split(/\s+/);
    if (typeof raw.token_type === 'string') tokens.tokenType = raw.token_type;
    if (typeof raw.id_token === 'string') tokens.idToken = raw.id_token;
    return tokens;
}

async function tokenRequest(
    path: string,
    params: Record<string, string | undefined>,
    options: OAuthRequestOptions,
    what: string,
): Promise<Record<string, unknown>> {
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) body.set(key, value);
    }
    const url = new URL(path, options.baseUrl ?? DEFAULT_OAUTH_BASE_URL).toString();
    const fetchImpl = options.fetch ?? globalThis.fetch;
    let response: Response;
    let text: string;
    try {
        response = await fetchImpl(url, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            signal: options.signal,
        });
        text = await response.text();
    } catch (error) {
        if (options.signal?.aborted) throw options.signal.reason;
        throw new PcoNetworkError(`OAuth ${what} request to ${url} failed: ${describe(error)}`, { cause: error });
    }
    let parsed: unknown = undefined;
    if (text.trim()) {
        try {
            parsed = JSON.parse(text);
        } catch {
            parsed = text;
        }
    }
    const json = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    if (!response.ok) {
        const error = typeof json.error === 'string' ? json.error : undefined;
        const description = typeof json.error_description === 'string' ? json.error_description : undefined;
        let message = `OAuth ${what} failed with ${response.status}`;
        if (error) message += `: ${error}`;
        if (description) message += ` (${description})`;
        throw new PcoOAuthError(message, {
            cause: { status: response.status, error, error_description: description, body: parsed },
            status: response.status,
            error,
            errorDescription: description,
        });
    }
    return json;
}

function requireString(value: unknown, name: string): void {
    if (typeof value !== 'string' || value === '') {
        throw new PcoError(`OAuth: \`${name}\` must be a non-empty string.`);
    }
}

function toNumber(value: unknown): number | undefined {
    const n = typeof value === 'string' ? Number(value) : value;
    return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
}

function base64Url(bytes: Uint8Array): string {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function describe(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
