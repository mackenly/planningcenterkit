/**
 * Generates the API reference pages of the docs site from the documentation snapshots in
 * `spec/*.json`: one page per product and one per resource, as MDX under
 * `site/src/content/docs/reference/`.
 *
 * Usage: node scripts/generate-reference.ts
 *
 * The output directory is generated at build time (`npm run docs:build`) and gitignored. It is
 * deleted and rewritten on every run, and the output is deterministic: running it twice produces
 * byte-identical files.
 *
 * The model mirrors scripts/generate.ts (root edges, nested edges, `many`, `canCreate`, type
 * mapping, type alias names), so the client paths and types shown here are the ones the
 * generated client accepts.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SpecAttribute, SpecEdge, SpecProduct, SpecVertex } from './codegen/spec-types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_DIR = join(ROOT, 'spec');
const OUT_DIR = join(ROOT, 'site', 'src', 'content', 'docs', 'reference');
const ORIGIN = 'https://api.planningcenteronline.com';
const PACKAGE = '@mackenly/planningcenterkit';

/** Names reserved on item references; edges with these names are reached with `.edge(name)`. */
const ITEM_RESERVED = new Set(['get', 'update', 'delete', 'action', 'edge', 'path', 'then']);
/** Names reserved on product clients; root edges with these names are reached with `.edge(name)`. */
const PRODUCT_RESERVED = new Set(['get', 'edge', 'then']);

/** One-line summaries per product (Planning Center's docs give only titles). */
const SUMMARIES: Record<string, string> = {
    api: 'OAuth applications, personal access tokens, and connected applications.',
    calendar: 'Events, event instances, resources and rooms, resource bookings, and approvals.',
    'check-ins': 'Events, check-ins, locations, stations, labels, passes, and headcounts.',
    current: 'The legacy Current donations product.',
    giving: 'Donations, funds, batches, pledges, payment sources, and recurring donations.',
    groups: 'Groups, group types, memberships, events, attendance, and tags.',
    people: 'People, households, lists, forms, workflows, notes, and custom fields.',
    publishing: 'Channels, episodes, series, speakers, and announcements.',
    registrations: 'Signups, registrations, attendees, and categories.',
    services: 'Service types, plans, items, songs and arrangements, teams, and schedules.',
    webhooks: 'Webhook subscriptions, available events, and deliveries.',
};

// ---------------------------------------------------------------------------
// Names (kept in step with scripts/generate.ts)
// ---------------------------------------------------------------------------

function pascal(name: string): string {
    const out = name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((part) => part[0]!.toUpperCase() + part.slice(1))
        .join('');
    return /^[0-9]/.test(out) ? `_${out}` : out || '_';
}

function camel(name: string): string {
    const p = pascal(name);
    return p[0]!.toLowerCase() + p.slice(1);
}

const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

const ATTRIBUTE_TYPES: Record<string, string> = {
    string: 'string',
    currency_abbreviation: 'string',
    primary_key: 'string',
    id: 'string',
    integer: 'number',
    float: 'number',
    decimal: 'number',
    number: 'number',
    boolean: 'boolean',
    date: 'string',
    date_time: 'string',
    array: 'unknown[]',
    hash: 'Record<string, unknown>',
    json: 'Record<string, unknown>',
    object: 'Record<string, unknown>',
    repeatable_schedule: 'Record<string, unknown>',
};

const WHERE_TYPES: Record<string, string> = {
    string: 'string',
    currency_abbreviation: 'string',
    primary_key: 'string',
    id: 'string',
    integer: 'number',
    float: 'number',
    decimal: 'number',
    number: 'number',
    boolean: 'boolean',
    date: 'string | Date',
    date_time: 'string | Date',
    array: 'string',
};

function attributeType(type: string | null): string {
    const mapped = type ? ATTRIBUTE_TYPES[type] : undefined;
    return mapped ? `${mapped} | null` : 'unknown';
}

