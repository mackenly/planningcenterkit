import { describe, expect, it } from 'vitest';
import { PcoError } from '../../src/core/errors.js';
import { createProductClient } from '../../src/core/product.js';
import { fixtureGraph, mockTransport, type FixtureRoot, type FixtureSchema } from './fixture.js';

function setup(version?: string) {
    const mock = mockTransport();
    const pco = createProductClient<FixtureSchema, FixtureRoot>(fixtureGraph, mock.transport, version ? { version } : undefined);
    return { pco, ...mock };
}

const person = (id: string, rels?: object) => ({
    type: 'Person',
    id,
    attributes: { first_name: `P${id}` },
    ...(rels ? { relationships: rels } : {}),
});

describe('query construction', () => {
    it('builds where, filter, include, order, per_page, offset, and raw params', async () => {
        const { pco, last } = setup();
        await pco.people
            .where('created_at', 'gte', '2026-01-01')
            .where('created_at', 'lte', '2026-02-01')
            .where('first_name', 'Tim%')
            .filter('admins')
            .filter('organization_admins', 'admins')
            .include('emails', 'households')
            .include('emails')
            .order('-created_at', 'last_name')
            .perPage(50)
            .offset(25)
            .param('custom', 'x')
            .list();
        expect(last()).toMatchObject({ method: 'GET', path: '/people/v2/people', version: '2025-11-10' });
        expect(last().query).toEqual({
            'where[created_at][gte]': '2026-01-01',
            'where[created_at][lte]': '2026-02-01',
            'where[first_name]': 'Tim%',
            filter: ['admins', 'organization_admins'],
            include: ['emails', 'households'],
            order: ['-created_at', 'last_name'],
            per_page: 50,
            offset: 25,
            custom: 'x',
        });
    });

    it('order() replaces the previous order; repeated where on the same key overrides', async () => {
        const { pco, last } = setup();
        await pco.people.order('first_name').order('-created_at').where('status', 'active').where('status', 'inactive').list();
        expect(last().query).toEqual({ order: ['-created_at'], 'where[status]': 'inactive' });
    });

    it('sends no query params for a bare list', async () => {
        const { pco, last } = setup();
        await pco.people.list();
        expect(last().query).toEqual({});
    });

    it('is immutable: branches do not affect each other', async () => {
        const { pco, requests } = setup();
        const base = pco.people.where('status', 'active');
        const a = base.include('emails');
        const b = base.order('first_name').perPage(10);
        await base.list();
        await a.list();
        await b.list();
        expect(requests.map((r) => r.query)).toEqual([
            { 'where[status]': 'active' },
            { 'where[status]': 'active', include: ['emails'] },
            { 'where[status]': 'active', order: ['first_name'], per_page: 10 },
        ]);
        expect(a).not.toBe(base);
    });

    it('validates perPage, offset, ids, and where operators', () => {
        const { pco } = setup();
        expect(() => pco.people.perPage(0)).toThrow(PcoError);
        expect(() => pco.people.perPage(101)).toThrow(PcoError);
        expect(() => pco.people.perPage(1.5)).toThrow(/1 to 100/);
        expect(() => pco.people.offset(-1)).toThrow(PcoError);
        expect(() => pco.people.id('')).toThrow(PcoError);
        expect(() => pco.people.id('  ')).toThrow(PcoError);
        expect(() => pco.people.id(Number.NaN)).toThrow(PcoError);
        expect(() => pco.people.id(undefined as unknown as string)).toThrow(PcoError);
        expect(() => (pco.people.where as (...a: unknown[]) => unknown)('created_at', 'eq', 'x')).toThrow(/operator/);
    });

    it('exposes path for debugging and encodes ids', () => {
        const { pco } = setup();
        expect(pco.people.path).toBe('/people/v2/people');
        expect(pco.people.id(12).path).toBe('/people/v2/people/12');
        expect(pco.people.id('a/b').emails.path).toBe('/people/v2/people/a%2Fb/emails');
    });
});

describe('versioning', () => {
    it('uses graph.version by default and options.version when given', async () => {
        const a = setup();
        await a.pco.people.id('1').get();
        expect(a.last().version).toBe('2025-11-10');
        const b = setup('2018-08-01');
        await b.pco.people.list();
        await b.pco.people.id('1').emails.create({ address: 'a@b.c' });
        await b.pco.get();
        expect(b.requests.map((r) => r.version)).toEqual(['2018-08-01', '2018-08-01', '2018-08-01']);
    });
});

