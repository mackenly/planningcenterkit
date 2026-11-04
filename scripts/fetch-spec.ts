/**
 * Downloads Planning Center's machine-readable API documentation and writes a trimmed,
 * normalized, deterministic snapshot per product to `spec/{slug}.json`.
 *
 * Usage:
 *   node scripts/fetch-spec.ts                    # every product
 *   node scripts/fetch-spec.ts --product people   # one product (slug)
 *   node scripts/fetch-spec.ts --cache <dir>      # reuse/keep raw responses in <dir> (for development)
 *
 * No authentication is needed: the documentation endpoints are public.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import type {
    SpecAction,
    SpecAttribute,
    SpecEdge,
    SpecProduct,
    SpecQuery,
    SpecRelationship,
    SpecVertex,
    WhereOperatorName,
} from './codegen/spec-types.ts';

/** Planning Center products: URL slug -> client property name. */
interface ProductInfo {
    slug: string;
    product: string;
}

const ORIGIN = 'https://api.planningcenteronline.com';

const PRODUCTS: readonly ProductInfo[] = [
    { slug: 'api', product: 'api' },
    { slug: 'calendar', product: 'calendar' },
    { slug: 'check-ins', product: 'checkIns' },
    { slug: 'current', product: 'current' },
    { slug: 'giving', product: 'giving' },
    { slug: 'groups', product: 'groups' },
    { slug: 'people', product: 'people' },
    { slug: 'publishing', product: 'publishing' },
    { slug: 'registrations', product: 'registrations' },
    { slug: 'services', product: 'services' },
    { slug: 'webhooks', product: 'webhooks' },
];

const CONCURRENCY = 4;
const MAX_ATTEMPTS = 6;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const argValue = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
};
const onlyProduct = argValue('--product');
const cacheDir = argValue('--cache');
const outDir = argValue('--out') ?? 'spec';

// ---------------------------------------------------------------------------
// HTTP: small concurrency limiter + retry with backoff
// ---------------------------------------------------------------------------

let active = 0;
const waiting: Array<() => void> = [];

async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= CONCURRENCY) {
        await new Promise<void>((resolve) => waiting.push(resolve));
    }
    active++;
    try {
        return await fn();
    } finally {
        active--;
        waiting.shift()?.();
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryDelay(res: Response | undefined, attempt: number): number {
    const header = res?.headers.get('retry-after');
    if (header) {
        const seconds = Number(header);
        if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
        const date = Date.parse(header);
        if (Number.isFinite(date)) return Math.max(0, date - Date.now());
    }
    return Math.min(30_000, 500 * 2 ** attempt) + Math.floor(Math.random() * 250);
}

let requestCount = 0;

async function getJson(url: string): Promise<any> {
    const cacheFile = cacheDir
        ? join(cacheDir, createHash('sha1').update(url).digest('hex') + '.json')
        : undefined;
    if (cacheFile && existsSync(cacheFile)) {
        return JSON.parse(readFileSync(cacheFile, 'utf8'));
    }
    const text = await withSlot(async () => {
        for (let attempt = 0; ; attempt++) {
            let res: Response | undefined;
            try {
                requestCount++;
                res = await fetch(url, { headers: { accept: 'application/json' } });
                if (res.ok) return await res.text();
                if (res.status !== 429 && res.status < 500) {
                    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
                }
            } catch (error) {
                if (res && res.status !== 429 && res.status < 500) throw error;
                if (attempt + 1 >= MAX_ATTEMPTS) throw error;
            }
            if (attempt + 1 >= MAX_ATTEMPTS) {
                throw new Error(`GET ${url} failed after ${MAX_ATTEMPTS} attempts (${res?.status})`);
            }
            const delay = retryDelay(res, attempt);
            console.warn(`  retrying ${url} in ${delay}ms (${res?.status ?? 'network error'})`);
            await sleep(delay);
        }
    });
    if (cacheFile) {
        mkdirSync(cacheDir!, { recursive: true });
        writeFileSync(cacheFile, text);
    }
    return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

const byName = <T extends { name: string }>(a: T, b: T) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
const uniqSorted = (values: Iterable<string>) => [...new Set(values)].sort();
const text = (value: unknown): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
};

/** Strips the origin: `https://api.planningcenteronline.com/people/v2/x` -> `/people/v2/x`. */
function relativePath(path: string): string {
    return path.startsWith(ORIGIN) ? path.slice(ORIGIN.length) : path;
}

/** Path with placeholder names erased, for matching docs paths against OpenAPI paths. */
const pathKey = (path: string) => path.replace(/\{[^}]*\}/g, '{}');