function whereType(name: string, type: string | null): string {
    if (/(^|_)id$/.test(name) && type === 'integer') return 'string | number';
    return (type ? WHERE_TYPES[type] : undefined) ?? 'unknown';
}

function assignableFallback(name: string): string {
    if (name.endsWith('_ids')) return 'string[]';
    if (name.endsWith('_id')) return 'string';
    return 'unknown';
}

/** Type alias names per vertex, exactly as scripts/generate.ts picks them. */
function aliasNames(spec: SpecProduct, ids: string[]): Map<string, string> {
    const ns = pascal(spec.product);
    const reserved = [`${ns}Schema`, `${ns}Root`, 'SchemaCheck', 'AssertSchema', 'AssertRoot', 'ProductGraph', 'ProductSchema', 'RootSchema', 'PcoResource'];
    const counts = new Map<string, number>();
    for (const id of ids) {
        const p = pascal(spec.vertices[id]!.name);
        counts.set(p, (counts.get(p) ?? 0) + 1);
    }
    const used = new Set(reserved);
    const free = (c: string) => !used.has(c) && !used.has(`${c}Attributes`) && !used.has(`${c}Schema`);
    const names = new Map<string, string>();
    for (const id of ids) {
        const candidates = [pascal(spec.vertices[id]!.name), pascal(id)];
        if (counts.get(candidates[0]!)! > 1) candidates.shift();
        let chosen = candidates.find(free);
        for (let n = 2; !chosen; n++) {
            const c = `${candidates[candidates.length - 1]}${n}`;
            if (free(c)) chosen = c;
        }
        used.add(chosen);
        used.add(`${chosen}Attributes`);
        used.add(`${chosen}Schema`);
        names.set(id, chosen);
    }
    return names;
}

// ---------------------------------------------------------------------------
// Model (kept in step with scripts/generate.ts)
// ---------------------------------------------------------------------------

interface Edge {
    tail: string;
    name: string;
    head: string;
    path: string;
    many: boolean;
    canCreate: boolean;
    filters: string[];
    deprecated: boolean;
    details: string | null;
}

interface Product {
    spec: SpecProduct;
    ns: string;
    ids: string[];
    root: Edge[];
    edges: Map<string, Edge[]>;
    inbound: Map<string, Edge[]>;
    aliases: Map<string, string>;
    /** Shortest client expression that reaches a collection of each vertex, e.g. `pco.people.people`. */
    access: Map<string, string>;
}

function edgeModel(spec: SpecProduct, tailId: string, tail: SpecVertex, edge: SpecEdge): Edge {
    const head = spec.vertices[edge.head]!;
    const relationship = tail.relationships.find((r) => r.name === edge.name);
    let many: boolean;
    if (edge.response) many = edge.response === 'collection';
    else if (relationship) many = relationship.association !== 'to_one';
    else many = true;
    const permissions = head.permissions;
    let canCreate = permissions.canCreate && permissions.edges.includes(edge.id);
    if (!canCreate && permissions.canCreate && permissions.edges.length === 0 && edge.path === head.path) canCreate = true;
    return {
        tail: tailId,
        name: edge.name,
        head: edge.head,
        path: edge.path,
        many,
        canCreate,
        filters: edge.filters,
        deprecated: edge.deprecated,
        details: edge.details,
    };
}

function idVar(vertexId: string): string {
    return `${camel(vertexId)}Id`;
}

function follow(base: string, name: string, reserved: Set<string>): string {
    return reserved.has(name) ? `${base}.edge('${name}')` : `${base}.${name}`;
}

