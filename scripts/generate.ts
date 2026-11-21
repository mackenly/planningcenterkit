/**
 * Generates `src/generated/*` from the documentation snapshots in `spec/*.json`.
 *
 * Usage: node scripts/generate.ts
 *
 * Output is deterministic: running it twice produces byte-identical files.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SpecAttribute, SpecEdge, SpecProduct, SpecVertex } from './codegen/spec-types.ts';

const ORIGIN = 'https://api.planningcenteronline.com';
const SPEC_DIR = 'spec';
const OUT_DIR = join('src', 'generated');
const INDENT = '    ';

/** Names the runtime reserves on resource/collection objects; edges with these names need care. */
const RESERVED_RUNTIME_NAMES = ['get', 'update', 'delete', 'action', 'edge', 'path', 'then'];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** Single-quoted TypeScript string literal. */
function str(value: string): string {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
}

/** Object key: bare when it is a valid identifier, quoted otherwise. */
function key(name: string): string {
    return IDENTIFIER.test(name) ? name : str(name);
}

/** `snake_case`, `kebab-case` or `already Pascal` -> `PascalCase`. Always a valid identifier. */
function pascal(name: string): string {
    const out = name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((part) => part[0]!.toUpperCase() + part.slice(1))
        .join('');
    return /^[0-9]/.test(out) ? `_${out}` : out || '_';
}

/** `kebab-case` / `snake_case` -> `camelCase`. */
function camel(name: string): string {
    const p = pascal(name);
    return p[0]!.toLowerCase() + p.slice(1);
}

/**
 * A TSDoc block, or `''` when there is nothing to say. Lines are trimmed of trailing space and
 * `*\/` is escaped so documentation text can never terminate the comment.
 */
