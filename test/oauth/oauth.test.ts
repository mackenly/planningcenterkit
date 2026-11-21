import { describe, expect, it } from 'vitest';
import {
    PCO_OAUTH_SCOPES,
    createPkceChallenge,
    exchangeCodeForToken,
    getAuthorizationUrl,
    introspectToken,
    normalizeTokens,
    refreshAccessToken,
    revokeToken,
} from '../../src/core/oauth.js';
import { PcoError, PcoNetworkError, PcoOAuthError } from '../../src/core/errors.js';
import { json, mockFetch } from '../http/helpers.js';

const raw = {
    access_token: 'at',
    token_type: 'bearer',
    expires_in: 7200,
    refresh_token: 'rt',
    scope: 'people services',
    created_at: 1469553476,
};

describe('getAuthorizationUrl', () => {
    it('builds the authorize URL with scopes, state, and PKCE', () => {
        const url = new URL(getAuthorizationUrl({
            clientId: 'cid',
            redirectUri: 'https://example.com/auth/complete',
            scopes: ['people', 'services'],
            state: 'xyz',
            codeChallenge: 'chal',
            nonce: 'n',
            prompt: 'select_account',
        }));
        expect(url.origin + url.pathname).toBe('https://api.planningcenteronline.com/oauth/authorize');
        expect(Object.fromEntries(url.searchParams)).toEqual({
            client_id: 'cid',
            redirect_uri: 'https://example.com/auth/complete',
            response_type: 'code',
            scope: 'people services',
            state: 'xyz',
            code_challenge: 'chal',
            code_challenge_method: 'S256',
            nonce: 'n',
            prompt: 'select_account',
        });
    });

    it('omits optional params and honors baseUrl', () => {
        const url = new URL(getAuthorizationUrl({
            clientId: 'cid', redirectUri: 'http://localhost/cb', scopes: ['people'], baseUrl: 'http://localhost:4000',
        }));
        expect(url.origin).toBe('http://localhost:4000');
        expect([...url.searchParams.keys()]).toEqual(['client_id', 'redirect_uri', 'response_type', 'scope']);
    });

    it('validates input', () => {
        expect(() => getAuthorizationUrl({ clientId: '', redirectUri: 'x', scopes: ['people'] })).toThrow(PcoError);
        expect(() => getAuthorizationUrl({ clientId: 'c', redirectUri: 'x', scopes: [] })).toThrow(PcoError);
    });

    it('lists the documented scopes', () => {
        expect(PCO_OAUTH_SCOPES).toContain('check_ins');
        expect(PCO_OAUTH_SCOPES).toContain('openid');
    });
});

describe('createPkceChallenge', () => {
    it('produces an S256 challenge of the verifier', async () => {
        const { codeVerifier, codeChallenge, codeChallengeMethod } = await createPkceChallenge();
        expect(codeChallengeMethod).toBe('S256');
        expect(codeVerifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
        const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier)));
        const expected = btoa(String.fromCharCode(...digest)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        expect(codeChallenge).toBe(expected);
    });
});

