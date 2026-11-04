import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { SpecAttribute, SpecEdge, SpecProduct, SpecVertex } from '../../scripts/codegen/spec-types.ts';
import {
    ATTRIBUTE_TYPES,
    WHERE_TYPES,
    diffSpecs,
    renderMarkdown,
    renderSummary,
    surface,
    type Change,
    type SpecSet,
} from '../../scripts/spec-diff.ts';
import type { ProductGraph } from '../../src/core/graph.js';
import { productGraphs } from '../../src/generated/index.js';

// ---------------------------------------------------------------------------
// Fixtures: a tiny People-like product
// ---------------------------------------------------------------------------

function attribute(name: string, type: string | null, extra: Partial<SpecAttribute> = {}): SpecAttribute {
    return { name, type, example: null, note: null, description: null, permissionLevel: 'public', ...extra };
}

function edge(id: string, name: string, path: string, head: string, extra: Partial<SpecEdge> = {}): SpecEdge {
    return { id, name, path, head, filters: [], deprecated: false, details: null, response: 'collection', post: false, ...extra };
}

function vertex(name: string, path: string | null, extra: Partial<SpecVertex> = {}): SpecVertex {
    return {
        name,
        description: null,
        deprecated: false,
        path,
        collectionOnly: false,
        resourceOnly: false,
        attributes: [attribute('id', 'primary_key')],
        relationships: [],
        permissions: { canCreate: false, canUpdate: false, canDestroy: false, edges: [], createAssignable: [], updateAssignable: [] },
        actions: [],
        edges: [],
        includes: [],
        queries: [],
        orders: [],
        ...extra,
    };
}

function product(): SpecProduct {
    return {
        slug: 'people',
        product: 'people',
        title: 'Planning Center People',
        version: '2025-01-01',
        basePath: '/people/v2',
        entry: 'organization',
        openApi: true,
        vertices: {
            organization: vertex('Organization', '/people/v2', {
                resourceOnly: true,
                attributes: [attribute('id', 'primary_key'), attribute('name', 'string')],
                edges: [
                    edge('organization-people', 'people', '/people/v2/people', 'person', { filters: ['admins', 'archived'] }),
                    edge('organization-lists', 'lists', '/people/v2/lists', 'list'),
                ],
            }),
            person: vertex('Person', '/people/v2/people', {
                description: 'A person.',
                attributes: [
                    attribute('id', 'primary_key'),
                    attribute('first_name', 'string', { description: 'Given name.', example: 'Ada' }),
                    attribute('birthdate', 'date'),
                    attribute('child', 'boolean'),
                ],
                relationships: [{ name: 'primary_campus', association: 'to_one', graphType: 'Campus', polymorphic: null, note: null }],
                permissions: {
                    canCreate: true,
                    canUpdate: true,
                    canDestroy: true,
                    edges: ['organization-people'],
                    createAssignable: ['first_name', 'birthdate', 'primary_campus_id'],
                    updateAssignable: ['first_name', 'child'],
                },
                actions: [{ name: 'merge', path: '/people/v2/people/{person_id}/merge', description: 'Merge.', deprecated: false }],
                edges: [
                    edge('person-emails', 'emails', '/people/v2/people/{person_id}/emails', 'email', { filters: ['primary'] }),
                    edge('person-primary_campus', 'primary_campus', '/people/v2/people/{person_id}/primary_campus', 'campus', { response: 'resource' }),
                ],
                includes: ['emails', 'primary_campus'],
                queries: [
                    { name: 'first_name', type: 'string', ops: [] },
                    { name: 'created_at', type: 'date_time', ops: ['gt', 'gte', 'lt', 'lte'] },
                ],
                orders: ['first_name', 'created_at'],
            }),
            email: vertex('Email', '/people/v2/emails', {
                attributes: [attribute('id', 'primary_key'), attribute('address', 'string')],
            }),
            campus: vertex('Campus', '/people/v2/campuses'),
            list: vertex('List', '/people/v2/lists'),
        },
    };
}

