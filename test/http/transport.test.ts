import { describe, expect, it, vi } from 'vitest';
import { createTransport, encodeQuery } from '../../src/core/http.js';
import {
    PcoAuthenticationError,
    PcoError,
    PcoNetworkError,
    PcoNotFoundError,
    PcoRateLimitError,
    PcoServerError,
    PcoTimeoutError,
    PcoValidationError,
} from '../../src/core/errors.js';
import { PAT, fakeClock, json, mockFetch, setup } from './helpers.js';

const ok = () => json({ data: [] });

describe('headers and auth', () => {
    it('sends PAT as Basic auth with default headers', async () => {
        const { transport, calls } = setup([ok()]);
        await transport.request({ method: 'GET', path: '/people/v2/people' });
        const h = calls[0]!.headers;
        expect(h.get('authorization')).toBe(`Basic ${btoa('app:shh')}`);
        expect(h.get('accept')).toBe('application/json');
        expect(h.get('content-type')).toBeNull();
        expect(h.get('x-pco-api-version')).toBeNull();
        expect(h.get('user-agent')).toBe('planningcenterkit');
        expect(calls[0]!.url).toBe('https://api.planningcenteronline.com/people/v2/people');
    });

    it('encodes PAT credentials as UTF-8', async () => {
        const { transport, calls } = setup([ok()], { auth: { applicationId: 'é', secret: '✓' } });
        await transport.request({ method: 'GET', path: '/x' });
        const encoded = calls[0]!.headers.get('authorization')!.slice('Basic '.length);
        const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
        expect(new TextDecoder().decode(bytes)).toBe('é:✓');
    });

    it('sends an OAuth access token as Bearer', async () => {
        const { transport, calls } = setup([ok()], { auth: { accessToken: 'tok' } });
        await transport.request({ method: 'GET', path: '/x' });
        expect(calls[0]!.headers.get('authorization')).toBe('Bearer tok');
    });

    it('calls a token provider per request', async () => {
        let n = 0;
        const getAccessToken = vi.fn(async () => `t${++n}`);
        const { transport, calls } = setup([ok(), ok()], { auth: { getAccessToken } });
        await transport.request({ method: 'GET', path: '/x' });
        await transport.request({ method: 'GET', path: '/x' });
        expect(calls.map((c) => c.headers.get('authorization'))).toEqual(['Bearer t1', 'Bearer t2']);
    });

    it('does not retry when a token provider throws', async () => {
        const { transport, calls } = setup([ok()], {
            auth: { getAccessToken: () => { throw new Error('no token'); } },
        });
        await expect(transport.request({ method: 'GET', path: '/x' })).rejects.toThrow('no token');
        expect(calls).toHaveLength(0);
    });

    it('sets version, user agent suffix, default and per-request headers', async () => {
        const { transport, calls } = setup([ok()], { userAgent: 'my-app/1.0', headers: { 'X-Default': 'a' } });
        await transport.request({ method: 'GET', path: '/x', version: '2023-03-21', headers: { 'X-Extra': 'b' } });
        const h = calls[0]!.headers;
        expect(h.get('x-pco-api-version')).toBe('2023-03-21');
        expect(h.get('user-agent')).toBe('planningcenterkit my-app/1.0');
        expect(h.get('x-default')).toBe('a');
        expect(h.get('x-extra')).toBe('b');
    });

    it('serializes JSON bodies with a content type', async () => {
        const { transport, calls } = setup([json({ data: { id: '1' } }, { status: 201 })]);
        const body = { data: { attributes: { first_name: 'Ada' } } };
        const res = await transport.request({ method: 'POST', path: '/people/v2/people', body });
        expect(res).toEqual({ data: { id: '1' } });
        expect(calls[0]!.method).toBe('POST');
        expect(calls[0]!.headers.get('content-type')).toBe('application/json');
        expect(calls[0]!.body).toBe(JSON.stringify(body));
    });

    it('returns undefined for 204 and empty bodies', async () => {
        const { transport } = setup([new Response(null, { status: 204 }), new Response('', { status: 200 })]);
        expect(await transport.request({ method: 'DELETE', path: '/x' })).toBeUndefined();
        expect(await transport.request({ method: 'GET', path: '/x' })).toBeUndefined();
    });

    it('rejects invalid auth configs', () => {
        const f = mockFetch([]).fetch;
        const bad: unknown[] = [
            undefined,
            {},
            { applicationId: '', secret: 'x' },
            { applicationId: 'a' },
            { applicationId: 'a', secret: 's', accessToken: 't' },
            { accessToken: '' },
            { accessToken: 't', refreshToken: 'r' },
            { accessToken: 't', expiresAt: 'tomorrow' },
            { getAccessToken: 'nope' },
        ];
        for (const auth of bad) {
            expect(() => createTransport({ auth: auth as never, fetch: f })).toThrow(PcoError);
        }
    });
});