function buildProduct(spec: SpecProduct): Product {
    const ids = Object.keys(spec.vertices).sort(compare);
    const root: Edge[] = [];
    const edges = new Map<string, Edge[]>();
    const inbound = new Map<string, Edge[]>();
    for (const id of ids) {
        const v = spec.vertices[id]!;
        const list: Edge[] = [];
        const seen = new Set<string>();
        for (const edge of v.edges) {
            if (!spec.vertices[edge.head]) continue;
            const isRoot = id === spec.entry && edge.path === `${spec.basePath}/${edge.name}`;
            const followsRule = /\}\/[^/]+$/.test(edge.path) && edge.path.endsWith(`}/${edge.name}`);
            if (!isRoot && !followsRule) continue;
            const dedupe = `${isRoot ? 'root' : id}:${edge.name}`;
            if (seen.has(dedupe)) continue;
            seen.add(dedupe);
            const model = edgeModel(spec, id, v, edge);
            (isRoot ? root : list).push(model);
        }
        edges.set(id, list);
    }
    if (spec.slug === 'people' && spec.vertices.person && !root.some((e) => e.name === 'me')) {
        root.push({
            tail: spec.entry,
            name: 'me',
            head: 'person',
            path: '/people/v2/me',
            many: false,
            canCreate: false,
            filters: [],
            deprecated: false,
            details: 'The person you are authenticated as.',
        });
    }
    root.sort((a, b) => compare(a.name, b.name));
    for (const id of ids) {
        for (const e of edges.get(id)!) {
            const list = inbound.get(e.head) ?? [];
            list.push(e);
            inbound.set(e.head, list);
        }
    }
    for (const list of inbound.values()) list.sort((a, b) => compare(a.tail, b.tail) || compare(a.name, b.name));

    // Breadth-first from the root collections: the shortest chain to a collection of each vertex.
    // Only collections have `.id()`, so chains continue through `many` edges only.
    const client = `pco.${spec.product}`;
    const access = new Map<string, string>();
    const queue: string[] = [];
    for (const e of root) {
        if (!e.many || access.has(e.head)) continue;
        access.set(e.head, follow(client, e.name, PRODUCT_RESERVED));
        queue.push(e.head);
    }
    while (queue.length > 0) {
        const id = queue.shift()!;
        const base = `${access.get(id)!}.id(${idVar(id)})`;
        for (const e of edges.get(id)!) {
            if (!e.many || access.has(e.head)) continue;
            access.set(e.head, follow(base, e.name, ITEM_RESERVED));
            queue.push(e.head);
        }
    }
    return { spec, ns: pascal(spec.product), ids, root, edges, inbound, aliases: aliasNames(spec, ids), access };
}

// ---------------------------------------------------------------------------
// MDX helpers
// ---------------------------------------------------------------------------

/** Escapes text outside code for MDX: braces and angle brackets would start JSX expressions. */
function escapeProse(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/[{}]/g, (c) => `\\${c}`).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escapes inline text, leaving `code spans` as they are. */
function inline(text: string): string {
    return text
        .split(/(`[^`]*`)/g)
        .map((part, i) => (i % 2 === 1 ? part : escapeProse(part)))
        .join('');
}

/**
 * Planning Center's Markdown descriptions as an MDX block: fenced code is kept, headings become
 * bold lines (the page owns the outline), and everything else is escaped.
 */
function block(text: string): string {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const out: string[] = [];
    let fence: string | null = null;
    for (const line of lines) {
        const marker = /^\s*(```+|~~~+)/.exec(line);
        if (fence) {
            out.push(line);
            if (marker && marker[1]!.startsWith(fence)) fence = null;
            continue;
        }
        if (marker) {
            fence = marker[1]!;
            // A bare fence gets a language, so it is highlighted as plain text.
            const opener = line.trim();
            out.push(opener === fence ? `${fence}text` : opener);
            continue;
        }
        const heading = /^#{1,6}\s+(.*)$/.exec(line);
        out.push(heading ? `**${inline(heading[1]!.trim())}**` : inline(line));
    }
    if (fence) out.push(fence);
    return out.join('\n').trim();
}

/** Text for a table cell: one line, pipes escaped. */
function cell(text: string): string {
    return inline(text.replace(/\s+/g, ' ').trim()).replace(/\|/g, '\\|');
}

/** A code span for a table cell. */
function code(text: string): string {
    return `\`${text.replace(/\|/g, '\\|')}\``;
}