describe('results', () => {
    it('list() shapes data, included, meta, links, totalCount, nextOffset', async () => {
        const { pco, respond } = setup();
        respond({
            data: [person('1')],
            included: [],
            meta: { total_count: 3, count: 1, next: { offset: 1 } },
            links: { self: 'x', next: 'y' },
        });
        const page = await pco.people.list();
        expect(page.data).toHaveLength(1);
        expect(page.included).toEqual([]);
        expect(page.totalCount).toBe(3);
        expect(page.nextOffset).toBe(1);
        expect(page.links).toEqual({ self: 'x', next: 'y' });
    });

    it('defaults missing included/meta/links', async () => {
        const { pco, respond } = setup();
        respond({ data: [] });
        const page = await pco.people.list();
        expect(page).toMatchObject({ data: [], included: [], meta: {}, links: {}, totalCount: undefined, nextOffset: undefined });
    });

    it('related() resolves to-many, to-one, missing, and not-included relationships', async () => {
        const { pco, respond } = setup();
        respond({
            data: [
                person('1', {
                    emails: { data: [{ type: 'Email', id: '10' }, { type: 'Email', id: '11' }] },
                    primary_campus: { data: { type: 'Campus', id: '5' } },
                    households: { data: [] },
                }),
                person('2', { primary_campus: { data: null }, emails: { data: [{ type: 'Email', id: '99' }] } }),
                person('3'),
            ],
            included: [
                { type: 'Email', id: '10', attributes: { address: 'a@x' } },
                { type: 'Email', id: '11', attributes: { address: 'b@x' } },
                { type: 'Campus', id: '5', attributes: { name: 'Main' } },
            ],
            meta: {},
        });
        const { data, related } = await pco.people.include('emails', 'primary_campus').list();
        const [p1, p2, p3] = data;
        expect(related(p1!, 'emails').map((e) => e.attributes.address)).toEqual(['a@x', 'b@x']);
        expect(related(p1!, 'primary_campus').map((c) => c.id)).toEqual(['5']);
        expect(related(p1!, 'households')).toEqual([]);
        expect(related(p2!, 'primary_campus')).toEqual([]);
        expect(related(p2!, 'emails')).toEqual([]); // id 99 not in included
        expect(related(p3!, 'emails')).toEqual([]);
        expect(related(p1!, 'nope')).toEqual([]);
    });

    it('get() returns an ItemResult with related()', async () => {
        const { pco, respond, last } = setup();
        respond({
            data: person('1', { emails: { data: [{ type: 'Email', id: '10' }] } }),
            included: [{ type: 'Email', id: '10', attributes: { address: 'a@x' } }],
        });
        const result = await pco.people.get('1', { include: ['emails'] });
        expect(last()).toMatchObject({ method: 'GET', path: '/people/v2/people/1', query: { include: ['emails'] } });
        expect(result.data.id).toBe('1');
        expect(result.related(result.data, 'emails')).toHaveLength(1);
        expect(result.meta).toEqual({});
    });

    it('Collection.get() uses the builder include unless overridden', async () => {
        const { pco, requests } = setup();
        await pco.people.include('households').get('1');
        await pco.people.include('households').get('1', { include: ['emails'] });
        expect(requests.map((r) => r.query)).toEqual([{ include: ['households'] }, { include: ['emails'] }]);
    });

    it('single-ref get() returns null data for an empty to-one', async () => {
        const { pco, respond, last } = setup();
        respond({ data: null });
        const result = await pco.people.id('1').primary_campus.get();
        expect(last().path).toBe('/people/v2/people/1/primary_campus');
        expect(result.data).toBeNull();
    });

    it('product get() fetches the root', async () => {
        const { pco, respond, last } = setup();
        respond({ data: { type: 'Organization', id: '1', attributes: { name: 'Church' } } });
        const { data } = await pco.get();
        expect(last()).toMatchObject({ method: 'GET', path: '/people/v2', query: {} });
        expect(data.attributes.name).toBe('Church');
    });

    it('passes signals through', async () => {
        const { pco, last } = setup();
        const signal = new AbortController().signal;
        await pco.people.list({ signal });
        expect(last().signal).toBe(signal);
    });
});