describe('query encoding', () => {
    it('encodes keys verbatim, arrays, dates, booleans, and skips nullish', () => {
        expect(encodeQuery({
            'where[created_at][gte]': new Date('2026-01-01T00:00:00Z'),
            'where[first_name]': 'Tim%',
            include: ['emails', 'phone_numbers'],
            per_page: 50,
            active: true,
            off: false,
            skip: undefined,
            none: null,
            name: 'a b&c',
        })).toBe([
            'where%5Bcreated_at%5D%5Bgte%5D=2026-01-01T00%3A00%3A00.000Z',
            'where%5Bfirst_name%5D=Tim%25',
            'include=emails%2Cphone_numbers',
            'per_page=50',
            'active=true',
            'off=false',
            'name=a%20b%26c',
        ].join('&'));
    });

    it('arrives on the URL with % encoded as %25', async () => {
        const { transport, calls } = setup([ok()]);
        await transport.request({ method: 'GET', path: '/people/v2/people', query: { 'where[first_name]': 'Tim%' } });
        const url = new URL(calls[0]!.url);
        expect(url.search).toBe('?where%5Bfirst_name%5D=Tim%25');
        expect(url.searchParams.get('where[first_name]')).toBe('Tim%');
    });
});

describe('absolute URLs', () => {
    it('allows same-origin absolute URLs (links.next)', async () => {
        const { transport, calls } = setup([ok()]);
        const next = 'https://api.planningcenteronline.com/people/v2/people?offset=25&per_page=25';
        await transport.request({ method: 'GET', path: next });
        expect(calls[0]!.url).toBe(next);
    });

    it('merges query into an absolute URL, overriding duplicate keys', async () => {
        const { transport, calls } = setup([ok()]);
        await transport.request({
            method: 'GET',
            path: 'https://api.planningcenteronline.com/people/v2/people?offset=25&per_page=25',
            query: { per_page: 100 },
        });
        expect(calls[0]!.url).toBe('https://api.planningcenteronline.com/people/v2/people?offset=25&per_page=100');
    });

    it('rejects cross-origin absolute URLs without sending anything', async () => {
        const { transport, calls } = setup([ok()]);
        for (const path of [
            'https://evil.example.com/people/v2/people',
            'http://api.planningcenteronline.com/people/v2/people',
            'https://api.planningcenteronline.com.evil.com/x',
        ]) {
            await expect(transport.request({ method: 'GET', path })).rejects.toBeInstanceOf(PcoError);
        }
        expect(calls).toHaveLength(0);
    });
});