function doc(paragraphs: Array<string | null | undefined>, indent: string): string {
    const lines: string[] = [];
    for (const paragraph of paragraphs) {
        if (!paragraph) continue;
        if (lines.length > 0) lines.push('');
        for (const line of paragraph.replace(/\r\n?/g, '\n').split('\n')) {
            lines.push(line.replace(/\*\//g, '*\\/').replace(/\s+$/, ''));
        }
    }
    while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
    if (lines.length === 0) return '';
    if (lines.length === 1 && lines[0]!.length + indent.length < 90) {
        return `${indent}/** ${lines[0]} */\n`;
    }
    return `${indent}/**\n${lines.map((l) => (l ? `${indent} * ${l}` : `${indent} *`)).join('\n')}\n${indent} */\n`;
}

/** A union of string literals (`never` when empty), wrapped when long. */
function union(values: readonly string[], indent: string, prefixLength = 0): string {
    if (values.length === 0) return 'never';
    const literals = values.map(str);
    const oneLine = literals.join(' | ');
    if (indent.length + prefixLength + oneLine.length <= 100) return oneLine;
    return literals.map((l) => `\n${indent}    | ${l}`).join('');
}

// ---------------------------------------------------------------------------
// Type mapping
// ---------------------------------------------------------------------------

/** `type_annotation.name` -> TypeScript type of the attribute value (before `| null`). */
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

/** `can_query` parameter type -> accepted `where` value type. */
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

const unmappedTypes = new Map<string, number>();

function attributeType(type: string | null): string {
    const mapped = type ? ATTRIBUTE_TYPES[type] : undefined;
    if (mapped) return mapped;
    const name = String(type);
    unmappedTypes.set(name, (unmappedTypes.get(name) ?? 0) + 1);
    return 'unknown';
}

function whereType(type: string | null): string {
    const mapped = type ? WHERE_TYPES[type] : undefined;
    if (mapped) return mapped;
    const name = `where:${String(type)}`;
    unmappedTypes.set(name, (unmappedTypes.get(name) ?? 0) + 1);
    return 'unknown';
}

const nullable = (type: string) => (type === 'unknown' ? type : `${type} | null`);

/** Type of an assignable field that is not a documented attribute (e.g. `primary_campus_id`). */
function assignableFallback(name: string): string {
    if (name.endsWith('_ids')) return 'string[]';
    if (name.endsWith('_id')) return 'string';
    return 'unknown';
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

interface EdgeModel {
    name: string;
    vertex: string;
    many: boolean;
    canCreate: boolean;
    filters: string[];
    deprecated: boolean;
    details: string | null;
}

interface VertexModel {
    id: string;
    spec: SpecVertex;
    edges: EdgeModel[];
    related: Array<[string, string]>;
}

interface ProductStats {
    slug: string;
    version: string;
    vertices: number;
    edges: number;
    rootEdges: number;
    skipped: Array<{ vertex: string; edge: string; path: string; reason: string }>;
    reserved: Array<{ vertex: string; name: string; kind: string }>;
    manySources: Record<string, number>;
    toOneButCollection: number;
    createFallback: string[];
    nonConformingActions: string[];
    bytes: number;
    graphBytes: number;
}

function edgeModel(spec: SpecProduct, tail: SpecVertex, edge: SpecEdge, stats: ProductStats): EdgeModel {
    const head = spec.vertices[edge.head]!;
    const relationship = tail.relationships.find((r) => r.name === edge.name);
    let many: boolean;
    if (edge.response) {
        many = edge.response === 'collection';
        stats.manySources[`openapi:${edge.response}`] = (stats.manySources[`openapi:${edge.response}`] ?? 0) + 1;
        if (many && relationship?.association === 'to_one') stats.toOneButCollection++;
    } else if (relationship) {
        many = relationship.association !== 'to_one';
        stats.manySources['relationship'] = (stats.manySources['relationship'] ?? 0) + 1;
    } else {
        many = true;
        stats.manySources['default'] = (stats.manySources['default'] ?? 0) + 1;
    }
    const permissions = head.permissions;
    let canCreate = permissions.canCreate && permissions.edges.includes(edge.id);
    if (!canCreate && permissions.canCreate && permissions.edges.length === 0 && edge.path === head.path) {
        // Creatable vertex that lists no create edges: the documented canonical path accepts POST.
        canCreate = true;
        stats.createFallback.push(`${edge.head} via ${edge.path}`);
    }
    return {
        name: edge.name,
        vertex: edge.head,
        many,
        canCreate,
        filters: edge.filters,
        deprecated: edge.deprecated,
        details: edge.details,
    };
}

function buildModel(spec: SpecProduct) {
    const stats: ProductStats = {
        slug: spec.slug,
        version: spec.version,
        vertices: 0,
        edges: 0,
        rootEdges: 0,
        skipped: [],
        reserved: [],
        manySources: {},
        toOneButCollection: 0,
        createFallback: [],
        nonConformingActions: [],
        bytes: 0,
        graphBytes: 0,
    };
    const byName = new Map<string, string>();
    for (const [id, v] of Object.entries(spec.vertices)) if (!byName.has(v.name)) byName.set(v.name, id);

    const root: EdgeModel[] = [];
    const vertices: VertexModel[] = [];
    for (const id of Object.keys(spec.vertices).sort()) {
        const v = spec.vertices[id]!;
        const edges: EdgeModel[] = [];
        const seen = new Set<string>();
        for (const edge of v.edges) {
            if (!spec.vertices[edge.head]) {
                stats.skipped.push({ vertex: id, edge: edge.name, path: edge.path, reason: 'unknown head vertex' });
                continue;
            }
            const isRoot = id === spec.entry && edge.path === `${spec.basePath}/${edge.name}`;
            const followsRule = /\}\/[^/]+$/.test(edge.path) && edge.path.endsWith(`}/${edge.name}`);
            const target = isRoot ? root : edges;
            if (!isRoot && !followsRule) {
                stats.skipped.push({ vertex: id, edge: edge.name, path: edge.path, reason: 'path is not ${itemUrl}/${name}' });
                continue;
            }
            const dedupe = `${isRoot ? 'root' : id}:${edge.name}`;
            if (seen.has(dedupe)) {
                stats.skipped.push({ vertex: id, edge: edge.name, path: edge.path, reason: 'duplicate edge name' });
                continue;
            }
            seen.add(dedupe);
            target.push(edgeModel(spec, v, edge, stats));
        }
        for (const action of v.actions) {
            if (!action.path.endsWith(`}/${action.name}`)) {
                stats.nonConformingActions.push(`${id}.${action.name} (${action.path})`);
            }
        }

        // related: relationship/include name -> vertex id
        const outbound = new Map(v.edges.map((e) => [e.name, e.head] as const));
        const related = new Map<string, string>();
        const resolve = (name: string, graphType: string | null) => {
            const viaType = graphType ? byName.get(graphType) : undefined;
            const target = viaType ?? outbound.get(name);
            if (target && spec.vertices[target]) related.set(name, target);
        };
        for (const r of v.relationships) resolve(r.name, r.graphType);
        for (const include of v.includes) {
            if (related.has(include)) continue;
            const relationship = v.relationships.find((r) => r.name === include);
            resolve(include, relationship?.graphType ?? null);
        }

        for (const e of edges) {
            if (RESERVED_RUNTIME_NAMES.includes(e.name)) stats.reserved.push({ vertex: id, name: e.name, kind: 'edge' });
        }
        for (const a of v.actions) {
            if (RESERVED_RUNTIME_NAMES.includes(a.name)) stats.reserved.push({ vertex: id, name: a.name, kind: 'action' });
            if (edges.some((e) => e.name === a.name)) stats.reserved.push({ vertex: id, name: a.name, kind: 'action also an edge' });
        }
        stats.edges += edges.length;
        vertices.push({ id, spec: v, edges, related: [...related].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)) });
    }
    // `GET /people/v2/me` (the authenticated person) is missing from the docs graph, but it's the most
    // common call there is, so add it as a single-resource root edge.
    if (spec.slug === 'people' && spec.vertices.person && !root.some((e) => e.name === 'me')) {
        root.push({
            name: 'me',
            vertex: 'person',
            many: false,
            canCreate: false,
            filters: [],
            deprecated: false,
            details: 'The person you are authenticated as (`GET /people/v2/me`).',
        });
    }
    root.sort((a, b) => (a.name < b.name ? -1 : 1));
    for (const e of root) {
        if (RESERVED_RUNTIME_NAMES.includes(e.name)) stats.reserved.push({ vertex: '(root)', name: e.name, kind: 'root edge' });
    }
    stats.vertices = vertices.length;
    stats.rootEdges = root.length;
    return { root, vertices, stats };
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

const I1 = INDENT;
const I2 = INDENT.repeat(2);
const I3 = INDENT.repeat(3);
const I4 = INDENT.repeat(4);

const edgeMeta = (e: EdgeModel) => `{ vertex: ${str(e.vertex)}, many: ${e.many}, canCreate: ${e.canCreate} }`;

function emitGraph(spec: SpecProduct, model: ReturnType<typeof buildModel>, graphName: string): string {
    let out = `export const ${graphName} = {\n`;
    out += `${I1}product: ${str(spec.product)},\n`;
    out += `${I1}slug: ${str(spec.slug)},\n`;
    out += `${I1}basePath: ${str(spec.basePath)},\n`;
    out += `${I1}version: ${str(spec.version)},\n`;
    out += `${I1}rootVertex: ${str(spec.entry)},\n`;
    out += model.root.length ? `${I1}root: {\n` : `${I1}root: {},\n`;
    for (const e of model.root) out += `${I2}${key(e.name)}: ${edgeMeta(e)},\n`;
    if (model.root.length) out += `${I1}},\n`;
    out += `${I1}vertices: {\n`;
    for (const v of model.vertices) {
        out += `${I2}${key(v.id)}: {\n`;
        out += `${I3}type: ${str(v.spec.name)},\n`;
        if (v.edges.length) {
            out += `${I3}edges: {\n`;
            for (const e of v.edges) out += `${I4}${key(e.name)}: ${edgeMeta(e)},\n`;
            out += `${I3}},\n`;
        } else {
            out += `${I3}edges: {},\n`;
        }
        out += `${I3}actions: [${v.spec.actions.map((a) => str(a.name)).join(', ')}],\n`;
        out += `${I3}canUpdate: ${v.spec.permissions.canUpdate},\n`;
        out += `${I3}canDelete: ${v.spec.permissions.canDestroy},\n`;
        const canonical = canonicalPath(spec, v.id);
        if (canonical) out += `${I3}canonicalPath: ${str(canonical)},\n`;
        out += `${I2}},\n`;
    }
    out += `${I1}},\n`;
    out += `} as const satisfies ProductGraph;\n`;
    return out;
}

/**
 * A vertex's own top-level collection URL (no path placeholders), used to address its items
 * directly. Undefined for nested-only resources, the entry vertex, and collection-only vertices.
 */
function canonicalPath(spec: SpecProduct, id: string): string | undefined {
    const v = spec.vertices[id]!;
    if (id === spec.entry || v.collectionOnly || !v.path) return undefined;
    if (v.path.includes('{') || !v.path.startsWith(`${spec.basePath}/`)) return undefined;
    return v.path;
}

/** Compact JSON of the runtime graph, to estimate its compiled size. */
function graphJson(spec: SpecProduct, model: ReturnType<typeof buildModel>): string {
    const edges = (list: EdgeModel[]) =>
        Object.fromEntries(list.map((e) => [e.name, { vertex: e.vertex, many: e.many, canCreate: e.canCreate }]));
    return JSON.stringify({
        product: spec.product,
        slug: spec.slug,
        basePath: spec.basePath,
        version: spec.version,
        rootVertex: spec.entry,
        root: edges(model.root),
        vertices: Object.fromEntries(model.vertices.map((v) => [v.id, {
            type: v.spec.name,
            edges: edges(v.edges),
            actions: v.spec.actions.map((a) => a.name),
            canUpdate: v.spec.permissions.canUpdate,
            canDelete: v.spec.permissions.canDestroy,
            canonicalPath: canonicalPath(spec, v.id),
        }])),
    });
}

function emitEdgeSchemas(edges: EdgeModel[], indent: string): string {
    if (edges.length === 0) return '{}';
    let out = '{\n';
    for (const e of edges) {
        out += doc([e.details, e.deprecated ? '@deprecated Deprecated in the Planning Center API.' : null], indent + I1);
        const filters = union(e.filters, indent + I1, 40);
        out += `${indent}${I1}${key(e.name)}: { vertex: ${str(e.vertex)}; many: ${e.many}; filters: ${filters}; create: ${e.canCreate} };\n`;
    }
    return out + `${indent}}`;
}

function attributeDoc(a: SpecAttribute): Array<string | null> {
    return [a.description, a.note && a.note !== a.description ? a.note : null];
}

function emitVertexSchema(v: VertexModel): string {
    const s = v.spec;
    const attributes = new Map<string, SpecAttribute>(s.attributes.map((a) => [a.name, a]));
    let out = doc([s.deprecated ? '@deprecated Deprecated in the Planning Center API.' : null], I1);
    out += `${I1}${key(v.id)}: {\n`;
    out += `${I2}type: ${str(s.name)};\n`;

    // attributes (the JSON:API `id` lives on the resource, never in `attributes`)
    const attrs = s.attributes.filter((a) => a.name !== 'id');
    if (attrs.length) {
        out += `${I2}attributes: {\n`;
        for (const a of attrs) {
            out += doc(attributeDoc(a), I3);
            out += `${I3}${key(a.name)}: ${nullable(attributeType(a.type))};\n`;
        }
        out += `${I2}};\n`;
    } else {
        out += `${I2}attributes: {};\n`;
    }

    out += `${I2}relationships: ${union(s.relationships.map((r) => r.name), I2, 15)};\n`;
    out += `${I2}includes: ${union(s.includes, I2, 10)};\n`;
    if (v.related.length) {
        out += `${I2}related: {\n`;
        for (const [name, target] of v.related) out += `${I3}${key(name)}: ${str(target)};\n`;
        out += `${I2}};\n`;
    } else {
        out += `${I2}related: {};\n`;
    }

    if (s.queries.length) {
        out += `${I2}where: {\n`;
        for (const q of s.queries) {
            // PCO ids are strings on the wire even where the docs annotate a foreign key as integer.
            const type = /(^|_)id$/.test(q.name) && q.type === 'integer' ? 'string | number' : whereType(q.type);
            out += `${I3}${key(q.name)}: ${type};\n`;
        }
        out += `${I2}};\n`;
    } else {
        out += `${I2}where: {};\n`;
    }
    const comparable = s.queries.filter((q) => q.ops.length > 0);
    if (comparable.length) {
        out += `${I2}whereOps: {\n`;
        for (const q of comparable) out += `${I3}${key(q.name)}: ${union(q.ops, I3)};\n`;
        out += `${I2}};\n`;
    } else {
        out += `${I2}whereOps: {};\n`;
    }
    out += `${I2}order: ${union(s.orders, I2, 7)};\n`;

    const assignable = (names: string[], allowed: boolean, label: string) => {
        if (!allowed || names.length === 0) return `${I2}${label}: {};\n`;
        let block = `${I2}${label}: {\n`;
        for (const name of names) {
            const attribute = attributes.get(name);
            if (attribute) block += doc(attributeDoc(attribute), I3);
            const type = attribute ? nullable(attributeType(attribute.type)) : assignableFallback(name);
            block += `${I3}${key(name)}?: ${type};\n`;
        }
        return block + `${I2}};\n`;
    };
    out += assignable(s.permissions.createAssignable, s.permissions.canCreate, 'create');
    out += assignable(s.permissions.updateAssignable, s.permissions.canUpdate, 'update');
    out += `${I2}delete: ${s.permissions.canDestroy};\n`;
    out += `${I2}actions: ${union(s.actions.map((a) => a.name), I2, 9)};\n`;
    out += `${I2}edges: ${emitEdgeSchemas(v.edges, I2)};\n`;
    out += `${I1}};\n`;
    return out;
}

/**
 * Turns one `key: { ... };` member emitted by {@link emitVertexSchema} into
 * `export interface Name { ... }`, dedented one level.
 */
function namedSchema(member: string, name: string): string {
    const lines = member.split('\n');
    const open = lines.findIndex((l) => l.startsWith(`${I1}`) && l.trimEnd().endsWith(': {'));
    const out: string[] = [];
    lines.forEach((line, i) => {
        if (i < open) return; // the vertex's own deprecation doc moves to the alias doc
        const text = line.startsWith(I1) ? line.slice(I1.length) : line;
        if (i === open) out.push(`export interface ${name} {`);
        else if (text === '};') out.push('}');
        else out.push(text);
    });
    return out.join('\n');
}

/** Friendly alias names per vertex, unique within the module. */
function aliasNames(vertices: VertexModel[], reserved: Set<string>): Map<string, string> {
    const counts = new Map<string, number>();
    for (const v of vertices) counts.set(pascal(v.spec.name), (counts.get(pascal(v.spec.name)) ?? 0) + 1);
    const used = new Set(reserved);
    const names = new Map<string, string>();
    for (const v of vertices) {
        const candidates = [pascal(v.spec.name), pascal(v.id)];
        if (counts.get(candidates[0]!)! > 1) candidates.shift();
        let chosen: string | undefined;
        for (const c of candidates) {
            if (!used.has(c) && !used.has(`${c}Attributes`) && !used.has(`${c}Schema`)) {
                chosen = c;
                break;
            }
        }
        for (let n = 2; !chosen; n++) {
            const c = `${candidates[candidates.length - 1]}${n}`;
            if (!used.has(c) && !used.has(`${c}Attributes`) && !used.has(`${c}Schema`)) chosen = c;
        }
        used.add(chosen);
        used.add(`${chosen}Attributes`);
        used.add(`${chosen}Schema`);
        names.set(v.id, chosen);
    }
    return names;
}

function emitProduct(spec: SpecProduct): { source: string; stats: ProductStats; graphName: string; ns: string } {
    const model = buildModel(spec);
    const ns = pascal(spec.product);
    const graphName = `${camel(spec.product)}Graph`;
    const schemaName = `${ns}Schema`;
    const rootName = `${ns}Root`;
    const docsBase = `${ORIGIN}/docs/apps/${spec.slug}/versions/${spec.version}/vertices`;
    const title = spec.title ?? `Planning Center ${ns}`;

    let out = '';
    out += `/**\n`;
    out += ` * ${title} API (\`${spec.basePath}\`).\n`;
    out += ` *\n`;
    out += ` * Generated from the Planning Center API documentation, version ${spec.version}, by\n`;
    out += ` * scripts/generate.ts. Do not edit: run \`npm run spec:fetch && npm run generate\`.\n`;
    out += ` *\n`;
    out += ` * @module\n`;
    out += ` */\n`;
    out += `import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';\n`;
    out += `import type { PcoResource } from '../core/jsonapi.js';\n\n`;

    out += `/** Runtime metadata for ${title}: paths and capabilities only. */\n`;
    out += emitGraph(spec, model, graphName);
    out += '\n';

    const reserved = new Set([schemaName, rootName, 'SchemaCheck', 'AssertSchema', 'AssertRoot', 'ProductGraph', 'ProductSchema', 'RootSchema', 'PcoResource']);
    const aliases = aliasNames(model.vertices, reserved);

    // Each resource's schema is a named interface so hovers and declarations read
    // `PcoResource<PersonSchema>` instead of expanding the whole schema inline.
    for (const v of model.vertices) {
        const name = aliases.get(v.id)!;
        out += doc([`Type-level schema of {@link ${name}}: attributes, query options, writable fields, and edges.`, `@see ${docsBase}/${v.id}`], '');
        out += namedSchema(emitVertexSchema(v), `${name}Schema`);
        out += '\n';
    }

    out += `/** Type-level schema of every ${title} resource, keyed by vertex id. */\n`;
    out += `export type ${schemaName} = {\n`;
    for (const v of model.vertices) out += `${I1}${key(v.id)}: ${aliases.get(v.id)!}Schema;\n`;
    out += `};\n\n`;

    out += `/** Edges available from the product root (\`${spec.basePath}\`). */\n`;
    out += `export type ${rootName} = ${emitEdgeSchemas(model.root, '')};\n\n`;

    out += `type AssertSchema<T extends ProductSchema> = T;\n`;
    out += `type AssertRoot<T extends RootSchema> = T;\n`;
    out += `type SchemaCheck = [AssertSchema<${schemaName}>, AssertRoot<${rootName}>];\n`;

    for (const v of model.vertices) {
        const name = aliases.get(v.id)!;
        const see = `@see ${docsBase}/${v.id}`;
        const deprecated = v.spec.deprecated ? '@deprecated Deprecated in the Planning Center API.' : null;
        out += '\n';
        out += doc([v.spec.description ?? `A ${v.spec.name} resource.`, see, deprecated], '');
        out += `export type ${name} = PcoResource<${name}Schema>;\n`;
        out += doc([`Attributes of {@link ${name}}.`, see, deprecated], '');
        out += `export type ${name}Attributes = ${name}Schema['attributes'];\n`;
    }
    model.stats.graphBytes = Buffer.byteLength(graphJson(spec, model));
    // Wrapped unions start on the next line; drop the space left after the colon.
    out = out.replace(/: \n/g, ':\n');
    return { source: out, stats: model.stats, graphName, ns };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const specs: SpecProduct[] = readdirSync(SPEC_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(SPEC_DIR, f), 'utf8')) as SpecProduct);
