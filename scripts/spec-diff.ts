/**
 * Compares two snapshots of Planning Center's API documentation (`spec/*.json`) and classifies the
 * change by what it means for code compiled against the generated TypeScript API (the surface that
 * scripts/generate.ts emits into src/generated/):
 *
 * - major: something consumers may rely on was removed or changed (a resource, edge, attribute,
 *   attribute type, include, where field/operator, order field, filter, action, writable field,
 *   capability, edge cardinality, exported type name, request path, or a product's pinned API
 *   version, which changes the `X-PCO-API-Version` header sent).
 * - minor: only additions.
 * - patch: only documentation changes (descriptions, notes, deprecation flags, examples) or spec
 *   metadata that doesn't reach the generated API.
 * - none: no semantic difference.
 *
 * Usage:
 *   node scripts/spec-diff.ts                      # HEAD:spec/ vs the working tree spec/
 *   node scripts/spec-diff.ts --base-ref origin/main
 *   node scripts/spec-diff.ts --base <dir> --head <dir>
 *   node scripts/spec-diff.ts --json               # { level, changes } on stdout
 *   node scripts/spec-diff.ts --markdown           # PR-ready summary on stdout
 *   node scripts/spec-diff.ts --github-output      # appends level=<level> to $GITHUB_OUTPUT
 *
 * A human-readable summary always goes to stderr.
 *
 * The surface model below mirrors scripts/generate.ts (type tables, edge selection, `many`,
 * `canCreate`, `related`, canonical paths, exported type names). Keep them in sync when the
 * generator changes; test/scripts/spec-diff.test.ts checks the type tables against the generator.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { SpecAttribute, SpecEdge, SpecProduct, SpecVertex } from './codegen/spec-types.ts';

export type Level = 'none' | 'patch' | 'minor' | 'major';
export type ChangeLevel = Exclude<Level, 'none'>;

export interface Change {
    level: ChangeLevel;
    /** Spec file slug, e.g. `people`, `check-ins`. */
    product: string;
    /** What kind of thing changed, e.g. `attribute`, `edge`, `version`. */
    kind: string;
    /** Location inside the product, e.g. `person.attributes.first_name`, `(root).people`. */
    path: string;
    detail: string;
}

export interface DiffResult {
    level: Level;
    changes: Change[];
}

/** Specs keyed by slug (the file name without `.json`). */
export type SpecSet = Record<string, SpecProduct>;

const RANK: Record<Level, number> = { none: 0, patch: 1, minor: 2, major: 3 };
export const LEVELS: readonly ChangeLevel[] = ['major', 'minor', 'patch'];

// ---------------------------------------------------------------------------
// Mirrors of scripts/generate.ts
// ---------------------------------------------------------------------------

