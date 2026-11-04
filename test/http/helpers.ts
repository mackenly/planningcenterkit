import { vi } from 'vitest';
import { createTransport } from '../../src/core/http.js';
import type { TransportOptions } from '../../src/core/http.js';

export interface Call {
    url: string;
    method: string;
    headers: Headers;
    body: unknown;
    signal?: AbortSignal | null;
}

export function json(body: unknown, init: { status?: number; headers?: Record<string, string> } = {}): Response {
    return new Response(body === undefined ? null : JSON.stringify(body), {
        status: init.status ?? 200,
        headers: { 'Content-Type': 'application/json', ...init.headers },
    });
}

/** A fetch mock that records calls and answers from `handler` (or a queue of responses). */
export function mockFetch(handler: ((call: Call, index: number) => Response | Promise<Response>) | Response[]) {
    const calls: Call[] = [];
    const fn = vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
        const call: Call = {
            url: String(input),
            method: init.method ?? 'GET',
            headers: new Headers(init.headers),
            body: init.body,
            signal: init.signal,
        };
        calls.push(call);
        if (Array.isArray(handler)) {
            const next = handler.shift();
            if (!next) throw new Error('mockFetch: no more responses');
            return next;
        }
        return handler(call, calls.length - 1);
    });
    return { fetch: fn as unknown as typeof fetch, calls };
}

/** A virtual clock: sleeps advance time instantly and are recorded. */
export function fakeClock(start = 1_700_000_000_000) {
    let time = start;
    const sleeps: number[] = [];
    return {
        sleeps,
        now: () => time,
        advance: (ms: number) => {
            time += ms;
        },
        sleep: async (ms: number, signal?: AbortSignal) => {
            signal?.throwIfAborted();
            sleeps.push(ms);
            time += ms;
            await Promise.resolve();
        },
        random: () => 0.5,
    };
}

export const PAT = { applicationId: 'app', secret: 'shh' };

export function setup(
    handler: Parameters<typeof mockFetch>[0],
    options: Partial<TransportOptions> = {},
    clock = fakeClock(),
) {
    const mock = mockFetch(handler);
    const transport = createTransport(
        { auth: PAT, fetch: mock.fetch, ...options },
        { now: clock.now, sleep: clock.sleep, random: clock.random },
    );
    return { transport, calls: mock.calls, fetch: mock.fetch, clock };
}