describe('errors', () => {
    it('maps statuses to subclasses with hints', async () => {
        const { transport } = setup([
            json({ errors: [{ code: 'not_found', title: 'Not Found', detail: 'nope' }] }, { status: 404 }),
            json({ errors: [{ title: 'Unauthorized', detail: 'BABOON' }] }, { status: 401 }),
            json({ errors: [{ title: 'Invalid', detail: "can't be blank", source: { pointer: '/data/attributes/first_name' } }] }, { status: 422 }),
        ]);
        const notFound: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(notFound).toBeInstanceOf(PcoNotFoundError);
        expect(notFound.status).toBe(404);
        expect(notFound.method).toBe('GET');
        expect(notFound.url).toBe('https://api.planningcenteronline.com/x');
        expect(notFound.errors[0].detail).toBe('nope');

        const expired: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(expired).toBeInstanceOf(PcoAuthenticationError);
        expect(expired.hint).toBe('BABOON');

        const invalid: any = await transport.request({ method: 'POST', path: '/x', body: {} }).catch((e: any) => e);
        expect(invalid).toBeInstanceOf(PcoValidationError);
        expect(invalid.fieldErrors).toEqual({ first_name: ["can't be blank"] });
    });

    it('keeps non-JSON error bodies as text', async () => {
        const { transport } = setup([new Response('Bad Gateway', { status: 502 })], { retry: { maxRetries: 0 } });
        const err: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoServerError);
        expect(err.body).toBe('Bad Gateway');
    });
});

describe('rate limiting', () => {
    const tooMany = (retryAfter?: string) => json(
        { errors: [{ code: '429', detail: 'Rate limit exceeded' }] },
        { status: 429, headers: retryAfter ? { 'Retry-After': retryAfter } : {} },
    );

    it('waits Retry-After and retries a 429, even for POST', async () => {
        const { transport, calls, clock } = setup([tooMany('3'), json({ data: { id: '1' } })]);
        const onRetry = vi.fn();
        const t = createTransport(
            { auth: PAT, fetch: mockFetch([tooMany('3'), ok()]).fetch, hooks: { onRetry } },
            { now: clock.now, sleep: clock.sleep, random: clock.random },
        );
        await t.request({ method: 'GET', path: '/x' });
        expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({ reason: 'rate_limit', delayMs: 3000, status: 429, attempt: 0 }));

        clock.sleeps.length = 0;
        const res = await transport.request({ method: 'POST', path: '/x', body: { a: 1 } });
        expect(res).toEqual({ data: { id: '1' } });
        expect(calls).toHaveLength(2);
        expect(clock.sleeps).toEqual([3000]);
        expect(calls[1]!.body).toBe(JSON.stringify({ a: 1 }));
    });

    it('falls back to backoff when Retry-After is missing', async () => {
        const { transport, clock } = setup([tooMany(), ok()]);
        await transport.request({ method: 'GET', path: '/x' });
        expect(clock.sleeps).toEqual([250]); // 0.5 * 500ms
    });

    it('throws PcoRateLimitError immediately when Retry-After exceeds the cap', async () => {
        const { transport, calls, clock } = setup([tooMany('120')]);
        const err: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoRateLimitError);
        expect(err.retryAfter).toBe(120);
        expect(calls).toHaveLength(1);
        expect(clock.sleeps).toEqual([]);
    });

    it('throws PcoRateLimitError after retries are exhausted', async () => {
        const { transport, calls } = setup([tooMany('1'), tooMany('1'), tooMany('1')], { retry: { maxRetries: 2 } });
        await expect(transport.request({ method: 'GET', path: '/x' })).rejects.toBeInstanceOf(PcoRateLimitError);
        expect(calls).toHaveLength(3);
    });

    it('proactively waits when the reported count reaches the limit', async () => {
        const limited = (count: number) => json({ data: [] }, {
            headers: {
                'X-PCO-API-Request-Rate-Limit': '100',
                'X-PCO-API-Request-Rate-Count': String(count),
                'X-PCO-API-Request-Rate-Period': '20 seconds',
            },
        });
        const onThrottle = vi.fn();
        const { transport, clock } = setup([limited(99), limited(100), limited(1)], { hooks: { onThrottle } });
        await transport.request({ method: 'GET', path: '/x' });
        clock.advance(1000);
        await transport.request({ method: 'GET', path: '/x' });
        expect(clock.sleeps).toEqual([]);
        await transport.request({ method: 'GET', path: '/x' });
        expect(clock.sleeps).toEqual([19_000]);
        expect(onThrottle).toHaveBeenCalledWith(expect.objectContaining({ delayMs: 19_000 }));
    });

    it('does not restart the rate window because of its own in-flight requests', async () => {
        const limited = (count: number) => json({ data: [] }, {
            headers: {
                'X-PCO-API-Request-Rate-Limit': '3',
                'X-PCO-API-Request-Rate-Count': String(count),
                'X-PCO-API-Request-Rate-Period': '20 seconds',
            },
        });
        const { transport, clock } = setup([limited(1), limited(2), limited(3), limited(1)]);
        await transport.request({ method: 'GET', path: '/x' }); // t=0, window starts
        clock.advance(10_000);
        await Promise.all([transport.request({ method: 'GET', path: '/x' }), transport.request({ method: 'GET', path: '/x' })]);
        clock.advance(5_000); // t=15s, limit reached; the server window resets at t=20s
        await transport.request({ method: 'GET', path: '/x' });
        expect(clock.sleeps).toEqual([5_000]);
    });

    it('does not throttle when disabled', async () => {
        const full = () => json({}, {
            headers: { 'X-PCO-API-Request-Rate-Limit': '1', 'X-PCO-API-Request-Rate-Count': '5', 'X-PCO-API-Request-Rate-Period': '20 seconds' },
        });
        const { transport, clock } = setup([full(), full()], { rateLimit: { throttle: false } });
        await transport.request({ method: 'GET', path: '/x' });
        await transport.request({ method: 'GET', path: '/x' });
        expect(clock.sleeps).toEqual([]);
    });

    it('uses the period unit from the header', async () => {
        const full = json({}, {
            headers: { 'X-PCO-API-Request-Rate-Limit': '10', 'X-PCO-API-Request-Rate-Count': '10', 'X-PCO-API-Request-Rate-Period': '1 minute' },
        });
        const { transport, clock } = setup([full, ok()]);
        await transport.request({ method: 'GET', path: '/x' });
        await transport.request({ method: 'GET', path: '/x' });
        expect(clock.sleeps).toEqual([60_000]);
    });
});