/** Recursively sorts object keys so the JSON output is deterministic. */
function sortKeys(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(value).sort()) {
            out[key] = sortKeys((value as Record<string, unknown>)[key]);
        }
        return out;
    }
    return value;
}

// ---------------------------------------------------------------------------
// OpenAPI analysis: response shape per path and comparison operators per where field
// ---------------------------------------------------------------------------

interface OpenApiInfo {
    /** pathKey -> 'collection' | 'resource' for GET responses. */
    responses: Map<string, 'collection' | 'resource'>;
    /** pathKeys that accept POST. */
    posts: Set<string>;
    /** pathKey -> where field -> operators. */
    whereOps: Map<string, Map<string, Set<WhereOperatorName>>>;
}

function analyzeOpenApi(doc: any, basePath: string): OpenApiInfo {
    const responses = new Map<string, 'collection' | 'resource'>();
    const whereOps = new Map<string, Map<string, Set<WhereOperatorName>>>();
    const posts = new Set<string>();
    const params = doc?.components?.parameters ?? {};
    const schemas = doc?.components?.schemas ?? {};
    const deref = (obj: any): any => {
        let current = obj;
        for (let i = 0; i < 10 && current && typeof current.$ref === 'string'; i++) {
            const [, , section, name] = current.$ref.split('/');
            current = section === 'parameters' ? params[name] : section === 'schemas' ? schemas[name] : undefined;
        }
        return current;
    };
    for (const [path, item] of Object.entries<any>(doc?.paths ?? {})) {
        const key = pathKey(basePath + path);
        if (item?.post) posts.add(key);
        const get = item?.get;
        if (!get) continue;
        const schema = deref(get.responses?.['200']?.content?.['application/json']?.schema);
        const data = deref(schema?.properties?.data);
        if (data?.type === 'array') responses.set(key, 'collection');
        else if (data && (data.type === 'object' || data.$ref || data.properties)) responses.set(key, 'resource');
        for (const raw of get.parameters ?? []) {
            const param = deref(raw);
            const match = /^where\[([^\]]+)\]\[(gt|gte|lt|lte)\]$/.exec(param?.name ?? '');
            if (!match) continue;
            let fields = whereOps.get(key);
            if (!fields) whereOps.set(key, (fields = new Map()));
            let ops = fields.get(match[1]!);
            if (!ops) fields.set(match[1]!, (ops = new Set()));
            ops.add(match[2] as WhereOperatorName);
        }
    }
    return { responses, posts, whereOps };
}

// ---------------------------------------------------------------------------
// Fetch one product
// ---------------------------------------------------------------------------