/** Base and a head modified by `mutate`, keyed by slug. */
function pair(mutate: (head: SpecProduct) => void): [SpecSet, SpecSet] {
    const head = product();
    mutate(head);
    return [{ people: product() }, { people: head }];
}

function diff(mutate: (head: SpecProduct) => void) {
    return diffSpecs(...pair(mutate));
}

const v = (p: SpecProduct, id: string) => p.vertices[id]!;
const pick = (changes: Change[]) => changes.map((c) => `${c.level} ${c.kind} ${c.path}: ${c.detail}`);

function expectChange(result: ReturnType<typeof diffSpecs>, level: Change['level'], kind: string, path: string, detail?: RegExp) {
    const found = result.changes.find((c) => c.level === level && c.kind === kind && c.path === path && (!detail || detail.test(c.detail)));
    expect(found, `expected ${level} ${kind} ${path} in\n${pick(result.changes).join('\n')}`).toBeDefined();
}

// ---------------------------------------------------------------------------

describe('spec-diff', () => {
    it('reports none for identical specs', () => {
        expect(diffSpecs({ people: product() }, { people: product() })).toEqual({ level: 'none', changes: [] });
    });

    it('ignores object key order', () => {
        const reverseKeys = (value: unknown): unknown => {
            if (Array.isArray(value)) return value.map(reverseKeys);
            if (value && typeof value === 'object') {
                return Object.fromEntries(Object.entries(value).reverse().map(([k, x]) => [k, reverseKeys(x)]));
            }
            return value;
        };
        const shuffled = reverseKeys(product()) as SpecProduct;
        expect(Object.keys(shuffled)[0]).not.toBe(Object.keys(product())[0]);
        expect(diffSpecs({ people: product() }, { people: shuffled }).level).toBe('none');
    });

    describe('major', () => {
        it('product removed', () => {
            const r = diffSpecs({ people: product(), other: { ...product(), slug: 'other' } }, { people: product() });
            expect(r.level).toBe('major');
            expectChange(r, 'major', 'product', '', /removed/);
        });

        it('pinned API version changed', () => {
            const r = diff((h) => (h.version = '2026-01-01'));
            expect(r.level).toBe('major');
            expectChange(r, 'major', 'version', '', /X-PCO-API-Version/);
        });

        it('base path, entry, or client property changed', () => {
            expect(diff((h) => (h.basePath = '/people/v3')).level).toBe('major');
            expect(diff((h) => (h.product = 'persons')).level).toBe('major');
        });

        it('resource (vertex) removed', () => {
            const r = diff((h) => {
                delete h.vertices.list;
            });
            expectChange(r, 'major', 'vertex', 'list', /removed/);
            // the root edge leading to it disappears too
            expectChange(r, 'major', 'root-edge', '(root).lists', /removed/);
        });

        it('root edge removed', () => {
            const r = diff((h) => (v(h, 'organization').edges = v(h, 'organization').edges.filter((e) => e.name !== 'lists')));
            expect(r.level).toBe('major');
            expectChange(r, 'major', 'root-edge', '(root).lists', /removed/);
            expect(r.changes.some((c) => c.kind === 'other')).toBe(false);
        });

        it('edge removed', () => {
            const r = diff((h) => (v(h, 'person').edges = v(h, 'person').edges.filter((e) => e.name !== 'emails')));
            expectChange(r, 'major', 'edge', 'person.edges.emails', /removed/);
        });

        it('edge no longer follows the generated path rule (dropped from the API)', () => {
            const r = diff((h) => (v(h, 'person').edges[0]!.path = '/people/v2/emails'));
            expectChange(r, 'major', 'edge', 'person.edges.emails', /removed/);
        });

        it("edge's many changed", () => {
            const r = diff((h) => (v(h, 'person').edges[1]!.response = 'collection'));
            expectChange(r, 'major', 'edge', 'person.edges.primary_campus', /many false -> true/);
        });

        it("edge's many changed via relationship association when OpenAPI is absent", () => {
            const [base, head] = pair((h) => {
                v(h, 'person').edges[1]!.response = null;
                v(h, 'person').relationships[0]!.association = 'to_many';
            });
            v(base.people!, 'person').edges[1]!.response = null;
            expectChange(diffSpecs(base, head), 'major', 'edge', 'person.edges.primary_campus', /many false -> true/);
        });

        it('edge target changed', () => {
            const r = diff((h) => (v(h, 'person').edges[0]!.head = 'list'));
            expectChange(r, 'major', 'edge', 'person.edges.emails', /target resource/);
        });

        it('attribute removed', () => {
            const r = diff((h) => (v(h, 'person').attributes = v(h, 'person').attributes.filter((a) => a.name !== 'child')));
            expectChange(r, 'major', 'attribute', 'person.attributes.child', /removed/);
            expectChange(r, 'major', 'update-attribute', 'person.update.child', /unknown/);
        });

        it('attribute type changed', () => {
            const r = diff((h) => (v(h, 'person').attributes[3]!.type = 'string'));
            expectChange(r, 'major', 'attribute', 'person.attributes.child', /boolean \| null.*string \| null/);
        });

        it('attribute type becomes unmapped (unknown)', () => {
            const r = diff((h) => (v(h, 'person').attributes[1]!.type = 'mystery'));
            expectChange(r, 'major', 'attribute', 'person.attributes.first_name', /unknown/);
        });

        it('include removed', () => {
            const r = diff((h) => (v(h, 'person').includes = ['primary_campus']));
            expectChange(r, 'major', 'include', 'person.includes.emails', /removed/);
        });

        it('include no longer resolves to a resource', () => {
            const r = diff((h) => {
                v(h, 'person').relationships = [];
                v(h, 'person').edges = v(h, 'person').edges.filter((e) => e.name !== 'primary_campus');
            });
            expectChange(r, 'major', 'related', 'person.related.primary_campus');
        });

        it('where field removed or its value type changed', () => {
            expectChange(diff((h) => v(h, 'person').queries.shift()), 'major', 'where', 'person.where.first_name', /removed/);
            expectChange(diff((h) => (v(h, 'person').queries[0]!.type = 'integer')), 'major', 'where', 'person.where.first_name', /value type/);
        });

        it('where operator removed', () => {
            const r = diff((h) => (v(h, 'person').queries[1]!.ops = ['gt', 'lt']));
            expectChange(r, 'major', 'where-operator', 'person.where.created_at.gte', /removed/);
            expectChange(r, 'major', 'where-operator', 'person.where.created_at.lte', /removed/);
        });

        it('order field removed', () => {
            expectChange(diff((h) => (v(h, 'person').orders = ['first_name'])), 'major', 'order', 'person.order.created_at', /removed/);
        });

        it('filter removed (root and nested edges)', () => {
            expectChange(diff((h) => (v(h, 'organization').edges[0]!.filters = ['admins'])), 'major', 'filter', '(root).people.filters.archived', /removed/);
            expectChange(diff((h) => (v(h, 'person').edges[0]!.filters = [])), 'major', 'filter', 'person.edges.emails.filters.primary', /removed/);
        });

        it('action removed', () => {
            expectChange(diff((h) => (v(h, 'person').actions = [])), 'major', 'action', 'person.actions.merge', /removed/);
        });

        it('create/update assignable attribute removed or retyped', () => {
            const p = (h: SpecProduct) => v(h, 'person').permissions;
            expectChange(diff((h) => (p(h).createAssignable = ['first_name', 'birthdate'])), 'major', 'create-attribute', 'person.create.primary_campus_id', /removed/);
            expectChange(diff((h) => (p(h).updateAssignable = ['first_name'])), 'major', 'update-attribute', 'person.update.child', /removed/);
            expectChange(diff((h) => (v(h, 'person').attributes[2]!.type = 'integer')), 'major', 'create-attribute', 'person.create.birthdate', /number \| null/);
        });

        it('canCreate/canUpdate/canDelete true -> false', () => {
            const p = (h: SpecProduct) => v(h, 'person').permissions;
            const create = diff((h) => (p(h).canCreate = false));
            expectChange(create, 'major', 'capability', 'person', /canCreate true -> false/);
            expectChange(create, 'major', 'root-edge', '(root).people', /canCreate true -> false/);
            expectChange(diff((h) => (p(h).canUpdate = false)), 'major', 'capability', 'person', /canUpdate true -> false/);
            expectChange(diff((h) => (p(h).canDestroy = false)), 'major', 'capability', 'person', /canDelete true -> false/);
        });

        it('edge stops accepting creates', () => {
            expectChange(diff((h) => (v(h, 'person').permissions.edges = ['somewhere-else'])), 'major', 'root-edge', '(root).people', /canCreate true -> false/);
        });

        it('resource type name changed', () => {
            const r = diff((h) => (v(h, 'email').name = 'EmailAddress'));
            expectChange(r, 'major', 'type-name', 'email', /resource type/);
            expectChange(r, 'major', 'type-name', 'email', /exported type `Email` renamed to `EmailAddress`/);
        });

        it('an added resource renames an existing exported type', () => {
            // `Site` is exported for vertex `campus_v2` until a second vertex named Site arrives;
            // then both fall back to names derived from their ids.
            const [base, head] = pair((h) => {
                h.vertices.campus_v2 = vertex('Site', '/people/v2/campus_v2s');
                h.vertices.site = vertex('Site', '/people/v2/sites');
            });
            base.people!.vertices.campus_v2 = vertex('Site', '/people/v2/campus_v2s');
            const r = diffSpecs(base, head);
            expect(r.level).toBe('major');
            expectChange(r, 'minor', 'vertex', 'site', /added/);
            expectChange(r, 'major', 'type-name', 'campus_v2', /`Site` renamed to `CampusV2`/);
        });

        it('canonical path changed', () => {
            expectChange(diff((h) => (v(h, 'email').path = '/people/v2/email_addresses')), 'major', 'canonical-path', 'email');
        });
    });

    describe('minor', () => {
        const minorOnly = (mutate: (h: SpecProduct) => void, kind: string, path: string) => {
            const r = diff(mutate);
            expect(r.level, pick(r.changes).join('\n')).toBe('minor');
            expectChange(r, 'minor', kind, path);
        };

        it('product added', () => {
            const r = diffSpecs({ people: product() }, { people: product(), other: { ...product(), slug: 'other' } });
            expect(r.level).toBe('minor');
            expectChange(r, 'minor', 'product', '', /added/);
        });
        it('resource added', () => minorOnly((h) => (h.vertices.note = vertex('Note', '/people/v2/notes')), 'vertex', 'note'));
        it('root edge added', () =>
            minorOnly((h) => v(h, 'organization').edges.push(edge('organization-emails', 'emails', '/people/v2/emails', 'email')), 'root-edge', '(root).emails'));
        it('edge added', () =>
            minorOnly((h) => v(h, 'email').edges.push(edge('email-person', 'person', '/people/v2/emails/{email_id}/person', 'person', { response: 'resource' })), 'edge', 'email.edges.person'));
        it('attribute added', () => minorOnly((h) => v(h, 'person').attributes.push(attribute('nickname', 'string')), 'attribute', 'person.attributes.nickname'));
        it('include added', () => minorOnly((h) => v(h, 'email').includes.push('person'), 'include', 'email.includes.person'));
        it('where field added', () => minorOnly((h) => v(h, 'person').queries.push({ name: 'child', type: 'boolean', ops: [] }), 'where', 'person.where.child'));
        it('where operator added', () => minorOnly((h) => (v(h, 'person').queries[0]!.ops = ['gt']), 'where-operator', 'person.where.first_name.gt'));
        it('order field added', () => minorOnly((h) => v(h, 'person').orders.push('birthdate'), 'order', 'person.order.birthdate'));
        it('filter added', () => minorOnly((h) => v(h, 'person').edges[0]!.filters.push('blocked'), 'filter', 'person.edges.emails.filters.blocked'));
        it('action added', () =>
            minorOnly((h) => v(h, 'person').actions.push({ name: 'archive', path: '/people/v2/people/{person_id}/archive', description: null, deprecated: false }), 'action', 'person.actions.archive'));
        it('assignable attribute added', () => {
            minorOnly((h) => v(h, 'person').permissions.createAssignable.push('child'), 'create-attribute', 'person.create.child');
            minorOnly((h) => v(h, 'person').permissions.updateAssignable.push('birthdate'), 'update-attribute', 'person.update.birthdate');
        });
        it('capabilities false -> true', () => {
            minorOnly((h) => (v(h, 'email').permissions.canUpdate = true), 'capability', 'email');
            minorOnly((h) => (v(h, 'email').permissions.canDestroy = true), 'capability', 'email');
            const r = diff((h) => {
                v(h, 'email').permissions.canCreate = true;
                v(h, 'email').permissions.edges = ['person-emails'];
            });
            expect(r.level).toBe('minor');
            expectChange(r, 'minor', 'capability', 'email', /canCreate false -> true/);
            expectChange(r, 'minor', 'edge', 'person.edges.emails', /canCreate false -> true/);
        });
    });

    describe('patch', () => {
        const patchOnly = (mutate: (h: SpecProduct) => void) => {
            const r = diff(mutate);
            expect(r.level, pick(r.changes).join('\n')).toBe('patch');
            return r;
        };

        it('descriptions and notes', () => {
            expectChange(patchOnly((h) => (v(h, 'person').description = 'Someone.')), 'patch', 'docs', 'person');
            expectChange(patchOnly((h) => (v(h, 'person').attributes[1]!.description = 'First name.')), 'patch', 'docs', 'person.attributes.first_name');
            expectChange(patchOnly((h) => (v(h, 'person').attributes[1]!.note = 'Required.')), 'patch', 'docs', 'person.attributes.first_name');
            expectChange(patchOnly((h) => (v(h, 'person').actions[0]!.description = 'Merges two people.')), 'patch', 'docs', 'person.actions.merge');
            expectChange(patchOnly((h) => (v(h, 'person').edges[0]!.details = 'Their emails.')), 'patch', 'docs', 'person.edges.emails');
            expectChange(patchOnly((h) => (h.title = 'People')), 'patch', 'docs', '');
        });

        it('deprecation flags', () => {
            expectChange(patchOnly((h) => (v(h, 'person').deprecated = true)), 'patch', 'deprecation', 'person', /false -> true/);
            expectChange(patchOnly((h) => (v(h, 'person').edges[0]!.deprecated = true)), 'patch', 'deprecation', 'person.edges.emails');
            expectChange(patchOnly((h) => (v(h, 'person').actions[0]!.deprecated = true)), 'patch', 'deprecation', 'person.actions.merge');
        });

        it('examples', () => {
            expectChange(patchOnly((h) => (v(h, 'person').attributes[1]!.example = 'Grace')), 'patch', 'docs', 'person.attributes.first_name', /example/);
        });

        it('documented type change that maps to the same TypeScript type', () => {
            expectChange(patchOnly((h) => (v(h, 'person').attributes[2]!.type = 'date_time')), 'patch', 'docs', 'person.attributes.birthdate', /same TypeScript type/);
        });

        it('spec metadata that does not reach the generated API', () => {
            expectChange(patchOnly((h) => (v(h, 'person').edges[0]!.post = true)), 'patch', 'other', 'person');
            expectChange(patchOnly((h) => (h.openApi = false)), 'patch', 'other', '');
        });
    });

    it('reports the highest level present, sorted most severe first', () => {
        const r = diff((h) => {
            v(h, 'person').description = 'changed';
            v(h, 'person').orders.push('birthdate');
            v(h, 'person').orders = v(h, 'person').orders.filter((o) => o !== 'first_name');
        });
        expect(r.level).toBe('major');
        expect(r.changes.map((c) => c.level)).toEqual(['major', 'minor', 'patch']);
    });

    describe('rendering', () => {
        it('markdown groups by level and product and caps long lists', () => {
            const [base, head] = pair((h) => {
                for (let i = 0; i < 40; i++) v(h, 'person').attributes.push(attribute(`extra_${i}`, 'string'));
                v(h, 'person').actions = [];
            });
            const md = renderMarkdown(diffSpecs(base, head), { limit: 10 });
            expect(md).toContain('## Planning Center API changes: major');
            expect(md).toContain('### Major (breaking)');
            expect(md).toContain('### Minor (additions)');
            expect(md).toContain('#### people (40)');
            expect(md).toContain('…and 30 more');
            expect(md.indexOf('### Major')).toBeLessThan(md.indexOf('### Minor'));
        });

        it('markdown stays under the length cap', () => {
            const [base, head] = pair((h) => {
                for (let i = 0; i < 2000; i++) v(h, 'person').attributes.push(attribute(`extra_attribute_with_a_long_name_${i}`, 'string'));
            });
            const md = renderMarkdown(diffSpecs(base, head), { limit: 5000, maxLength: 5000 });
            expect(md.length).toBeLessThanOrEqual(5000);
            expect(md).toMatch(/and \d+ more/);
        });

        it('summaries for none and changes', () => {
            expect(renderSummary({ level: 'none', changes: [] })).toContain('none');
            expect(renderMarkdown({ level: 'none', changes: [] })).toContain('No changes');
            expect(renderSummary(diff((h) => (h.version = 'x')))).toMatch(/^spec-diff: major \(1 major, 0 minor, 0 patch\)/);
        });
    });

    it("type tables match scripts/generate.ts", () => {
        const source = readFileSync(new URL('../../scripts/generate.ts', import.meta.url), 'utf8');
        const table = (name: string) => {
            const body = new RegExp(`const ${name}: Record<string, string> = \\{([\\s\\S]*?)\\n\\};`).exec(source)?.[1];
            expect(body, `${name} in scripts/generate.ts`).toBeDefined();
            return Object.fromEntries([...body!.matchAll(/^\s*([A-Za-z_]+): '([^']*)',/gm)].map((m) => [m[1], m[2]]));
        };
        expect(table('ATTRIBUTE_TYPES')).toEqual(ATTRIBUTE_TYPES);
        expect(table('WHERE_TYPES')).toEqual(WHERE_TYPES);
    });

    // The diff models what scripts/generate.ts emits; check that model against the committed
    // output so the two can't drift apart silently.
    describe('surface model matches src/generated/', () => {
        const specDir = new URL('../../spec/', import.meta.url);
        const graphs = Object.values(productGraphs) as ProductGraph[];
        for (const file of readdirSync(specDir).filter((f) => f.endsWith('.json'))) {
            const spec = JSON.parse(readFileSync(new URL(file, specDir), 'utf8')) as SpecProduct;
            it(spec.slug, () => {
                const graph = graphs.find((g) => g.slug === spec.slug);
                expect(graph, `generated graph for ${spec.slug}`).toBeDefined();
                const model = surface(spec);
                const edges = (m: Map<string, { vertex: string; many: boolean; canCreate: boolean }>) =>
                    Object.fromEntries([...m].map(([k, e]) => [k, { vertex: e.vertex, many: e.many, canCreate: e.canCreate }]));
                expect(edges(model.root)).toEqual({ ...graph!.root });
                expect(graph!.version).toBe(spec.version);
                const vertices = Object.fromEntries([...model.vertices].map(([id, x]) => [id, {
                    type: x.spec.name,
                    edges: edges(x.edges),
                    actions: x.spec.actions.map((a) => a.name),
                    canUpdate: x.spec.permissions.canUpdate,
                    canDelete: x.spec.permissions.canDestroy,
                    ...(x.canonicalPath ? { canonicalPath: x.canonicalPath } : {}),
                }]));
                expect(vertices).toEqual(JSON.parse(JSON.stringify(graph!.vertices)));
                const source = readFileSync(new URL(`../../src/generated/${spec.slug}.ts`, import.meta.url), 'utf8');
                const exported = [...source.matchAll(/^export type (\w+) = PcoResource<(\w+)Schema>;$/gm)].map((m) => m[1]).sort();
                expect([...model.vertices.values()].map((x) => x.alias).sort()).toEqual(exported);
            });
        }
    });
});
