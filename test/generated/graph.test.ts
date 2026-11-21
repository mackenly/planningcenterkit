import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { ProductGraph, ProductName } from '../../src/core/graph.js';
import { productGraphs } from '../../src/generated/index.js';

const slugs: Record<ProductName, string> = {
    api: 'api',
    calendar: 'calendar',
    checkIns: 'check-ins',
    current: 'current',
    giving: 'giving',
    groups: 'groups',
    people: 'people',
    publishing: 'publishing',
    registrations: 'registrations',
    services: 'services',
    webhooks: 'webhooks',
};

const graphs = Object.entries(productGraphs) as Array<[ProductName, ProductGraph]>;

describe('generated product graphs', () => {
    it('covers every product', () => {
        expect(Object.keys(productGraphs).sort()).toEqual(Object.keys(slugs).sort());
    });

    describe.each(graphs)('%s', (name, graph) => {
        const spec = JSON.parse(readFileSync(new URL(`../../spec/${slugs[name]}.json`, import.meta.url), 'utf8'));

        it('has consistent product metadata', () => {
            expect(graph.product).toBe(name);
            expect(graph.slug).toBe(slugs[name]);
            expect(graph.basePath).toBe(`/${graph.slug}/v2`);
            expect(graph.version).toBe(spec.version);
            expect(graph.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(graph.vertices[graph.rootVertex]).toBeDefined();
        });

        it('only points edges at known vertices', () => {
            for (const [edge, meta] of Object.entries(graph.root)) {
                expect(graph.vertices[meta.vertex], `root.${edge}`).toBeDefined();
            }
            for (const [id, vertex] of Object.entries(graph.vertices)) {
                expect(typeof vertex.type).toBe('string');
                for (const [edge, meta] of Object.entries(vertex.edges)) {
                    expect(graph.vertices[meta.vertex], `${id}.${edge}`).toBeDefined();
                    expect(typeof meta.many).toBe('boolean');
                    expect(typeof meta.canCreate).toBe('boolean');
                }
            }
        });

        it('includes every vertex from the spec', () => {
            expect(Object.keys(graph.vertices).sort()).toEqual(Object.keys(spec.vertices).sort());
        });
    });
});

describe('spot checks', () => {
    it('people', () => {
        const people = productGraphs.people;
        expect(people.root.people).toEqual({ vertex: 'person', many: true, canCreate: true });
        expect(people.vertices.person.type).toBe('Person');
        expect(people.vertices.person.edges.emails).toMatchObject({ vertex: 'email', many: true, canCreate: true });
        expect(people.vertices.person.canUpdate).toBe(true);
        expect(people.vertices.person.canDelete).toBe(true);
        expect(people.vertices.list.actions).toContain('run');
    });

    it('services', () => {
        const services = productGraphs.services;
        expect(services.root.service_types).toMatchObject({ vertex: 'service_type', many: true });
        expect(services.vertices.service_type.edges.plans).toMatchObject({ vertex: 'plan', many: true });
    });

    it('check-ins', () => {
        expect(productGraphs.checkIns.product).toBe('checkIns');
        expect(productGraphs.checkIns.basePath).toBe('/check-ins/v2');
    });

    it('singular edges come from the OpenAPI response shape', () => {
        expect(productGraphs.people.vertices.list.edges.star.many).toBe(false);
    });
});