async function fetchProduct(info: ProductInfo): Promise<SpecProduct> {
    const docBase = `${ORIGIN}/${info.slug}/v2/documentation`;
    const graph = await getJson(docBase);
    const versions: any[] = graph.data.relationships.versions.data;
    const stable = versions
        .filter((v) => v.attributes?.beta !== true)
        .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
    const chosen = stable[0];
    if (!chosen) throw new Error(`${info.slug}: no non-beta version`);
    const version: string = chosen.id;
    const basePath = `/${info.slug}/v2`;
    console.log(`${info.slug}: version ${version}`);

    const versionDoc = await getJson(`${docBase}/${version}`);
    const rel = versionDoc.data.relationships;
    const entry: string = rel.entry.data.id;
    const vertexIds: string[] = rel.vertices.data.map((v: any) => v.id).sort();

    const openApiUrl: string | undefined = chosen.links?.open_api;
    const openApiPromise = openApiUrl ? getJson(openApiUrl).catch((error) => {
        console.warn(`${info.slug}: OpenAPI unavailable (${(error as Error).message})`);
        return undefined;
    }) : Promise.resolve(undefined);

    const rawVertices = await Promise.all(
        vertexIds.map((id) => getJson(`${docBase}/${version}/vertices/${encodeURIComponent(id)}`)),
    );
    const openApi = await openApiPromise;
    const oa = openApi ? analyzeOpenApi(openApi, basePath) : undefined;

    const vertices: Record<string, SpecVertex> = {};
    for (const raw of rawVertices) {
        const v = raw.data;
        const r = v.relationships;
        const attrs = v.attributes;

        const attributes: SpecAttribute[] = (r.attributes?.data ?? []).map((a: any): SpecAttribute => ({
            name: a.attributes.name,
            type: a.attributes.type_annotation?.name ?? null,
            example: a.attributes.type_annotation?.example ?? null,
            note: text(a.attributes.note),
            description: text(a.attributes.description),
            permissionLevel: text(a.attributes.permission_level),
        })).sort(byName);

        const relationships: SpecRelationship[] = (r.relationships?.data ?? []).map((x: any): SpecRelationship => ({
            name: x.attributes.name,
            association: x.attributes.association,
            graphType: text(x.attributes.graph_type),
            polymorphic: x.attributes.polymorphic ?? null,
            note: text(x.attributes.note),
        })).sort(byName);

        const p = r.permissions?.data?.attributes ?? {};
        const actions: SpecAction[] = (r.actions?.data ?? []).map((x: any): SpecAction => ({
            name: x.attributes.name,
            path: relativePath(x.attributes.path ?? ''),
            description: text(x.attributes.description),
            deprecated: x.attributes.deprecated === true,
        })).sort(byName);

        const edges: SpecEdge[] = (r.outbound_edges?.data ?? []).map((e: any): SpecEdge => {
            const path = relativePath(e.attributes.path ?? '');
            return {
                id: e.id,
                name: e.attributes.name,
                path,
                head: e.relationships.head.data.id,
                filters: uniqSorted(e.attributes.filters ?? []),
                deprecated: e.attributes.deprecated === true,
                details: text(e.attributes.details),
                response: oa?.responses.get(pathKey(path)) ?? null,
                post: oa ? oa.posts.has(pathKey(path)) : null,
            };
        }).sort((a: SpecEdge, b: SpecEdge) => byName(a, b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

        // Comparison operators: union over every documented URL that returns this vertex.
        const ops = new Map<string, Set<WhereOperatorName>>();
        const urls = new Set<string>();
        if (typeof attrs.path === 'string') urls.add(pathKey(relativePath(attrs.path)));
        for (const e of r.inbound_edges?.data ?? []) {
            if (e.relationships?.head?.data?.id === v.id) urls.add(pathKey(relativePath(e.attributes.path ?? '')));
        }
        for (const url of urls) {
            for (const [field, set] of oa?.whereOps.get(url) ?? []) {
                let target = ops.get(field);
                if (!target) ops.set(field, (target = new Set()));
                for (const op of set) target.add(op);
            }
        }

        const queries: SpecQuery[] = (r.can_query?.data ?? []).map((q: any): SpecQuery => ({
            name: q.attributes.name,
            type: q.attributes.type ?? null,
            ops: [...(ops.get(q.attributes.name) ?? [])].sort() as WhereOperatorName[],
        })).sort(byName);

        vertices[v.id] = {
            name: attrs.name,
            description: text(attrs.description),
            deprecated: attrs.deprecated === true,
            path: typeof attrs.path === 'string' ? relativePath(attrs.path) : null,
            collectionOnly: attrs.collection_only === true,
            resourceOnly: attrs.resource_only === true,
            attributes,
            relationships,
            permissions: {
                canCreate: p.can_create === true,
                canUpdate: p.can_update === true,
                canDestroy: p.can_destroy === true,
                edges: uniqSorted(p.edges ?? []),
                createAssignable: uniqSorted(p.create_assignable ?? []),
                updateAssignable: uniqSorted(p.update_assignable ?? []),
            },
            actions,
            edges,
            includes: uniqSorted((r.can_include?.data ?? []).map((x: any) => x.attributes.value ?? x.attributes.name)),
            queries,
            orders: uniqSorted((r.can_order?.data ?? []).map((x: any) => x.attributes.value ?? x.attributes.name)),
        };
    }

    return {
        slug: info.slug,
        product: info.product,
        title: text(graph.data.attributes?.title),
        version,
        basePath,
        entry,
        openApi: Boolean(oa),
        vertices,
    };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const targets = onlyProduct ? PRODUCTS.filter((p) => p.slug === onlyProduct) : PRODUCTS;
if (targets.length === 0) {
    console.error(`Unknown product "${onlyProduct}". Known: ${PRODUCTS.map((p) => p.slug).join(', ')}`);
    process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const started = Date.now();
const results = await Promise.all(targets.map((info) => fetchProduct(info)));
for (const spec of results) {
    const file = join(outDir, `${spec.slug}.json`);
    writeFileSync(file, JSON.stringify(sortKeys(spec), null, 2) + '\n');
    console.log(`wrote ${file} (${Object.keys(spec.vertices).length} vertices)`);
}
console.log(`done: ${requestCount} requests in ${((Date.now() - started) / 1000).toFixed(1)}s`);