describe('retries', () => {
    const boom = () => json({ errors: [{ title: 'Server Error' }] }, { status: 503 });

    it('retries 5xx for GET with exponential backoff', async () => {
        const { transport, calls, clock } = setup([boom(), boom(), ok()]);
        await transport.request({ method: 'GET', path: '/x' });
        expect(calls).toHaveLength(3);
        expect(clock.sleeps).toEqual([250, 500]);
    });

    it('retries 5xx for DELETE', async () => {
        const { transport, calls } = setup([boom(), new Response(null, { status: 204 })]);
        await transport.request({ method: 'DELETE', path: '/x' });
        expect(calls).toHaveLength(2);
    });

    it('does not retry 5xx for POST or PATCH', async () => {
        const { transport, calls } = setup([boom(), boom()]);
        await expect(transport.request({ method: 'POST', path: '/x', body: {} })).rejects.toBeInstanceOf(PcoServerError);
        await expect(transport.request({ method: 'PATCH', path: '/x', body: {} })).rejects.toBeInstanceOf(PcoServerError);
        expect(calls).toHaveLength(2);
    });

    it('does not retry 5xx when retryServerErrors is false', async () => {
        const { transport, calls } = setup([boom()], { retry: { retryServerErrors: false } });
        await expect(transport.request({ method: 'GET', path: '/x' })).rejects.toBeInstanceOf(PcoServerError);
        expect(calls).toHaveLength(1);
    });

    it('gives up after maxRetries', async () => {
        const { transport, calls } = setup([boom(), boom(), boom(), boom()]);
        await expect(transport.request({ method: 'GET', path: '/x' })).rejects.toBeInstanceOf(PcoServerError);
        expect(calls).toHaveLength(4);
    });

    it('retries network errors for GET and wraps them in PcoNetworkError', async () => {
        const cause = new TypeError('fetch failed');
        const { transport, calls } = setup(() => { throw cause; }, { retry: { maxRetries: 2 } });
        const err: any = await transport.request({ method: 'GET', path: '/x' }).catch((e: any) => e);
        expect(err).toBeInstanceOf(PcoNetworkError);
        expect(err.cause).toBe(cause);
        expect(calls).toHaveLength(3);
    });

    it('does not retry network errors for POST', async () => {
        const { transport, calls } = setup(() => { throw new TypeError('fetch failed'); });
        await expect(transport.request({ method: 'POST', path: '/x', body: {} })).rejects.toBeInstanceOf(PcoNetworkError);
        expect(calls).toHaveLength(1);
    });

    it('recovers after a network error', async () => {
        const { transport } = setup((_call, i) => {
            if (i === 0) throw new TypeError('reset');
            return ok();
        });
        await expect(transport.request({ method: 'GET', path: '/x' })).resolves.toEqual({ data: [] });
    });
});