describe('pagination', () => {
    const pages = [
        { data: [person('1'), person('2')], meta: { total_count: 5, next: { offset: 2 } } },
        { data: [person('3'), person('4')], meta: { total_count: 5, next: { offset: 4 } } },
        { data: [person('5')], meta: { total_count: 5 } },
    ];

    it('all() follows meta.next.offset across 3 pages, defaulting per_page to 100', async () => {
        const { pco, respond, requests } = setup();
        respond(...pages);
        const ids: string[] = [];
        for await (const p of pco.people.where('status', 'active').all()) ids.push(p.id);
        expect(ids).toEqual(['1', '2', '3', '4', '5']);
        expect(requests.map((r) => r.query)).toEqual([
            { 'where[status]': 'active', per_page: 100 },
            { 'where[status]': 'active', per_page: 100, offset: 2 },
            { 'where[status]': 'active', per_page: 100, offset: 4 },
        ]);
    });

    it('keeps an explicit perPage', async () => {
        const { pco, respond, requests } = setup();
        respond(...pages);
        await pco.people.perPage(2).toArray();
        expect(requests.map((r) => r.query?.per_page)).toEqual([2, 2, 2]);
    });

    it('pages() yields each page and honors maxPages', async () => {
        const a = setup();
        a.respond(...pages);
        const sizes: number[] = [];
        for await (const page of a.pco.people.pages()) sizes.push(page.data.length);
        expect(sizes).toEqual([2, 2, 1]);

        const b = setup();
        b.respond(...pages);
        const limited: number[] = [];
        for await (const page of b.pco.people.pages({ maxPages: 2 })) limited.push(page.data.length);
        expect(limited).toEqual([2, 2]);
        expect(b.requests).toHaveLength(2);
    });

    it('toArray({ max }) stops early without fetching extra pages', async () => {
        const { pco, respond, requests } = setup();
        respond(...pages);
        const people = await pco.people.toArray({ max: 3 });
        expect(people.map((p) => p.id)).toEqual(['1', '2', '3']);
        expect(requests).toHaveLength(2);
    });

    it('follows links.next when meta.next is absent', async () => {
        const { pco, respond, requests } = setup();
        respond(
            { data: [person('1')], meta: {}, links: { next: 'https://api.planningcenteronline.com/people/v2/people?offset=1' } },
            { data: [person('2')], meta: {}, links: {} },
        );
        const people = await pco.people.toArray();
        expect(people.map((p) => p.id)).toEqual(['1', '2']);
        expect(requests[1]).toMatchObject({ path: 'https://api.planningcenteronline.com/people/v2/people?offset=1', query: undefined });
    });

    it('stops when the next offset repeats or a page is empty', async () => {
        const { pco, respond, requests } = setup();
        respond(
            { data: [person('1')], meta: { next: { offset: 1 } } },
            { data: [person('2')], meta: { next: { offset: 1 } } },
        );
        expect(await pco.people.toArray()).toHaveLength(2);
        expect(requests).toHaveLength(2);
    });

    it('first() and count() use per_page=1', async () => {
        const { pco, respond, requests } = setup();
        respond({ data: [person('9')], meta: { total_count: 42 } }, { data: [person('9')], meta: { total_count: 42 } }, { data: [] });
        expect((await pco.people.order('-created_at').first())?.id).toBe('9');
        expect(await pco.people.where('status', 'active').count()).toBe(42);
        expect(await pco.people.first()).toBeUndefined();
        expect(requests.map((r) => r.query)).toEqual([
            { order: ['-created_at'], per_page: 1 },
            { 'where[status]': 'active', per_page: 1 },
            { per_page: 1 },
        ]);
    });
});

