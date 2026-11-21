import { describe, expect, it, vi } from 'vitest';
import { createTransport } from '../../src/core/http.js';
import { PcoAuthenticationError, PcoOAuthError } from '../../src/core/errors.js';
import type { OAuthTokens } from '../../src/core/oauth.js';
import { fakeClock, json, mockFetch } from '../http/helpers.js';
import type { Call } from '../http/helpers.js';

const TOKEN_URL = 'https://api.planningcenteronline.com/oauth/token';

function tokenResponse(n: number, createdAt: number) {
    return json({
        access_token: `access${n}`,
        refresh_token: `refresh${n}`,
        token_type: 'bearer',
        expires_in: 7200,
        scope: 'people services',
        created_at: createdAt,
    });
}

function setupOAuth(apiHandler: (call: Call, apiIndex: number) => Response | Promise<Response>, auth: Record<string, unknown> = {}) {
    const clock = fakeClock();
    let refreshes = 0;
    let apiCalls = 0;
    const refreshBodies: URLSearchParams[] = [];
    const mock = mockFetch(async (call) => {
        if (call.url === TOKEN_URL) {
            refreshes++;
            refreshBodies.push(new URLSearchParams(call.body as string));
            await new Promise((r) => setTimeout(r, 5));
            return tokenResponse(refreshes, clock.now() / 1000);
        }
        return apiHandler(call, apiCalls++);
    });
    const onTokenRefresh = vi.fn<(tokens: OAuthTokens) => void>();
    const transport = createTransport(
        {
            auth: {
                accessToken: 'access0',
                refreshToken: 'refresh0',
                clientId: 'cid',
                clientSecret: 'csecret',
                expiresAt: clock.now() + 7_200_000,
                onTokenRefresh,
                ...auth,
            },
            fetch: mock.fetch,
        },
        { now: clock.now, sleep: clock.sleep, random: clock.random },
    );
    return { transport, mock, clock, onTokenRefresh, refreshBodies, refreshCount: () => refreshes };
}

const ok = () => json({ data: [] });
const expired = () => json({ errors: [{ title: 'Unauthorized', detail: 'BABOON' }] }, { status: 401 });
const apiCalls = (calls: Call[]) => calls.filter((c) => c.url !== TOKEN_URL);