describe('timeouts and cancellation', () => {
    const hang = (call: { signal?: AbortSignal | null }) => new Promise<Response>((_resolve, reject) => {
        call.signal?.addEventListener('abort', () => reject(call.signal!.reason));
    });

    it('throws PcoTimeoutError when an attempt takes too long', async () => {
        const { transport } = setup(hang, { timeoutMs: 20, retry: { maxRetries: 0 } });
        await expect(transport.request({ method: 'GET', path: '/x' })).rejects.toBeInstanceOf(PcoTimeoutError);
    });

    it('retries timeouts for GET', async () => {
        const { transport, calls } = setup((call, i) => (i === 0 ? hang(call) : ok()), { timeoutMs: 20 });
        await expect(transport.request({ method: 'GET', path: '/x' })).resolves.toEqual({ data: [] });
        expect(calls).toHaveLength(2);
    });

    it('rethrows the abort reason without retrying when the caller aborts', async () => {
        const controller = new AbortController();
        const reason = new Error('user cancelled');
        const { transport, calls } = setup((call) => {
            setTimeout(() => controller.abort(reason), 5);
            return hang(call);
        });
        const err: any = await transport.request({ method: 'GET', path: '/x', signal: controller.signal }).catch((e: any) => e);
        expect(err).toBe(reason);
        expect(calls).toHaveLength(1);
    });

    it('does not send when the signal is already aborted', async () => {
        const controller = new AbortController();
        controller.abort(new Error('early'));
        const { transport, calls } = setup([ok()]);
        await expect(transport.request({ method: 'GET', path: '/x', signal: controller.signal })).rejects.toThrow('early');
        expect(calls).toHaveLength(0);
    });

    it('stops waiting for a retry when aborted during backoff', async () => {
        const controller = new AbortController();
        const reason = new Error('stop');
        const mock = mockFetch(() => json({}, { status: 500 }));
        const transport = createTransport(
            { auth: PAT, fetch: mock.fetch },
            {
                sleep: (_ms, signal) => {
                    controller.abort(reason);
                    return Promise.reject(signal?.reason);
                },
            },
        );
        await expect(transport.request({ method: 'GET', path: '/x', signal: controller.signal })).rejects.toBe(reason);
        expect(mock.calls).toHaveLength(1);
    });
});

describe('hooks', () => {
    it('reports requests and responses without credentials', async () => {
        const events: unknown[] = [];
        const { transport } = setup([ok()], {
            hooks: {
                onRequest: (info) => events.push(['req', info]),
                onResponse: (info) => events.push(['res', info]),
            },
        });
        await transport.request({ method: 'GET', path: '/x' });
        expect(events).toEqual([
            ['req', { method: 'GET', url: 'https://api.planningcenteronline.com/x', attempt: 0 }],
            ['res', expect.objectContaining({ method: 'GET', status: 200, attempt: 0, durationMs: 0 })],
        ]);
        expect(JSON.stringify(events)).not.toContain('Basic');
    });

    it('ignores errors thrown by hooks', async () => {
        const { transport } = setup([ok()], { hooks: { onRequest: () => { throw new Error('hook'); } } });
        await expect(transport.request({ method: 'GET', path: '/x' })).resolves.toEqual({ data: [] });
    });
});