describe('writes', () => {
    it('create() posts type + attributes (+ relationships) to the collection', async () => {
        const { pco, last, respond } = setup();
        respond({ data: person('7') });
        const result = await pco.people.create(
            { first_name: 'Ada', last_name: 'Lovelace' },
            { relationships: { primary_campus: { data: { type: 'Campus', id: '5' } } }, include: ['emails'] },
        );
        expect(result.data.id).toBe('7');
        expect(last()).toMatchObject({
            method: 'POST',
            path: '/people/v2/people',
            query: { include: ['emails'] },
            body: {
                data: {
                    type: 'Person',
                    attributes: { first_name: 'Ada', last_name: 'Lovelace' },
                    relationships: { primary_campus: { data: { type: 'Campus', id: '5' } } },
                },
            },
        });
    });

    it('create() on a nested edge uses the target vertex type', async () => {
        const { pco, last } = setup();
        await pco.people.id('1').emails.create({ address: 'ada@example.com' });
        expect(last()).toMatchObject({
            method: 'POST',
            path: '/people/v2/people/1/emails',
            body: { data: { type: 'Email', attributes: { address: 'ada@example.com' } } },
        });
        expect(Object.keys((last().body as { data: object }).data)).toEqual(['type', 'attributes']);
    });

    it('refuses create on a non-creatable edge without sending a request', async () => {
        const { pco, requests } = setup();
        const emails = pco.emails as unknown as { create(a: object): Promise<unknown> };
        await expect(emails.create({ address: 'x' })).rejects.toThrow(PcoError);
        await expect(emails.create({ address: 'x' })).rejects.toThrow(/does not support creating/);
        expect(requests).toHaveLength(0);
    });

    it('update() patches with id and type', async () => {
        const { pco, last } = setup();
        await pco.people.id(123).update({ nickname: 'Ada' });
        expect(last()).toMatchObject({
            method: 'PATCH',
            path: '/people/v2/people/123',
            body: { data: { type: 'Person', id: '123', attributes: { nickname: 'Ada' } } },
        });
    });

    it('refuses update/delete when the vertex does not support it', async () => {
        const { pco, requests } = setup();
        const household = pco.people.id('1').households.id('2') as unknown as {
            update(a: object): Promise<unknown>;
            delete(): Promise<void>;
        };
        await expect(household.update({ name: 'x' })).rejects.toThrow(/does not support updating/);
        await expect(household.delete()).rejects.toThrow(/does not support deleting/);
        expect(requests).toHaveLength(0);
    });

    it('delete() sends DELETE', async () => {
        const { pco, last } = setup();
        await expect(pco.people.id('1').delete()).resolves.toBeUndefined();
        expect(last()).toMatchObject({ method: 'DELETE', path: '/people/v2/people/1', version: '2025-11-10' });
    });

    it('action() posts the body as-is to item/action and rejects unknown actions', async () => {
        const { pco, last, requests } = setup();
        const body = { data: { attributes: { person_to_keep_id: '1', person_to_remove_id: '2' } } };
        await pco.people.id('1').action('merge', body);
        expect(last()).toMatchObject({ method: 'POST', path: '/people/v2/people/1/merge', body });
        await expect(pco.people.id('1').action('explode' as 'merge')).rejects.toThrow(/Unknown action/);
        expect(requests).toHaveLength(1);
    });
});

describe('navigation', () => {
    it('follows edges 3 levels deep', async () => {
        const { pco, last } = setup();
        await pco.people.id('1').households.id('2').people.id('3').emails.where('primary', true).list();
        expect(last().path).toBe('/people/v2/people/1/households/2/people/3/emails');
        expect(last().query).toEqual({ 'where[primary]': true });
        await pco.people.id('1').households.filter('active', 'primary').list();
        expect(last().query).toEqual({ filter: ['active', 'primary'] });
        await pco.people.id('1').emails.id('10').person.get();
        expect(last().path).toBe('/people/v2/people/1/emails/10/person');
    });

    it('reserved-name edges are reachable via edge() only', async () => {
        const { pco, last } = setup();
        const ref = pco.people.id('1');
        expect(typeof ref.update).toBe('function');
        expect('then' in ref).toBe(false);
        await ref.edge('update').list();
        expect(last().path).toBe('/people/v2/people/1/update');
        await ref.edge('then').list();
        expect(last().path).toBe('/people/v2/people/1/then');
        // Not thenable: awaiting the ref yields the ref itself.
        expect(await ref).toBe(ref);
    });

    it('root reserved names and edge() work on the product client', async () => {
        const { pco, last } = setup();
        expect(typeof pco.get).toBe('function');
        await pco.edge('get').list();
        expect(last().path).toBe('/people/v2/get');
        await pco.edge('people').list();
        expect(last().path).toBe('/people/v2/people');
        expect(() => (pco.edge as (n: string) => unknown)('nope')).toThrow(PcoError);
        expect(() => (pco.people.id('1').edge as (n: string) => unknown)('nope')).toThrow(PcoError);
    });

    it('edge getters are lazy and fresh', () => {
        const { pco } = setup();
        expect(pco.people).not.toBe(pco.people);
        expect(Object.keys(pco)).toEqual([]);
    });
});

describe('response shape tolerance', () => {
    it('wraps a single resource returned by a collection edge', async () => {
        const { pco, respond } = setup();
        respond({ data: { type: 'Email', id: '9', attributes: {} } });
        const { data } = await pco.people.id('1').emails.list();
        expect(data.map((r) => r.id)).toEqual(['9']);
    });
});
