import { describe, expect, it } from 'vitest';
import { PcoError } from '../../src/core/errors.js';
import type { ProductGraph } from '../../src/core/graph.js';
import { createProductClient } from '../../src/core/product.js';
import { PlanningCenter } from '../../src/client.js';
import { fixtureGraph, mockTransport, type FixtureRoot, type FixtureSchema } from './fixture.js';

function setup(graph: ProductGraph = fixtureGraph) {
    const mock = mockTransport();
    const pco = createProductClient<FixtureSchema, FixtureRoot>(graph, mock.transport);
    return { pco, ...mock };
}

describe('id validation', () => {
    it.each(['.', '..', '%2e', '%2E%2e', ' .. '])('rejects the dot segment %j before sending anything', async (id) => {
        const { pco, requests } = setup();
        expect(() => pco.people.id('1').emails.id(id)).toThrow(PcoError);
        await expect(pco.people.get(id)).rejects.toThrow(PcoError);
        expect(requests).toHaveLength(0);
    });

    it('still accepts ids that merely contain dots', () => {
        const { pco } = setup();
        expect(pco.people.id('a.b').path).toBe('/people/v2/people/a.b');
    });
});

describe('where()', () => {
    it.each([undefined, null])('throws instead of silently dropping a %s value', (value) => {
        const { pco } = setup();
        expect(() => pco.people.where('first_name', value as unknown as string)).toThrow(/where\("first_name"\)/);
        expect(() => pco.people.where('created_at', 'gte', value as unknown as string)).toThrow(PcoError);
    });
});

describe('canonical item URLs', () => {
    const graph = {
        ...fixtureGraph,
        vertices: { ...fixtureGraph.vertices, email: { ...fixtureGraph.vertices.email, canonicalPath: '/people/v2/emails' } },
    } as ProductGraph;

    it('addresses items by their canonical URL however they were reached', async () => {
        const { pco, last } = setup(graph);
        const email = pco.people.id('1').emails.id('5');
        expect(email.path).toBe('/people/v2/emails/5');
        await email.person.get();
        expect(last().path).toBe('/people/v2/emails/5/person');
        await pco.people.id('1').emails.get('6');
        expect(last().path).toBe('/people/v2/emails/6');
    });

    it('keeps nested collection URLs, which carry the scope', async () => {
        const { pco, last } = setup(graph);
        await pco.people.id('1').emails.list();
        expect(last().path).toBe('/people/v2/people/1/emails');
    });
});

describe('count()', () => {
    it('pages through when the API gives no total_count', async () => {
        const { pco, respond } = setup();
        const person = (id: string) => ({ type: 'Person', id, attributes: {} });
        respond(
            { data: [person('1')], meta: { count: 1, next: { offset: 1 } } },
            { data: [person('1'), person('2')], meta: { count: 2, next: { offset: 2 } } },
            { data: [person('3')], meta: { count: 1 } },
        );
        await expect(pco.people.count()).resolves.toBe(3);
    });
});

describe('single-resource edges', () => {
    const graph = {
        ...fixtureGraph,
        vertices: {
            ...fixtureGraph.vertices,
            person: {
                ...fixtureGraph.vertices.person,
                edges: { ...fixtureGraph.vertices.person.edges, primary_campus: { vertex: 'campus', many: false, canCreate: true } },
            },
        },
    } as ProductGraph;

    it('creates through a creatable single edge', async () => {
        const { pco, last } = setup(graph);
        const ref = pco.people.id('1').primary_campus as unknown as { create(a: object): Promise<unknown> };
        await ref.create({ name: 'Main' });
        expect(last()).toMatchObject({
            method: 'POST',
            path: '/people/v2/people/1/primary_campus',
            body: { data: { type: 'Campus', attributes: { name: 'Main' } } },
        });
    });

    it('refuses to create through a non-creatable single edge', async () => {
        const { pco, requests } = setup();
        const ref = pco.people.id('1').primary_campus as unknown as { create(a: object): Promise<unknown> };
        await expect(ref.create({})).rejects.toThrow(/does not support creating/);
        expect(requests).toHaveLength(0);
    });
});

describe('pco.people.me', () => {
    it('fetches the authenticated person', async () => {
        const { transport, last, respond } = mockTransport();
        respond({ data: { type: 'Person', id: '42', attributes: { first_name: 'Ada' } } });
        const pco = new PlanningCenter({ transport });
        const { data } = await pco.people.me.get();
        expect(last().path).toBe('/people/v2/me');
        expect(data?.attributes.first_name).toBe('Ada');
    });
});
