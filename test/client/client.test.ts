import { describe, expect, it } from 'vitest';
import { PlanningCenter, PcoNotFoundError, People, Services } from '../../src/index.js';
const peopleGraph = People.peopleGraph;
const servicesGraph = Services.servicesGraph;
import { createPeopleClient } from '../../src/entries/people.js';
import type { PcoTransport } from '../../src/index.js';

interface Call {
    url: URL;
    init: RequestInit;
}

function mockFetch(respond: (call: Call) => Response = () => Response.json({ data: [], meta: {} })) {
    const calls: Call[] = [];
    const fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
        const call = { url: new URL(String(input)), init };
        calls.push(call);
        return respond(call);
    }) as typeof globalThis.fetch;
    return { fetch, calls };
}

const auth = { applicationId: 'app', secret: 'secret' };

describe('PlanningCenter', () => {
    it('sends typed collection queries with auth and the pinned product version', async () => {
        const { fetch, calls } = mockFetch();
        const pco = new PlanningCenter({ auth, fetch });
        await pco.people.people.where('first_name', 'Ada').include('emails').perPage(5).list();

        const [call] = calls;
        expect(call!.url.pathname).toBe('/people/v2/people');
        expect(call!.url.searchParams.get('where[first_name]')).toBe('Ada');
        expect(call!.url.searchParams.get('include')).toBe('emails');
        expect(call!.url.searchParams.get('per_page')).toBe('5');
        const headers = new Headers(call!.init.headers);
        expect(headers.get('authorization')).toBe(`Basic ${btoa('app:secret')}`);
        expect(headers.get('x-pco-api-version')).toBe(peopleGraph.version);
    });

    it('pins each product to its own generated version and honors overrides', async () => {
        const { fetch, calls } = mockFetch();
        const pco = new PlanningCenter({ auth, fetch, versions: { people: '2020-01-01' } });
        await pco.people.people.list();
        await pco.services.service_types.list();
        expect(new Headers(calls[0]!.init.headers).get('x-pco-api-version')).toBe('2020-01-01');
        expect(new Headers(calls[1]!.init.headers).get('x-pco-api-version')).toBe(servicesGraph.version);
        expect(calls[1]!.url.pathname).toBe('/services/v2/service_types');
    });

    it('creates each product client once', () => {
        const pco = new PlanningCenter({ auth, fetch: mockFetch().fetch });
        expect(pco.people).toBe(pco.people);
        expect(pco.checkIns).not.toBe(pco.people);
    });

    it('navigates nested edges across products', async () => {
        const { fetch, calls } = mockFetch(() => Response.json({ data: { type: 'Plan', id: '2', attributes: {} } }));
        const pco = new PlanningCenter({ auth, fetch });
        await pco.services.service_types.id('1').plans.id('2').get();
        expect(calls[0]!.url.pathname).toBe('/services/v2/service_types/1/plans/2');
    });

    it('maps API errors to typed errors', async () => {
        const { fetch } = mockFetch(() => Response.json({ errors: [{ title: 'Not Found' }] }, { status: 404 }));
        const pco = new PlanningCenter({ auth, fetch, retry: { maxRetries: 0 } });
        await expect(pco.people.people.id('nope').get()).rejects.toBeInstanceOf(PcoNotFoundError);
    });

    it('exposes raw request() through the shared transport', async () => {
        const { fetch, calls } = mockFetch(() => Response.json({ data: { type: 'Person', id: '1' } }));
        const pco = new PlanningCenter({ auth, fetch });
        const doc = await pco.request<{ data: { id: string } }>({ method: 'GET', path: '/people/v2/me' });
        expect(doc.data.id).toBe('1');
        expect(calls[0]!.url.pathname).toBe('/people/v2/me');
    });

    it('accepts an existing transport', async () => {
        const requests: unknown[] = [];
        const transport: PcoTransport = {
            request: async <T,>(req: unknown) => {
                requests.push(req);
                return { data: [] } as T;
            },
            upload: async () => ({ id: 'f', name: 'f', content_type: 'x', file_size: 1, md5: '', expires_at: '' }),
        };
        const pco = new PlanningCenter({ transport });
        await pco.groups.groups.list();
        expect(requests).toHaveLength(1);
        await expect(pco.uploadFile(new Uint8Array([1]))).resolves.toMatchObject({ id: 'f' });
    });
});

describe('product subpath entries', () => {
    it('creates a standalone product client', async () => {
        const { fetch, calls } = mockFetch();
        const people = createPeopleClient({ auth, fetch, version: '2024-01-01' });
        await people.people.list();
        expect(calls[0]!.url.pathname).toBe('/people/v2/people');
        expect(new Headers(calls[0]!.init.headers).get('x-pco-api-version')).toBe('2024-01-01');
    });
});