describe('OAuth refresh', () => {
    it('refreshes proactively within 60s of expiry and rotates the refresh token', async () => {
        const { transport, mock, clock, onTokenRefresh, refreshBodies } = setupOAuth(() => ok());
        await transport.request({ method: 'GET', path: '/x' });
        expect(apiCalls(mock.calls)[0]!.headers.get('authorization')).toBe('Bearer access0');

        clock.advance(7_200_000 - 30_000);
        await transport.request({ method: 'GET', path: '/x' });
        expect(apiCalls(mock.calls)[1]!.headers.get('authorization')).toBe('Bearer access1');
        expect(refreshBodies[0]!.get('grant_type')).toBe('refresh_token');
        expect(refreshBodies[0]!.get('refresh_token')).toBe('refresh0');
        expect(refreshBodies[0]!.get('client_id')).toBe('cid');
        expect(refreshBodies[0]!.get('client_secret')).toBe('csecret');
        expect(onTokenRefresh).toHaveBeenCalledTimes(1);
        expect(onTokenRefresh.mock.calls[0]![0]).toMatchObject({
            accessToken: 'access1',
            refreshToken: 'refresh1',
            expiresAt: clock.now() + 7_200_000,
            scope: ['people', 'services'],
        });

        // The next refresh must use the rotated refresh token.
        clock.advance(7_200_000);
        await transport.request({ method: 'GET', path: '/x' });
        expect(refreshBodies[1]!.get('refresh_token')).toBe('refresh1');
        expect(apiCalls(mock.calls)[2]!.headers.get('authorization')).toBe('Bearer access2');
    });

    it('accepts expiresAt as a Date', async () => {
        const { transport, refreshCount } = setupOAuth(() => ok(), { expiresAt: new Date(0) });
        await transport.request({ method: 'GET', path: '/x' });
        expect(refreshCount()).toBe(1);
    });

    it('refreshes once on 401 and replays the request', async () => {
        const { transport, mock, onTokenRefresh } = setupOAuth((_c, i) => (i === 0 ? expired() : ok()), { expiresAt: undefined });
        await expect(transport.request({ method: 'POST', path: '/x', body: { a: 1 } })).resolves.toEqual({ data: [] });
        const api = apiCalls(mock.calls);
        expect(api).toHaveLength(2);
        expect(api[1]!.headers.get('authorization')).toBe('Bearer access1');
        expect(api[1]!.body).toBe(JSON.stringify({ a: 1 }));
        expect(onTokenRefresh).toHaveBeenCalledTimes(1);
    });

    it('surfaces the 401 if it persists after one refresh', async () => {
        const { transport, refreshCount } = setupOAuth(() => expired());
        const err: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoAuthenticationError);
        expect(err.hint).toBe('BABOON');
        expect(refreshCount()).toBe(1);
    });

    it('shares one in-flight refresh across concurrent requests', async () => {
        const { transport, mock, refreshCount, onTokenRefresh } = setupOAuth(
            (call) => (call.headers.get('authorization') === 'Bearer access0' ? expired() : ok()),
        );
        await Promise.all(Array.from({ length: 5 }, () => transport.request({ method: 'GET', path: '/x' })));
        expect(refreshCount()).toBe(1);
        expect(onTokenRefresh).toHaveBeenCalledTimes(1);
        expect(apiCalls(mock.calls).filter((c) => c.headers.get('authorization') === 'Bearer access1')).toHaveLength(5);
    });

    it('shares one proactive refresh across concurrent requests', async () => {
        const { transport, refreshCount } = setupOAuth(() => ok(), { expiresAt: 0 });
        await Promise.all(Array.from({ length: 5 }, () => transport.request({ method: 'GET', path: '/x' })));
        expect(refreshCount()).toBe(1);
    });

    it('surfaces PcoAuthenticationError when the token cannot be refreshed', async () => {
        const mock = mockFetch([expired()]);
        const transport = createTransport({ auth: { accessToken: 'old', expiresAt: 0 }, fetch: mock.fetch });
        const err: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoAuthenticationError);
        expect(err.hint).toBe('BABOON');
        expect(mock.calls).toHaveLength(1);
    });

    it('throws PcoOAuthError when the refresh is rejected', async () => {
        const mock = mockFetch((call) => (call.url === TOKEN_URL
            ? json({ error: 'invalid_grant', error_description: 'The provided authorization grant is invalid' }, { status: 400 })
            : expired()));
        const transport = createTransport({
            auth: { accessToken: 'a', refreshToken: 'r', clientId: 'c', clientSecret: 's' },
            fetch: mock.fetch,
        });
        const err: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoOAuthError);
        expect(err.message).toContain('invalid_grant');
    });

    it('falls back to the current token if a proactive refresh fails before expiry', async () => {
        const clock = fakeClock();
        const mock = mockFetch((call) => (call.url === TOKEN_URL ? json({ error: 'server_error' }, { status: 500 }) : ok()));
        const transport = createTransport({
            auth: { accessToken: 'a', refreshToken: 'r', clientId: 'c', clientSecret: 's', expiresAt: clock.now() + 10_000 },
            fetch: mock.fetch,
        }, { now: clock.now, sleep: clock.sleep });
        await expect(transport.request({ method: 'GET', path: '/x' })).resolves.toEqual({ data: [] });
        expect(apiCalls(mock.calls)[0]!.headers.get('authorization')).toBe('Bearer a');
    });

    it('propagates onTokenRefresh failures', async () => {
        const { transport } = setupOAuth(() => ok(), {
            expiresAt: 0,
            onTokenRefresh: () => { throw new Error('db down'); },
        });
        const error = await transport.request({ method: 'GET', path: '/x' }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoOAuthError);
        expect((error as PcoOAuthError).message).toContain('db down');
        expect((error as PcoOAuthError).cause).toBeInstanceOf(Error);
    });

    it('backs off proactive refreshes after one fails, instead of retrying on every request', async () => {
        const clock = fakeClock();
        const mock = mockFetch((call) => (call.url === TOKEN_URL ? json({ error: 'invalid_grant' }, { status: 400 }) : ok()));
        const transport = createTransport({
            auth: { accessToken: 'a', refreshToken: 'r', clientId: 'c', clientSecret: 's', expiresAt: clock.now() + 30_000 },
            fetch: mock.fetch,
        }, { now: clock.now, sleep: clock.sleep });
        for (let i = 0; i < 5; i++) await transport.request({ method: 'GET', path: '/x' });
        expect(mock.calls.filter((c) => c.url === TOKEN_URL)).toHaveLength(1);
        clock.advance(11_000);
        await transport.request({ method: 'GET', path: '/x' });
        expect(mock.calls.filter((c) => c.url === TOKEN_URL)).toHaveLength(2);
    });

    it('does not refresh personal access tokens or token providers on 401', async () => {
        const getAccessToken = vi.fn(() => 'tok');
        const mock = mockFetch([expired()]);
        const transport = createTransport({ auth: { getAccessToken }, fetch: mock.fetch });
        await expect(transport.request({ method: 'GET', path: '/x' })).rejects.toBeInstanceOf(PcoAuthenticationError);
        expect(mock.calls).toHaveLength(1);
    });
});