/** `type_annotation.name` -> TypeScript attribute type. Same table as scripts/generate.ts. */
export const ATTRIBUTE_TYPES: Record<string, string> = {
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

/** `can_query` parameter type -> accepted `where` value type. Same table as scripts/generate.ts. */
export const WHERE_TYPES: Record<string, string> = {
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

const nullable = (type: string) => (type === 'unknown' ? type : `${type} | null`);
const attributeTs = (type: string | null) => nullable((type ? ATTRIBUTE_TYPES[type] : undefined) ?? 'unknown');
function whereTs(name: string, type: string | null): string {
    if (/(^|_)id$/.test(name) && type === 'integer') return 'string | number';
    return (type ? WHERE_TYPES[type] : undefined) ?? 'unknown';
}
function assignableFallback(name: string): string {
    if (name.endsWith('_ids')) return 'string[]';
    if (name.endsWith('_id')) return 'string';
    return 'unknown';
}
function pascal(name: string): string {
    const out = name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((part) => part[0]!.toUpperCase() + part.slice(1))
        .join('');
    return /^[0-9]/.test(out) ? `_${out}` : out || '_';
}

// ---------------------------------------------------------------------------
// Surface model: what the generated code exposes for one product
// ---------------------------------------------------------------------------

export interface EdgeSurface {
    vertex: string;
    many: boolean;
    canCreate: boolean;
    filters: string[];
    deprecated: boolean;
    details: string | null;
}

export interface VertexSurface {
    spec: SpecVertex;
    alias: string;
    attributes: Map<string, SpecAttribute>;
    related: Map<string, string>;
    create: Map<string, string>;
    update: Map<string, string>;
    edges: Map<string, EdgeSurface>;
    canonicalPath: string | undefined;
}

export interface ProductSurface {
    spec: SpecProduct;
    root: Map<string, EdgeSurface>;
    vertices: Map<string, VertexSurface>;
}

function edgeSurface(spec: SpecProduct, tail: SpecVertex, edge: SpecEdge): EdgeSurface {
    const head = spec.vertices[edge.head]!;
    const relationship = tail.relationships.find((r) => r.name === edge.name);
    let many: boolean;
    if (edge.response) many = edge.response === 'collection';
    else if (relationship) many = relationship.association !== 'to_one';
    else many = true;
    const p = head.permissions;
    let canCreate = p.canCreate && p.edges.includes(edge.id);
    if (!canCreate && p.canCreate && p.edges.length === 0 && edge.path === head.path) canCreate = true;
    return { vertex: edge.head, many, canCreate, filters: edge.filters, deprecated: edge.deprecated, details: edge.details };
}

function canonicalPath(spec: SpecProduct, id: string): string | undefined {
    const v = spec.vertices[id]!;
    if (id === spec.entry || v.collectionOnly || !v.path) return undefined;
    if (v.path.includes('{') || !v.path.startsWith(`${spec.basePath}/`)) return undefined;
    return v.path;
}

function aliasNames(spec: SpecProduct, ids: string[]): Map<string, string> {
    const ns = pascal(spec.product);
    const reserved = [`${ns}Schema`, `${ns}Root`, 'SchemaCheck', 'AssertSchema', 'AssertRoot', 'ProductGraph', 'ProductSchema', 'RootSchema', 'PcoResource'];
    const counts = new Map<string, number>();
    for (const id of ids) {
        const n = pascal(spec.vertices[id]!.name);
        counts.set(n, (counts.get(n) ?? 0) + 1);
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

function assignable(v: SpecVertex, names: string[], allowed: boolean): Map<string, string> {
    const out = new Map<string, string>();
    if (!allowed) return out;
    for (const name of names) {
        const attribute = v.attributes.find((a) => a.name === name);
        out.set(name, attribute ? attributeTs(attribute.type) : assignableFallback(name));
    }
    return out;
}

/** The generated API surface of one product (exported for tests that check it against src/generated/). */
export function surface(spec: SpecProduct): ProductSurface {
    const byName = new Map<string, string>();
    for (const [id, v] of Object.entries(spec.vertices)) if (!byName.has(v.name)) byName.set(v.name, id);
    const ids = Object.keys(spec.vertices).sort();
    const aliases = aliasNames(spec, ids);
    const root = new Map<string, EdgeSurface>();
    const vertices = new Map<string, VertexSurface>();
    for (const id of ids) {
        const v = spec.vertices[id]!;
        const edges = new Map<string, EdgeSurface>();
        for (const edge of v.edges) {
            if (!spec.vertices[edge.head]) continue;
            const isRoot = id === spec.entry && edge.path === `${spec.basePath}/${edge.name}`;
            const followsRule = /\}\/[^/]+$/.test(edge.path) && edge.path.endsWith(`}/${edge.name}`);
            if (!isRoot && !followsRule) continue;
            const target = isRoot ? root : edges;
            if (target.has(edge.name)) continue;
            target.set(edge.name, edgeSurface(spec, v, edge));
        }
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
            resolve(include, v.relationships.find((r) => r.name === include)?.graphType ?? null);
        }
        vertices.set(id, {
            spec: v,
            alias: aliases.get(id)!,
            attributes: new Map(v.attributes.filter((a) => a.name !== 'id').map((a) => [a.name, a])),
            related,
            create: assignable(v, v.permissions.createAssignable, v.permissions.canCreate),
            update: assignable(v, v.permissions.updateAssignable, v.permissions.canUpdate),
            edges,
            canonicalPath: canonicalPath(spec, id),
        });
    }
    if (spec.slug === 'people' && spec.vertices.person && !root.has('me')) {
        root.set('me', { vertex: 'person', many: false, canCreate: false, filters: [], deprecated: false, details: null });
    }
    return { spec, root, vertices };
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

/** Structural equality for JSON values (object key order ignored, array order significant). */
function same(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
        const bb = b as unknown[];
        return a.length === bb.length && a.every((x, i) => same(x, bb[i]));
    }
    const ak = Object.keys(a as object).filter((k) => (a as Record<string, unknown>)[k] !== undefined);
    const bk = Object.keys(b as object).filter((k) => (b as Record<string, unknown>)[k] !== undefined);
    if (ak.length !== bk.length) return false;
    return ak.every((k) => same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

const show = (value: unknown) => (typeof value === 'string' ? `\`${value}\`` : `\`${JSON.stringify(value)}\``);

class Collector {
    changes: Change[] = [];
    product = '';
    add(level: ChangeLevel, kind: string, path: string, detail: string): void {
        this.changes.push({ level, product: this.product, kind, path, detail });
    }
    /** Removed members are major, added ones minor. */
    members(kind: string, path: string, base: Iterable<string>, head: Iterable<string>): void {
        const b = new Set(base);
        const h = new Set(head);
        const at = (x: string) => (path ? `${path}.${x}` : x);
        for (const x of b) if (!h.has(x)) this.add('major', kind, at(x), 'removed');
        for (const x of h) if (!b.has(x)) this.add('minor', kind, at(x), 'added');
    }
    /** A capability flag: true -> false is major, false -> true minor. */
    flag(kind: string, path: string, name: string, base: boolean, head: boolean): void {
        if (base === head) return;
        this.add(base ? 'major' : 'minor', kind, path, `${name} ${base} -> ${head}`);
    }
    /** Documentation text: any change is a patch. */
    docs(kind: string, path: string, name: string, base: unknown, head: unknown): void {
        if (same(base ?? null, head ?? null)) return;
        if (typeof base === 'boolean' || typeof head === 'boolean') {
            this.add('patch', kind, path, `${name} ${String(base)} -> ${String(head)}`);
        } else {
            this.add('patch', kind, path, `${name} changed`);
        }
    }
}

function compareEdges(c: Collector, kind: string, path: string, base: Map<string, EdgeSurface>, head: Map<string, EdgeSurface>): void {
    c.members(kind, path, base.keys(), head.keys());
    for (const [name, b] of base) {
        const h = head.get(name);
        if (!h) continue;
        const p = `${path}.${name}`;
        if (b.vertex !== h.vertex) c.add('major', kind, p, `target resource ${show(b.vertex)} -> ${show(h.vertex)}`);
        if (b.many !== h.many) {
            c.add('major', kind, p, `many ${b.many} -> ${h.many} (${h.many ? 'now a collection' : 'now a single resource'})`);
        }
        c.flag(kind, p, 'canCreate', b.canCreate, h.canCreate);
        c.members('filter', `${p}.filters`, b.filters, h.filters);
        c.docs('deprecation', p, 'deprecated', b.deprecated, h.deprecated);
        c.docs('docs', p, 'details', b.details, h.details);
    }
}

function compareVertex(c: Collector, id: string, b: VertexSurface, h: VertexSurface): void {
    const bs = b.spec;
    const hs = h.spec;
    if (bs.name !== hs.name) c.add('major', 'type-name', id, `resource type ${show(bs.name)} -> ${show(hs.name)}`);
    if (b.alias !== h.alias) c.add('major', 'type-name', id, `exported type ${show(b.alias)} renamed to ${show(h.alias)}`);
    if (b.canonicalPath !== h.canonicalPath) {
        const level: ChangeLevel = b.canonicalPath === undefined ? 'minor' : 'major';
        c.add(level, 'canonical-path', id, `canonical path ${show(b.canonicalPath ?? null)} -> ${show(h.canonicalPath ?? null)}`);
    }
    c.docs('deprecation', id, 'deprecated', bs.deprecated, hs.deprecated);
    c.docs('docs', id, 'description', bs.description, hs.description);

    // Attributes
    c.members('attribute', `${id}.attributes`, b.attributes.keys(), h.attributes.keys());
    for (const [name, ba] of b.attributes) {
        const ha = h.attributes.get(name);
        if (!ha) continue;
        const p = `${id}.attributes.${name}`;
        const bt = attributeTs(ba.type);
        const ht = attributeTs(ha.type);
        if (bt !== ht) c.add('major', 'attribute', p, `type ${show(bt)} -> ${show(ht)} (documented ${show(ba.type)} -> ${show(ha.type)})`);
        else if (ba.type !== ha.type) c.add('patch', 'docs', p, `documented type ${show(ba.type)} -> ${show(ha.type)} (same TypeScript type)`);
        c.docs('docs', p, 'description', ba.description, ha.description);
        c.docs('docs', p, 'note', ba.note, ha.note);
        c.docs('docs', p, 'example', ba.example, ha.example);
        c.docs('docs', p, 'permission level', ba.permissionLevel, ha.permissionLevel);
    }

    // Relationships, includes, included-resource lookups
    c.members('relationship', `${id}.relationships`, bs.relationships.map((r) => r.name), hs.relationships.map((r) => r.name));
    c.members('include', `${id}.includes`, bs.includes, hs.includes);
    for (const [name, target] of b.related) {
        const t = h.related.get(name);
        if (t === undefined) c.add('major', 'related', `${id}.related.${name}`, `no longer resolves to a resource (was ${show(target)})`);
        else if (t !== target) c.add('major', 'related', `${id}.related.${name}`, `resolves to ${show(target)} -> ${show(t)}`);
    }
    for (const [name, target] of h.related) {
        if (!b.related.has(name)) c.add('minor', 'related', `${id}.related.${name}`, `now resolves to ${show(target)}`);
    }

    // where / whereOps / order
    const bq = new Map(bs.queries.map((q) => [q.name, q]));
    const hq = new Map(hs.queries.map((q) => [q.name, q]));
    c.members('where', `${id}.where`, bq.keys(), hq.keys());
    for (const [name, q] of bq) {
        const hqv = hq.get(name);
        if (!hqv) continue;
        const p = `${id}.where.${name}`;
        const bt = whereTs(name, q.type);
        const ht = whereTs(name, hqv.type);
        if (bt !== ht) c.add('major', 'where', p, `value type ${show(bt)} -> ${show(ht)}`);
        else if (q.type !== hqv.type) c.add('patch', 'docs', p, `documented type ${show(q.type)} -> ${show(hqv.type)} (same TypeScript type)`);
        c.members('where-operator', p, q.ops, hqv.ops);
    }
    c.members('order', `${id}.order`, bs.orders, hs.orders);

    // Writes and capabilities
    const writes = (kind: string, label: string, flagName: string, bAllowed: boolean, hAllowed: boolean, bm: Map<string, string>, hm: Map<string, string>) => {
        c.flag('capability', id, flagName, bAllowed, hAllowed);
        if (!bAllowed || !hAllowed) return; // the flag change covers the whole block appearing or disappearing
        c.members(kind, `${id}.${label}`, bm.keys(), hm.keys());
        for (const [name, t] of bm) {
            const ht = hm.get(name);
            if (ht !== undefined && ht !== t) c.add('major', kind, `${id}.${label}.${name}`, `type ${show(t)} -> ${show(ht)}`);
        }
    };
    writes('create-attribute', 'create', 'canCreate', bs.permissions.canCreate, hs.permissions.canCreate, b.create, h.create);
    writes('update-attribute', 'update', 'canUpdate', bs.permissions.canUpdate, hs.permissions.canUpdate, b.update, h.update);
    c.flag('capability', id, 'canDelete', bs.permissions.canDestroy, hs.permissions.canDestroy);

    // Actions
    const bact = new Map(bs.actions.map((a) => [a.name, a]));
    const hact = new Map(hs.actions.map((a) => [a.name, a]));
    c.members('action', `${id}.actions`, bact.keys(), hact.keys());
    for (const [name, a] of bact) {
        const ha = hact.get(name);
        if (!ha) continue;
        const p = `${id}.actions.${name}`;
        c.docs('docs', p, 'documented path', a.path, ha.path);
        c.docs('docs', p, 'description', a.description, ha.description);
        c.docs('deprecation', p, 'deprecated', a.deprecated, ha.deprecated);
    }

    compareEdges(c, 'edge', `${id}.edges`, b.edges, h.edges);
}

function compareProduct(c: Collector, base: SpecProduct, head: SpecProduct): void {
    if (base.version !== head.version) {
        c.add('major', 'version', '', `API version ${show(base.version)} -> ${show(head.version)} (changes the X-PCO-API-Version header sent)`);
    }
    if (base.product !== head.product) c.add('major', 'product', '', `client property ${show(base.product)} -> ${show(head.product)}`);
    if (base.basePath !== head.basePath) c.add('major', 'product', '', `base path ${show(base.basePath)} -> ${show(head.basePath)}`);
    if (base.entry !== head.entry) c.add('major', 'product', '', `root vertex ${show(base.entry)} -> ${show(head.entry)}`);
    c.docs('docs', '', 'title', base.title, head.title);

    const b = surface(base);
    const h = surface(head);
    compareEdges(c, 'root-edge', '(root)', b.root, h.root);
    c.members('vertex', '', b.vertices.keys(), h.vertices.keys());
    for (const [id, bv] of b.vertices) {
        const hv = h.vertices.get(id);
        if (hv) compareVertex(c, id, bv, hv);
    }
    // Anything else in the snapshot that changed without touching the generated API (raw edge
    // paths, OpenAPI hints, relationship metadata, ...) is still worth a patch release, since the
    // committed snapshot and generated output change.
    const touched = (prefix: string) => c.changes.some((ch) => ch.product === c.product && (ch.path === prefix || ch.path.startsWith(`${prefix}.`)));
    // Root edges are the entry vertex's edges, reported under `(root)`.
    for (const [id, bv] of Object.entries(base.vertices)) {
        const hv = head.vertices[id];
        const reported = touched(id) || (id === base.entry && touched('(root)'));
        if (hv && !same(bv, hv) && !reported) c.add('patch', 'other', id, 'spec metadata changed without affecting the generated API');
    }
    const top = (p: SpecProduct) => ({ ...p, vertices: undefined });
    if (!same(top(base), top(head)) && !c.changes.some((ch) => ch.product === c.product && ch.path === '')) {
        c.add('patch', 'other', '', 'product metadata changed without affecting the generated API');
    }
}

/** Classifies the change from `base` to `head` for consumers of the generated API. */
export function diffSpecs(base: SpecSet, head: SpecSet): DiffResult {
    const c = new Collector();
    const slugs = [...new Set([...Object.keys(base), ...Object.keys(head)])].sort();
    for (const slug of slugs) {
        c.product = slug;
        const b = base[slug];
        const h = head[slug];
        if (b && !h) c.add('major', 'product', '', 'product removed');
        else if (!b && h) c.add('minor', 'product', '', `product added (API version ${show(h.version)})`);
        else if (b && h && !same(b, h)) compareProduct(c, b, h);
    }
    const changes = c.changes.sort((x, y) => RANK[y.level] - RANK[x.level] || cmp(x.product, y.product) || cmp(x.path, y.path) || cmp(x.detail, y.detail));
    const level = changes.reduce<Level>((max, ch) => (RANK[ch.level] > RANK[max] ? ch.level : max), 'none');
    return { level, changes };
}

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const TITLES: Record<ChangeLevel, string> = {
    major: 'Major (breaking)',
    minor: 'Minor (additions)',
    patch: 'Patch (documentation and metadata)',
};

function line(ch: Change): string {
    return ch.path ? `\`${ch.path}\` (${ch.kind}): ${ch.detail}` : `${ch.kind}: ${ch.detail}`;
}

function grouped(changes: Change[]): Map<ChangeLevel, Map<string, Change[]>> {
    const out = new Map<ChangeLevel, Map<string, Change[]>>();
    for (const ch of changes) {
        let byProduct = out.get(ch.level);
        if (!byProduct) out.set(ch.level, (byProduct = new Map()));
        let list = byProduct.get(ch.product);
        if (!list) byProduct.set(ch.product, (list = []));
        list.push(ch);
    }
    return out;
}

function counts(changes: Change[]): Record<ChangeLevel, number> {
    const n: Record<ChangeLevel, number> = { major: 0, minor: 0, patch: 0 };
    for (const ch of changes) n[ch.level]++;
    return n;
}

export interface MarkdownOptions {
    /** Most changes listed per level and product before collapsing to a count (default 25). */
    limit?: number;
    /** Hard cap on the output length; `limit` shrinks until it fits (default 60000, under GitHub's 65536). */
    maxLength?: number;
}

/** A PR-ready Markdown summary grouped by level and product. */
export function renderMarkdown(result: DiffResult, options: MarkdownOptions = {}): string {
    const maxLength = options.maxLength ?? 60000;
    for (let limit = options.limit ?? 25; ; limit = Math.floor(limit / 2)) {
        const text = markdown(result, limit);
        if (text.length <= maxLength || limit === 0) return text.length <= maxLength ? text : `${text.slice(0, maxLength - 20)}\n\n…(truncated)\n`;
    }
}

function markdown(result: DiffResult, limit: number): string {
    const n = counts(result.changes);
    let out = `## Planning Center API changes: ${result.level}\n\n`;
    if (result.level === 'none') return out + 'No changes to the API documentation snapshot.\n';
    out += '| Level | Changes |\n| --- | ---: |\n';
    for (const level of LEVELS) out += `| ${level} | ${n[level]} |\n`;
    const groups = grouped(result.changes);
    for (const level of LEVELS) {
        const byProduct = groups.get(level);
        if (!byProduct) continue;
        out += `\n### ${TITLES[level]}\n`;
        for (const [product, list] of byProduct) {
            out += `\n#### ${product} (${list.length})\n\n`;
            for (const ch of list.slice(0, limit)) out += `- ${line(ch)}\n`;
            if (list.length > limit) out += `- …and ${list.length - limit} more\n`;
        }
    }
    return out;
}

/** A plain-text summary for the terminal. */
export function renderSummary(result: DiffResult, limit = 20): string {
    const n = counts(result.changes);
    if (result.level === 'none') return 'spec-diff: none (no changes)\n';
    let out = `spec-diff: ${result.level} (${n.major} major, ${n.minor} minor, ${n.patch} patch)\n`;
    const groups = grouped(result.changes);
    for (const level of LEVELS) {
        const byProduct = groups.get(level);
        if (!byProduct) continue;
        out += `\n${TITLES[level]}:\n`;
        for (const [product, list] of byProduct) {
            out += `  ${product} (${list.length})\n`;
            for (const ch of list.slice(0, limit)) out += `    ${line(ch).replace(/`/g, '')}\n`;
            if (list.length > limit) out += `    ...and ${list.length - limit} more\n`;
        }
    }
    return out;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function readDir(dir: string): SpecSet {
    const out: SpecSet = {};
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
        out[basename(file, '.json')] = JSON.parse(readFileSync(join(dir, file), 'utf8')) as SpecProduct;
    }
    return out;
}

function readGit(ref: string, dir: string): SpecSet {
    const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
    const out: SpecSet = {};
    const listing = git(['ls-tree', '--name-only', ref, '--', `${dir.replace(/\/+$/, '')}/`]);
    for (const path of listing.split('\n').filter((p) => p.endsWith('.json')).sort()) {
        out[basename(path, '.json')] = JSON.parse(git(['show', `${ref}:./${dir.replace(/\/+$/, '')}/${basename(path)}`])) as SpecProduct;
    }
    return out;
}

const USAGE = `Usage: node scripts/spec-diff.ts [--base <dir> | --base-ref <rev>] [--head <dir>] [--json | --markdown] [--github-output]

  --base <dir>      Base snapshot directory (default: spec/ at --base-ref)
  --base-ref <rev>  Git revision for the base snapshot (default: HEAD)
  --head <dir>      Head snapshot directory (default: spec)
  --json            Print { level, changes } as JSON on stdout
  --markdown        Print a Markdown summary on stdout
  --github-output   Append level=<level> to $GITHUB_OUTPUT
`;

function main(argv: string[]): number {
    let baseDir: string | undefined;
    let baseRef = 'HEAD';
    let headDir = 'spec';
    let format: 'json' | 'markdown' | undefined;
    let githubOutput = false;
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i]!;
        const value = () => {
            const v = argv[++i];
            if (v === undefined) throw new Error(`${arg} needs a value`);
            return v;
        };
        if (arg === '--base') baseDir = value();
        else if (arg === '--base-ref') baseRef = value();
        else if (arg === '--head') headDir = value();
        else if (arg === '--json' || arg === '--markdown') {
            if (format) throw new Error('--json and --markdown are mutually exclusive');
            format = arg === '--json' ? 'json' : 'markdown';
        } else if (arg === '--github-output') githubOutput = true;
        else if (arg === '--help' || arg === '-h') {
            process.stdout.write(USAGE);
            return 0;
        } else throw new Error(`unknown argument ${arg}\n\n${USAGE}`);
    }

    const base = baseDir ? readDir(baseDir) : readGit(baseRef, 'spec');
    const head = readDir(headDir);
    if (Object.keys(head).length === 0) throw new Error(`no spec files in ${headDir}/`);
    if (Object.keys(base).length === 0) {
        process.stderr.write(`spec-diff: note: the base (${baseDir ?? `${baseRef}:spec/`}) has no spec files; every product counts as added\n`);
    }

    const result = diffSpecs(base, head);
    process.stderr.write(renderSummary(result));
    if (format === 'json') process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (format === 'markdown') process.stdout.write(renderMarkdown(result));
    if (githubOutput) {
        const file = process.env.GITHUB_OUTPUT;
        if (!file) throw new Error('--github-output: $GITHUB_OUTPUT is not set');
        appendFileSync(file, `level=${result.level}\n`);
    }
    return 0;
}

function isEntry(): boolean {
    const script = process.argv[1];
    if (!script) return false;
    try {
        return import.meta.url === pathToFileURL(realpathSync(script)).href;
    } catch {
        return false;
    }
}

if (isEntry()) {
    try {
        process.exitCode = main(process.argv.slice(2));
    } catch (error) {
        process.stderr.write(`spec-diff: ${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
    }
}