describe('concurrency', () => {
    it('honors maxConcurrency', async () => {
        let active = 0;
        let peak = 0;
        const { transport, calls } = setup(async () => {
            active++;
            peak = Math.max(peak, active);
            await new Promise((r) => setTimeout(r, 5));
            active--;
            return ok();
        }, { maxConcurrency: 2 });
        await Promise.all(Array.from({ length: 7 }, () => transport.request({ method: 'GET', path: '/x' })));
        expect(calls).toHaveLength(7);
        expect(peak).toBe(2);
    });

    it('rejects an invalid maxConcurrency', () => {
        expect(() => createTransport({ auth: PAT, maxConcurrency: 0 })).toThrow(PcoError);
    });
});

describe('upload', () => {
    const uploaded = () => json({
        data: [{
            type: 'File',
            id: 'us1-abc',
            attributes: { name: 'photo.png', content_type: 'image/png', file_size: 3, md5: 'x', expires_at: '2026-01-01T00:00:00Z' },
        }],
    });

    it('posts multipart form data to the upload URL', async () => {
        const { transport, calls } = setup([uploaded()]);
        const result = await transport.upload(new Uint8Array([1, 2, 3]), { filename: 'photo.png', contentType: 'image/png' });
        expect(result).toEqual({
            id: 'us1-abc', name: 'photo.png', content_type: 'image/png', file_size: 3, md5: 'x', expires_at: '2026-01-01T00:00:00Z',
        });
        const call = calls[0]!;
        expect(call.url).toBe('https://upload.planningcenteronline.com/v2/files');
        expect(call.method).toBe('POST');
        expect(call.headers.get('content-type')).toBeNull();
        expect(call.headers.get('authorization')).toBe(`Basic ${btoa('app:shh')}`);
        const form = call.body as FormData;
        const file = form.get('file') as File;
        expect(file.name).toBe('photo.png');
        expect(file.type).toBe('image/png');
        expect(new Uint8Array(await file.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    });

    it('uses the File name, or "upload"', async () => {
        const { transport, calls } = setup([uploaded(), uploaded()]);
        await transport.upload(new File(['hi'], 'notes.txt', { type: 'text/plain' }));
        await transport.upload(new ArrayBuffer(2));
        expect(((calls[0]!.body as FormData).get('file') as File).name).toBe('notes.txt');
        const second = (calls[1]!.body as FormData).get('file') as File;
        expect(second.name).toBe('upload');
        expect(second.type).toBe('application/octet-stream');
    });

    it('retries uploads on 429', async () => {
        const { transport, calls } = setup([json({}, { status: 429, headers: { 'Retry-After': '1' } }), uploaded()]);
        await expect(transport.upload(new Blob(['x']))).resolves.toMatchObject({ id: 'us1-abc' });
        expect(calls).toHaveLength(2);
    });

    it('honors a custom uploadUrl and maps errors', async () => {
        const { transport, calls } = setup([json({ errors: [{ title: 'Unauthorized' }] }, { status: 401 })], {
            uploadUrl: 'https://upload.example.test/v2/files',
        });
        await expect(transport.upload(new Blob(['x']))).rejects.toBeInstanceOf(PcoAuthenticationError);
        expect(calls[0]!.url).toBe('https://upload.example.test/v2/files');
    });
});

describe('fetch lookup', () => {
    it('uses the global fetch at call time when none is given', async () => {
        const mock = mockFetch([ok()]);
        const transport = createTransport({ auth: PAT }, fakeClock());
        vi.stubGlobal('fetch', mock.fetch);
        try {
            await transport.request({ method: 'GET', path: '/x' });
        } finally {
            vi.unstubAllGlobals();
        }
        expect(mock.calls).toHaveLength(1);
    });

    it('honors a custom baseUrl', async () => {
        const { transport, calls } = setup([ok(), ok()], { baseUrl: 'http://localhost:3000/' });
        await transport.request({ method: 'GET', path: '/people/v2/me' });
        await transport.request({ method: 'GET', path: 'http://localhost:3000/people/v2/me?offset=1' });
        expect(calls.map((c) => c.url)).toEqual([
            'http://localhost:3000/people/v2/me',
            'http://localhost:3000/people/v2/me?offset=1',
        ]);
    });
});