function table(head: string[], rows: string[][]): string {
    return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

/** Whether a description fits in a table cell. */
function short(text: string): boolean {
    return !text.includes('```') && !/\n\s*\n/.test(text.trim()) && !/^\s*[-*] /m.test(text) && text.length <= 300;
}

function frontmatter(fields: Record<string, unknown>): string {
    const yaml = (value: unknown, indent: string): string => {
        if (value !== null && typeof value === 'object') {
            return Object.entries(value as Record<string, unknown>)
                .map(([k, v]) => (v !== null && typeof v === 'object' ? `\n${indent}${k}:${yaml(v, `${indent}  `)}` : `\n${indent}${k}: ${yaml(v, indent)}`))
                .join('');
        }
        return typeof value === 'string' ? JSON.stringify(value) : String(value);
    };
    return `---${yaml(fields, '')}\n---\n`;
}

function firstSentence(text: string | null): string | null {
    if (!text) return null;
    const flat = text.replace(/```[\s\S]*?```/g, ' ').replace(/[`*_#]/g, '').replace(/\s+/g, ' ').trim();
    const match = /^(.+?[.!?])(\s|$)/.exec(flat);
    const sentence = (match ? match[1]! : flat).trim();
    return sentence.length > 0 && sentence.length <= 200 ? sentence : null;
}

const slugOf = (id: string) => id.replace(/_/g, '-');
const resourceUrl = (p: Product, id: string) => `/reference/${p.spec.slug}/${slugOf(id)}/`;
const productUrl = (p: Product) => `/reference/${p.spec.slug}/`;
const docsUrl = (p: Product, id?: string) =>
    `${ORIGIN}/docs/apps/${p.spec.slug}/versions/${p.spec.version}${id ? `/vertices/${id}` : ''}`;
const subpath = (p: Product) => (p.spec.slug === 'webhooks' ? 'webhooks-api' : p.spec.slug);
const productTitle = (p: Product) => (p.spec.title ?? p.ns).replace(/^Planning Center /, '');
const link = (p: Product, id: string) => `[${p.spec.vertices[id]!.name}](${resourceUrl(p, id)})`;
const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function resourcePage(p: Product, id: string, order: number): string {
    const spec = p.spec;
    const v = spec.vertices[id]!;
    const alias = p.aliases.get(id)!;
    const title = productTitle(p);
    const out: string[] = [];
    const fm: Record<string, unknown> = {
        title: `${v.name} (${title})`,
        description: firstSentence(v.description) ?? `The ${v.name} resource in Planning Center ${title}: how to reach it, its attributes, and what you can query and write.`,
        sidebar: v.deprecated
            ? { label: v.name, order, badge: { text: 'Deprecated', variant: 'caution' } }
            : { label: v.name, order },
    };
    out.push(frontmatter(fm));

    if (v.deprecated) out.push(':::caution[Deprecated]\nPlanning Center has deprecated this resource.\n:::\n');
    if (v.description) out.push(`${block(v.description)}\n`);
    out.push(table(['Property', 'Value'], [
        ['Product', `[${title}](${productUrl(p)}) (\`pco.${spec.product}\`, API version \`${spec.version}\`)`],
        ['Resource type', code(v.name)],
        ['TypeScript', `${code(`${p.ns}.${alias}`)}, attributes ${code(`${p.ns}.${alias}Attributes`)}, schema ${code(`${p.ns}.${alias}Schema`)}`],
        ...(v.path ? [['Planning Center path', code(v.path)]] : []),
        ['Planning Center docs', `[${v.name}](${docsUrl(p, id)})`],
    ]));
    out.push('');

    // How to reach it
    out.push('## How to reach it\n');
    const reach: string[][] = [];
    if (id === spec.entry) {
        reach.push([code(`pco.${spec.product}.get()`), 'The product root', '', 'No']);
    }
    for (const e of p.root.filter((r) => r.head === id)) {
        reach.push([
            code(follow(`pco.${spec.product}`, e.name, PRODUCT_RESERVED)),
            e.many ? 'Collection' : 'Single resource',
            e.filters.length ? e.filters.map(code).join(', ') : '',
            yesNo(e.canCreate),
        ]);
    }
    for (const e of p.inbound.get(id) ?? []) {
        const tailAccess = p.access.get(e.tail);
        const base = tailAccess ? `${tailAccess}.id(${idVar(e.tail)})` : `${camel(e.tail)}Ref`;
        const expr = code(follow(base, e.name, ITEM_RESERVED));
        reach.push([
            tailAccess ? expr : `${expr} (from a ${link(p, e.tail)} reference)`,
            e.many ? 'Collection' : 'Single resource',
            e.filters.length ? e.filters.map(code).join(', ') : '',
            yesNo(e.canCreate),
        ]);
    }
    if (reach.length === 0) {
        out.push(`No documented path leads to this resource. It may appear in \`included\` or as a relationship of other resources; use [\`pco.request()\`](/guides/querying/#anything-else) for undocumented endpoints.\n`);
    } else {
        out.push(table(['Client path', 'Returns', 'Filters', 'Create'], reach));
        out.push('');
        const many = p.access.get(id);
        if (many) {
            out.push(`From a collection, \`.id(${idVar(id)})\` addresses one ${v.name}: \`${many}.id(${idVar(id)})\`. Collections support [\`where\`, \`include\`, \`order\`, and pagination](/guides/querying/); single resources have \`get()\`.\n`);
        } else {
            out.push('Collections support [`where`, `include`, `order`, and pagination](/guides/querying/); single resources have `get()`.\n');
        }
    }

    // Attributes
    out.push('## Attributes\n');
    const attrs = v.attributes.filter((a) => a.name !== 'id');
    const long: SpecAttribute[] = [];
    if (attrs.length === 0) {
        out.push('This resource has no documented attributes.\n');
    } else {
        const rows = attrs.map((a) => {
            const text = [a.description, a.note && a.note !== a.description ? a.note : null].filter(Boolean).join(' ');
            let description = '';
            if (text && short(text)) description = cell(text);
            else if (text) {
                long.push(a);
                description = `See [details](#${slugOf(a.name).toLowerCase()}).`;
            }
            return [code(a.name), code(attributeType(a.type)), description];
        });
        out.push(`On ${code(`${p.ns}.${alias}Attributes`)}. Every resource also has \`id\` and \`type\` (\`'${v.name}'\`) next to its attributes.\n`);
        out.push(table(['Name', 'Type', 'Description'], rows));
        out.push('');
        if (long.length > 0) {
            out.push('### Attribute details\n');
            for (const a of long) {
                // `{#id}` keeps the anchor stable; headingAttributes is on in astro.config.ts.
                out.push(`#### ${code(a.name)} {#${slugOf(a.name).toLowerCase()}}\n`);
                if (a.description) out.push(`${block(a.description)}\n`);
                if (a.note && a.note !== a.description) out.push(`${block(a.note)}\n`);
            }
        }
    }

    // Relationships and includes
    if (v.relationships.length > 0 || v.includes.length > 0) {
        out.push('## Relationships and includes\n');
        if (v.includes.length > 0) {
            out.push(`Side-load with \`include()\` (or \`get({ include })\`) and read with \`related(resource, name)\`: ${v.includes.map(code).join(', ')}.\n`);
        } else {
            out.push('Planning Center documents no includes for this resource.\n');
        }
        if (v.relationships.length > 0) {
            const byType = new Map<string, string>();
            for (const vid of p.ids) if (!byType.has(spec.vertices[vid]!.name)) byType.set(spec.vertices[vid]!.name, vid);
            out.push(table(['Relationship', 'Type', 'To', 'Includable'], [...v.relationships].sort((a, b) => compare(a.name, b.name)).map((r) => {
                const target = r.graphType ? byType.get(r.graphType) : undefined;
                return [
                    code(r.name),
                    r.association === 'to_one' ? 'To one' : r.association === 'to_many' ? 'To many' : cell(r.association),
                    target ? link(p, target) : r.graphType ? code(r.graphType) : '',
                    yesNo(v.includes.includes(r.name)),
                ];
            })));
            out.push('');
        }
    }

    // Querying
    out.push('## Querying\n');
    if (v.queries.length > 0) {
        out.push('### Where\n');
        out.push(`\`where(field, value)\` for equality; \`where(field, op, value)\` with the operators listed.\n`);
        out.push(table(['Field', 'Value type', 'Operators'], [...v.queries].sort((a, b) => compare(a.name, b.name)).map((q) => [
            code(q.name),
            code(whereType(q.name, q.type)),
            q.ops.length ? q.ops.map(code).join(', ') : 'Equality only',
        ])));
        out.push('');
    } else {
        out.push('No documented `where` fields.\n');
    }
    if (v.orders.length > 0) {
        out.push('### Order\n');
        out.push(`\`order(...)\` accepts these fields, ascending, or descending with a \`-\` prefix: ${v.orders.map(code).join(', ')}.\n`);
    } else {
        out.push('No documented `order` fields.\n');
    }
    const filtered = [...p.root.filter((r) => r.head === id && r.filters.length), ...(p.inbound.get(id) ?? []).filter((e) => e.filters.length)];
    if (filtered.length > 0) {
        out.push('### Filters\n');
        out.push('`filter(...)` names depend on the edge you query through:\n');
        out.push(table(['Edge', 'Filters'], filtered.map((e) => [
            e.tail === spec.entry && p.root.includes(e) ? code(`pco.${spec.product}.${e.name}`) : `${code(e.name)} on ${link(p, e.tail)}`,
            e.filters.map(code).join(', '),
        ])));
        out.push('');
    }

    // Edges
    const own = p.edges.get(id)!;
    out.push('## Edges\n');
    if (own.length > 0) {
        out.push(`Follow these from one ${v.name}, \`ref = ${p.access.get(id) ? `${p.access.get(id)}.id(${idVar(id)})` : `…id(${idVar(id)})`}\`:\n`);
        out.push(table(['Edge', 'Leads to', 'Returns', 'Filters', 'Create'], own.map((e) => [
            code(follow('ref', e.name, ITEM_RESERVED)) + (e.deprecated ? ' (deprecated)' : ''),
            link(p, e.head),
            e.many ? 'Collection' : 'Single resource',
            e.filters.length ? e.filters.map(code).join(', ') : '',
            yesNo(e.canCreate),
        ])));
        out.push('');
    } else if (id === spec.entry) {
        out.push(`The product root's edges are the [root collections](${productUrl(p)}#root-collections) on \`pco.${spec.product}\`.\n`);
    } else {
        out.push('This resource has no documented edges.\n');
    }

    // Writes
    out.push('## Writing\n');
    const perms = v.permissions;
    const creatable = [...p.root.filter((r) => r.head === id && r.canCreate), ...(p.inbound.get(id) ?? []).filter((e) => e.canCreate)];
    const attributeMap = new Map(v.attributes.map((a) => [a.name, a]));
    const assignable = (names: string[]) =>
        table(['Attribute', 'Type'], names.map((n) => {
            const a = attributeMap.get(n);
            return [code(n), code(a ? attributeType(a.type) : assignableFallback(n))];
        }));
    const writes: string[][] = [
        ['Create', perms.canCreate && creatable.length > 0 ? `Yes, \`create()\` on ${creatable.map((e) => (p.root.includes(e) ? code(`pco.${spec.product}.${e.name}`) : `${code(e.name)} on ${link(p, e.tail)}`)).join(', ')}` : perms.canCreate ? 'Documented, but on no path the client follows' : 'No'],
        ['Update', perms.canUpdate ? 'Yes, `update()` on a reference' : 'No'],
        ['Delete', perms.canDestroy ? 'Yes, `delete()` on a reference' : 'No'],
    ];
    out.push(table(['Property', 'Value'], writes));
    out.push('');
    if (perms.canCreate && perms.createAssignable.length > 0) {
        out.push(`### Create attributes\n\nTyped as ${code(`${p.ns}.${alias}Schema['create']`)}.\n`);
        out.push(assignable(perms.createAssignable));
        out.push('');
    }
    if (perms.canUpdate && perms.updateAssignable.length > 0) {
        out.push(`### Update attributes\n\nTyped as ${code(`${p.ns}.${alias}Schema['update']`)}.\n`);
        out.push(assignable(perms.updateAssignable));
        out.push('');
    }
    if (perms.canCreate || perms.canUpdate || perms.canDestroy) out.push('See [Writing data](/guides/writing-data/).\n');

    // Actions
    if (v.actions.length > 0) {
        out.push('## Actions\n');
        out.push('Run with `ref.action(name, body?)`. Bodies are untyped: see Planning Center\'s docs for each action.\n');
        out.push(table(['Action', 'Path', 'Description'], [...v.actions].sort((a, b) => compare(a.name, b.name)).map((a) => [
            code(a.name) + (a.deprecated ? ' (deprecated)' : ''),
            code(`POST ${a.path}`),
            a.description ? (short(a.description) ? cell(a.description) : cell(firstSentence(a.description) ?? 'See Planning Center\'s docs.')) : '',
        ])));
        out.push('');
    }

    out.push('## Example\n');
    out.push('```ts');
    out.push(`import type { ${p.ns} } from '${PACKAGE}';`);
    out.push('');
    const many = p.access.get(id);
    const single = [...p.root.filter((r) => r.head === id && !r.many)][0];
    if (id === spec.entry) {
        out.push(`const { data } = await pco.${spec.product}.get(); // GET ${spec.basePath}`);
        out.push(`const root: ${p.ns}.${alias} = data;`);
    } else if (many) {
        const field = v.orders[0];
        const vars = [...many.matchAll(/\.id\((\w+)\)/g)].map((m) => m[1]!);
        for (const name of vars) out.push(`const ${name} = '1'; // ${spec.vertices[p.ids.find((x) => idVar(x) === name)!]!.name} id`);
        if (vars.length > 0) out.push('');
        out.push(`const page = await ${many}${field ? `.order('${field}')` : ''}.perPage(25).list();`);
        out.push(`const items: ${p.ns}.${alias}[] = page.data;`);
    } else if (single) {
        out.push(`const { data } = await ${follow(`pco.${spec.product}`, single.name, PRODUCT_RESERVED)}.get();`);
        out.push(`const item: ${p.ns}.${alias} | null = data;`);
    } else {
        out.push(`function describe(resource: ${p.ns}.${alias}): string {`);
        out.push('    return `${resource.type} ${resource.id}`;');
        out.push('}');
    }
    out.push('```\n');
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function productPage(p: Product, order: number): string {
    const spec = p.spec;
    const title = productTitle(p);
    const out: string[] = [];
    out.push(frontmatter({
        title: `${title} reference`,
        description: `Planning Center ${title} in Planning Center Kit: ${SUMMARIES[spec.slug] ?? 'every resource, edge, and query option.'}`,
        sidebar: { order, group: { label: title } },
    }));
    out.push(`${SUMMARIES[spec.slug] ?? ''}\n`);
    out.push(table(['Property', 'Value'], [
        ['Client property', code(`pco.${spec.product}`)],
        ['Subpath import', code(`import { create${p.ns}Client } from '${PACKAGE}/${subpath(p)}'`)],
        ['Types namespace', code(p.ns)],
        ['Base path', code(spec.basePath)],
        ['Pinned API version', code(spec.version)],
        ['Resource types', String(p.ids.length)],
        ['Planning Center docs', `[${spec.title ?? title} API](${docsUrl(p)})`],
    ]));
    out.push('');
    out.push(`Each product client sends \`X-PCO-API-Version: ${spec.version}\`, the version these types were generated from. Override it with \`new PlanningCenter({ auth, versions: { ${spec.product}: '...' } })\`; the types won't follow. See [Products](/guides/products/).\n`);
    out.push('```ts');
    out.push(`import { create${p.ns}Client } from '${PACKAGE}/${subpath(p)}';`);
    out.push('');
    out.push(`const ${camel(spec.product)} = create${p.ns}Client({ auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! } });`);
    out.push(`const { data: root } = await ${camel(spec.product)}.get(); // ${spec.basePath}`);
    out.push('```\n');

    out.push('## Root collections\n');
    out.push(`Properties on \`pco.${spec.product}\`, named after their URL. \`pco.${spec.product}.get()\` fetches the product root (\`${spec.basePath}\`), and \`pco.${spec.product}.edge(name)\` follows any root edge by name.\n`);
    if (p.root.length > 0) {
        out.push(table(['Client path', 'Resource', 'Returns', 'Filters', 'Create'], p.root.map((e) => [
            code(follow(`pco.${spec.product}`, e.name, PRODUCT_RESERVED)),
            link(p, e.head),
            e.many ? 'Collection' : 'Single resource',
            e.filters.length ? e.filters.map(code).join(', ') : '',
            yesNo(e.canCreate),
        ])));
        out.push('');
    }

    out.push('## Resources\n');
    out.push(table(['Resource', 'TypeScript', 'Description'], p.ids.map((id) => {
        const v = spec.vertices[id]!;
        return [link(p, id) + (v.deprecated ? ' (deprecated)' : ''), code(`${p.ns}.${p.aliases.get(id)!}`), cell(firstSentence(v.description) ?? '')];
    })));
    out.push('');
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function indexPage(products: Product[]): string {
    const out: string[] = [];
    out.push(frontmatter({
        title: 'Reference',
        description: 'Every Planning Center product and resource in Planning Center Kit: client paths, attributes, query options, writes, and actions, generated from Planning Center\'s API documentation.',
        sidebar: { order: 0, group: { label: 'Reference' } },
    }));
    out.push(`Generated from Planning Center's published API documentation (the same snapshot in \`spec/\` that the typed clients are generated from), so every name here is one the client accepts. Names are \`snake_case\` exactly as in Planning Center's own reference.\n`);
    out.push(':::tip[Finding a name]\nEach resource page lists its client paths, `where` fields and operators, `order` fields, includes, filters per edge, edges, writable attributes, and actions. Your editor shows the same names: press `.` or `\'` after a builder method.\n:::\n');
    out.push(table(['Product', 'Client', 'Import', 'Version', 'Resources'], products.map((p) => [
        `[${productTitle(p)}](${productUrl(p)})`,
        code(`pco.${p.spec.product}`),
        code(`${PACKAGE}/${subpath(p)}`),
        code(p.spec.version),
        String(p.ids.length),
    ])));
    out.push('');
    out.push('For how the builders work, see [Querying](/guides/querying/) and [Writing data](/guides/writing-data/).\n');
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const specs: SpecProduct[] = readdirSync(SPEC_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort(compare)
    .map((f) => JSON.parse(readFileSync(join(SPEC_DIR, f), 'utf8')) as SpecProduct);
if (specs.length === 0) {
    console.error(`no spec files in ${SPEC_DIR} (run npm run spec:fetch)`);
    process.exit(1);
}

const products = specs.map(buildProduct).sort((a, b) => compare(productTitle(a), productTitle(b)));

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'index.mdx'), indexPage(products));
let pages = 1;
products.forEach((p, i) => {
    const dir = join(OUT_DIR, p.spec.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.mdx'), productPage(p, i + 1));
    pages++;
    p.ids.forEach((id, j) => {
        writeFileSync(join(dir, `${slugOf(id)}.mdx`), resourcePage(p, id, j + 1));
        pages++;
    });
});
console.log(`reference: ${pages} pages for ${products.length} products in ${OUT_DIR}`);