if (specs.length === 0) {
    console.error(`no spec files in ${SPEC_DIR}/ (run npm run spec:fetch)`);
    process.exit(1);
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const allStats: ProductStats[] = [];
const emitted: Array<{ slug: string; product: string; graphName: string; ns: string }> = [];
for (const spec of specs) {
    const { source, stats, graphName, ns } = emitProduct(spec);
    const file = join(OUT_DIR, `${spec.slug}.ts`);
    writeFileSync(file, source);
    stats.bytes = Buffer.byteLength(source);
    allStats.push(stats);
    emitted.push({ slug: spec.slug, product: spec.product, graphName, ns });
}

let index = `/**\n * Generated metadata and types for every Planning Center product.\n *\n`;
index += ` * Generated by scripts/generate.ts. Do not edit: run \`npm run spec:fetch && npm run generate\`.\n *\n * @module\n */\n`;
index += `import type { ProductGraph, ProductName } from '../core/graph.js';\n`;
for (const e of emitted) index += `import { ${e.graphName} } from './${e.slug}.js';\n`;
index += '\n';
for (const e of emitted) index += `export * as ${e.ns} from './${e.slug}.js';\n`;
index += `\n// Top-level schema names too, so declaration emit can name inferred builder types.\n`;
for (const e of emitted) index += `export type { ${e.ns}Root, ${e.ns}Schema } from './${e.slug}.js';\n`;
index += `\n/** Runtime graph of every product, keyed by client property name. */\n`;
index += `export const productGraphs = {\n`;
for (const e of emitted) index += `${I1}${key(e.product)}: ${e.graphName},\n`;
index += `} as const satisfies Record<ProductName, ProductGraph>;\n`;
writeFileSync(join(OUT_DIR, 'index.ts'), index);

// Report
for (const s of allStats) {
    console.log(
        `${s.slug.padEnd(14)} v${s.version}  vertices=${s.vertices} edges=${s.edges} root=${s.rootEdges} ` +
        `skipped=${s.skipped.length} ts=${s.bytes}B graph~${s.graphBytes}B`,
    );
    for (const k of s.skipped) console.log(`    skipped ${k.vertex}.${k.edge} (${k.path}): ${k.reason}`);
    for (const r of s.reserved) console.log(`    reserved name: ${r.vertex}.${r.name} (${r.kind})`);
    for (const a of s.nonConformingActions) console.log(`    action path does not follow \${itemUrl}/\${name}: ${a}`);
    for (const c of s.createFallback) console.log(`    create via canonical path: ${c}`);
    console.log(`    many from: ${JSON.stringify(s.manySources)}; to_one relationship but OpenAPI collection: ${s.toOneButCollection}`);
}
if (unmappedTypes.size) console.warn(`unmapped types (emitted as unknown): ${JSON.stringify(Object.fromEntries(unmappedTypes))}`);
console.log(`index.ts ${Buffer.byteLength(index)}B`);