describe('token endpoints', () => {
    it('exchanges a code for normalized tokens', async () => {
        const { fetch, calls } = mockFetch([json(raw)]);
        const tokens = await exchangeCodeForToken({
            clientId: 'cid', clientSecret: 'cs', code: 'abc', redirectUri: 'https://example.com/cb', codeVerifier: 'ver', fetch,
        });
        expect(tokens).toEqual({
            accessToken: 'at',
            refreshToken: 'rt',
            expiresAt: (1469553476 + 7200) * 1000,
            scope: ['people', 'services'],
            tokenType: 'bearer',
            raw,
        });
        expect(calls[0]!.url).toBe('https://api.planningcenteronline.com/oauth/token');
        expect(calls[0]!.method).toBe('POST');
        expect(calls[0]!.headers.get('content-type')).toBe('application/x-www-form-urlencoded');
        expect(Object.fromEntries(new URLSearchParams(calls[0]!.body as string))).toEqual({
            grant_type: 'authorization_code',
            code: 'abc',
            client_id: 'cid',
            client_secret: 'cs',
            redirect_uri: 'https://example.com/cb',
            code_verifier: 'ver',
        });
    });

    it('refreshes a token', async () => {
        const { fetch, calls } = mockFetch([json({ ...raw, access_token: 'new', refresh_token: 'rt2' })]);
        const tokens = await refreshAccessToken({ clientId: 'cid', clientSecret: 'cs', refreshToken: 'rt', fetch });
        expect(tokens.accessToken).toBe('new');
        expect(tokens.refreshToken).toBe('rt2');
        expect(Object.fromEntries(new URLSearchParams(calls[0]!.body as string))).toEqual({
            grant_type: 'refresh_token', refresh_token: 'rt', client_id: 'cid', client_secret: 'cs',
        });
    });

    it('throws PcoOAuthError with error and description', async () => {
        const { fetch } = mockFetch([json({ error: 'invalid_grant', error_description: 'The grant is invalid' }, { status: 400 })]);
        const err: any = await refreshAccessToken({ clientId: 'c', clientSecret: 's', refreshToken: 'r', fetch }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoOAuthError);
        expect(err.message).toBe('OAuth token refresh failed with 400: invalid_grant (The grant is invalid)');
        expect(err.cause).toMatchObject({ status: 400, error: 'invalid_grant', error_description: 'The grant is invalid' });
    });

    it('throws PcoOAuthError when the response has no access token', async () => {
        const { fetch } = mockFetch([json({})]);
        await expect(refreshAccessToken({ clientId: 'c', clientSecret: 's', refreshToken: 'r', fetch }))
            .rejects.toBeInstanceOf(PcoOAuthError);
    });

    it('wraps network failures', async () => {
        const fetch = (async () => { throw new TypeError('fetch failed'); }) as unknown as typeof globalThis.fetch;
        await expect(refreshAccessToken({ clientId: 'c', clientSecret: 's', refreshToken: 'r', fetch }))
            .rejects.toBeInstanceOf(PcoNetworkError);
    });

    it('revokes a token', async () => {
        const { fetch, calls } = mockFetch([json({})]);
        await revokeToken({ clientId: 'c', clientSecret: 's', token: 'rt', tokenTypeHint: 'refresh_token', fetch });
        expect(calls[0]!.url).toBe('https://api.planningcenteronline.com/oauth/revoke');
        expect(Object.fromEntries(new URLSearchParams(calls[0]!.body as string))).toEqual({
            token: 'rt', token_type_hint: 'refresh_token', client_id: 'c', client_secret: 's',
        });
    });

    it('introspects a token', async () => {
        const { fetch, calls } = mockFetch([json({ active: true, scope: 'people', exp: 1 }), json({ active: false })]);
        expect(await introspectToken({ clientId: 'c', clientSecret: 's', token: 't', fetch }))
            .toEqual({ active: true, scope: 'people', exp: 1 });
        expect(await introspectToken({ clientId: 'c', clientSecret: 's', token: 't', fetch })).toEqual({ active: false });
        expect(calls[0]!.url).toBe('https://api.planningcenteronline.com/oauth/introspect');
    });

    it('validates required options', async () => {
        await expect(refreshAccessToken({ clientId: 'c', clientSecret: 's', refreshToken: '' })).rejects.toBeInstanceOf(PcoError);
    });
});

describe('normalizeTokens', () => {
    it('computes expiresAt from now when created_at is missing and keeps id_token', () => {
        const before = Date.now();
        const tokens = normalizeTokens({ access_token: 'a', expires_in: 10, id_token: 'jwt' });
        expect(tokens.expiresAt).toBeGreaterThanOrEqual(before + 10_000);
        expect(tokens.expiresAt).toBeLessThanOrEqual(Date.now() + 10_000);
        expect(tokens.idToken).toBe('jwt');
        expect(tokens.refreshToken).toBeUndefined();
    });
});
