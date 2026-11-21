/**
 * The fluent, immutable query builder used for every resource in every product.
 *
 * A product client (see `createProductClient` in `product.ts`) exposes one builder per edge:
 * - a {@link Collection} for edges that return many resources (`pco.people.people`),
 * - an {@link ItemRef} for one resource by id (`pco.people.people.id('1')`),
 * - a {@link SingleRef} for edges that return one resource (`pco.groups.groups.id('5').enrollment`).
 *
 * Every builder method returns a new builder, so a base query can be shared and branched safely.
 * Names (edges, attributes, includes, where/order fields) are snake_case exactly as in
 * Planning Center's docs.
 *
 * @see https://developer.planning.center/docs/#/overview/
 */
import { PcoError } from './errors.js';
import type { EdgeMeta, EdgeSchema, ProductGraph, ProductSchema, VertexMeta, VertexSchema, WhereOperator } from './graph.js';
import type { AnyResource, JsonApiDocument, PcoListMeta, PcoResource, Relationship, ResourceIdentifier } from './jsonapi.js';
import type { PcoTransport, QueryValue } from './transport.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** A resource id: a non-empty string or a finite number. */
export type ResourceId = string | number;

/** Options accepted by every request. */
export interface RequestOptions {
    /** Cancels the request. */
    signal?: AbortSignal;
}

/**
 * Options for fetching a single resource.
 *
 * @example
 * ```ts
 * await pco.people.people.id('123').get({ include: ['emails'] });
 * ```
 */
export interface GetOptions<V extends VertexSchema = VertexSchema> extends RequestOptions {
    /** Related resources to side-load into `included`. */
    include?: readonly V['includes'][];
}

/**
 * Options for creating or updating a resource.
 *
 * @example
 * ```ts
 * await pco.people.people.id('1').emails.create(
 *     { address: 'ada@example.com', location: 'Home' },
 *     { include: ['person'] },
 * );
 * ```
 */
export interface WriteOptions<V extends VertexSchema = VertexSchema> extends GetOptions<V> {
    /** JSON:API relationships to send with the resource, keyed by relationship name. */
    relationships?: Record<string, { data: ResourceIdentifier | ResourceIdentifier[] | null }>;
}

/**
 * Options for {@link Collection.all} and {@link Collection.toArray}.
 *
 * @example
 * ```ts
 * const first500 = await pco.people.people.toArray({ max: 500 });
 * ```
 */
export interface IterateOptions extends RequestOptions {
    /** Stop after this many resources. */
    max?: number;
}

/**
 * Options for {@link Collection.pages}.
 *
 * @example
 * ```ts
 * for await (const page of pco.people.people.pages({ maxPages: 3 })) console.log(page.data.length);
 * ```
 */
export interface PagesOptions extends RequestOptions {
    /** Stop after this many pages. */
    maxPages?: number;
}

/** An `order` value: a field name, or the field name prefixed with `-` for descending. */
export type OrderValue<F extends string> = F | `-${F}`;

/** Anything with relationships that {@link ListResult.related} can resolve. */
export interface RelatedSource {
    type: string;
    id: string;
    relationships?: object;
}

/**
 * The resource type returned by `related(resource, name)`: typed from the vertex's `related`
 * map when the name is known, otherwise {@link AnyResource}.
 */
export type RelatedResource<S extends ProductSchema, K extends keyof S, N extends string> =
    N extends keyof S[K]['related']
        ? S[K]['related'][N] extends keyof S
            ? PcoResource<S[S[K]['related'][N]]>
            : AnyResource
        : AnyResource;

/** Relationship names offered by `related()` autocomplete; any string is accepted. */
export type RelatedName<V extends VertexSchema> = (keyof V['related'] & string) | V['relationships'] | (string & {});

/** Shared shape of {@link ListResult} and {@link ItemResult}. */
export interface ResultBase<S extends ProductSchema, K extends keyof S> {
    /** Side-loaded resources requested with `include`. */
    included: AnyResource[];
    /** Response `meta`. */
    meta: PcoListMeta;
    /** Response `links`. */
    links: Record<string, string | null>;
    /**
     * Looks up the resources a relationship points to in this response's `included` (and
     * primary `data`). Always returns an array: empty when the relationship is missing or
     * wasn't included, one element for a to-one relationship.
     *
     * @example
     * ```ts
     * const { data, related } = await pco.people.people.include('emails').list();
     * for (const person of data) {
     *     const emails = related(person, 'emails'); // PcoResource<email schema>[]
     *     console.log(person.attributes.name, emails.map((e) => e.attributes.address));
     * }
     * ```
     */
    related<N extends RelatedName<S[K]>>(resource: RelatedSource, name: N): RelatedResource<S, K, N>[];
}

/**
 * One page of a collection.
 *
 * @example
 * ```ts
 * const page = await pco.people.people.perPage(25).list();
 * page.data;        // PcoResource<person schema>[]
 * page.totalCount;  // total matching people
 * page.nextOffset;  // offset of the next page, if any
 * ```
 */
export interface ListResult<S extends ProductSchema, K extends keyof S> extends ResultBase<S, K> {
    /** The resources on this page. */
    data: PcoResource<S[K]>[];
    /** `meta.total_count`, when the API returned it. */
    totalCount?: number;
    /** `meta.next.offset`, when there is another page. */
    nextOffset?: number;
}

/**
 * A single resource response.
 *
 * @example
 * ```ts
 * const { data } = await pco.people.people.id('123').get();
 * data.attributes.first_name;
 * ```
 */
export interface ItemResult<S extends ProductSchema, K extends keyof S, D = PcoResource<S[K]>> extends ResultBase<S, K> {
    /** The resource. */
    data: D;
}

/**
 * A collection endpoint, e.g. `pco.people.people` or `pco.people.people.id('1').emails`.
 *
 * Immutable: every builder method returns a new collection, so you can branch from a shared base.
 * Type parameters: `S` is the product schema, `K` the vertex id of the resources, `F` the union of
 * accepted `filter` values.
 *
 * @example
 * ```ts
 * const recent = pco.people.people.where('created_at', 'gte', '2026-01-01').order('-created_at');
 * const page = await recent.perPage(50).list();
 * for await (const person of recent.all()) console.log(person.attributes.name);
 * ```
 */
export interface Collection<S extends ProductSchema, K extends keyof S & string, F extends string = never> {
    /** The collection's URL path, e.g. `/people/v2/people/1/emails`. For debugging. */
    readonly path: string;

    /**
     * Adds an equality condition: `where[field]=value`.
     *
     * @example
     * ```ts
     * pco.people.people.where('first_name', 'Tim%').where('status', 'active');
     * ```
     */
    where<P extends keyof S[K]['where'] & string>(field: P, value: S[K]['where'][P]): this;
    /**
     * Adds a comparison: `where[field][op]=value`. Only fields that support comparison accept an
     * operator. Combine two calls for a range.
     *
     * @example
     * ```ts
     * pco.people.people.where('created_at', 'gte', '2026-01-01').where('created_at', 'lt', '2026-02-01');
     * ```
     */
    where<P extends keyof S[K]['whereOps'] & keyof S[K]['where'] & string>(
        field: P,
        op: S[K]['whereOps'][P],
        value: S[K]['where'][P],
    ): this;

    /**
     * Applies named filters: `filter=a,b`. Repeated calls add to the list.
     *
     * @example
     * ```ts
     * pco.services.service_types.id('1').plans.filter('future');
     * ```
     */
    filter(...names: F[]): this;

    /**
     * Side-loads related resources: `include=a,b`. Repeated calls add to the list. Read them with
     * `related()` on the result.
     *
     * @example
     * ```ts
     * pco.people.people.include('emails', 'phone_numbers');
     * ```
     */
    include(...names: S[K]['includes'][]): this;

    /**
     * Sorts results: `order=a,-b`. Prefix a field with `-` for descending. Replaces any previous order.
     *
     * @example
     * ```ts
     * pco.people.people.order('-created_at');
     * pco.people.people.order('last_name', 'first_name');
     * ```
     */
    order(...fields: OrderValue<S[K]['order']>[]): this;

    /**
     * Page size, 1 to 100 (`per_page`). `all()` defaults to 100 when unset.
     *
     * @example
     * ```ts
     * pco.people.people.perPage(50);
     * ```
     */
    perPage(n: number): this;

    /**
     * Skips this many resources (`offset`).
     *
     * @example
     * ```ts
     * pco.people.people.perPage(25).offset(50).list(); // third page
     * ```
     */
    offset(n: number): this;

    /**
     * Sets a raw query parameter, for anything not covered by the typed methods.
     *
     * @example
     * ```ts
     * pco.people.people.param('where[search_name_or_email]', 'ada');
     * ```
     */
    param(key: string, value: QueryValue): this;

    /**
     * Fetches one page.
     *
     * @example
     * ```ts
     * const { data, included, meta } = await pco.people.people.list();
     * ```
     */
    list(options?: RequestOptions): Promise<ListResult<S, K>>;

    /**
     * Iterates every matching resource, following pagination (`per_page` defaults to 100).
     *
     * @example
     * ```ts
     * for await (const person of pco.people.people.where('status', 'active').all()) {
     *     console.log(person.attributes.name);
     * }
     * ```
     */
    all(options?: IterateOptions): AsyncIterable<PcoResource<S[K]>>;

    /**
     * Iterates page by page, following pagination (`per_page` defaults to 100). Useful when you
     * need each page's `included`.
     *
     * @example
     * ```ts
     * for await (const page of pco.people.people.include('emails').pages()) {
     *     for (const person of page.data) page.related(person, 'emails');
     * }
     * ```
     */
    pages(options?: PagesOptions): AsyncIterable<ListResult<S, K>>;

    /**
     * Collects every matching resource (or the first `max`) into an array.
     *
     * @example
     * ```ts
     * const people = await pco.people.people.where('status', 'active').toArray({ max: 1000 });
     * ```
     */
    toArray(options?: IterateOptions): Promise<PcoResource<S[K]>[]>;

    /**
     * Fetches the first matching resource (`per_page=1`), or `undefined` if there is none.
     *
     * @example
     * ```ts
     * const newest = await pco.people.people.order('-created_at').first();
     * ```
     */
    first(options?: RequestOptions): Promise<PcoResource<S[K]> | undefined>;

    /**
     * Returns `meta.total_count` for the query (fetches `per_page=1`).
     *
     * @example
     * ```ts
     * const active = await pco.people.people.where('status', 'active').count();
     * ```
     */
    count(options?: RequestOptions): Promise<number>;

    /**
     * Fetches one resource by id. Uses this builder's `include` unless `options.include` is given.
     *
     * @example
     * ```ts
     * const { data } = await pco.people.people.get('123', { include: ['emails'] });
     * ```
     */
    get(id: ResourceId, options?: GetOptions<S[K]>): Promise<ItemResult<S, K>>;

    /**
     * A reference to one resource by id, for updating, deleting, running actions, or following edges.
     *
     * @example
     * ```ts
     * const emails = await pco.people.people.id('123').emails.list();
     * ```
     */
    id(id: ResourceId): ItemRef<S, K>;
}

/**
 * A {@link Collection} whose edge accepts `POST` to create resources.
 *
 * @example
 * ```ts
 * const { data } = await pco.people.people.create({ first_name: 'Ada', last_name: 'Lovelace' });
 * ```
 */
export interface CreatableCollection<S extends ProductSchema, K extends keyof S & string, F extends string = never>
    extends Collection<S, K, F> {
    /**
     * Creates a resource: `POST` to this collection with `{ data: { type, attributes, relationships } }`.
     *
     * @example
     * ```ts
     * await pco.people.people.id('123').emails.create({ address: 'ada@example.com', location: 'Home' });
     * ```
     */
    create(attributes: S[K]['create'], options?: WriteOptions<S[K]>): Promise<ItemResult<S, K>>;
}

/**
 * Methods available on every {@link ItemRef}.
 *
 * @example
 * ```ts
 * const ref = pco.people.people.id('123');
 * await ref.get();
 * await pco.people.people.id('1').workflow_cards.id('2').action('promote');
 * ```
 */
export interface ItemRefBase<S extends ProductSchema, K extends keyof S & string> {
    /** The resource's URL path, e.g. `/people/v2/people/123`. For debugging. */
    readonly path: string;

    /**
     * Fetches the resource.
     *
     * @example
     * ```ts
     * const { data, related } = await pco.people.people.id('123').get({ include: ['emails'] });
     * ```
     */
    get(options?: GetOptions<S[K]>): Promise<ItemResult<S, K>>;

    /**
     * Runs an action: `POST ${path}/${name}` with `body` sent as-is. Returns the parsed response
     * body (`undefined` for 204).
     *
     * @example
     * ```ts
     * await pco.services.service_types.id('1').plans.id('2').action('item_reorder', {
     *     data: { attributes: { sequence: ['5', '3', '4'] } },
     * });
     * ```
     */
    action<T = JsonApiDocument | undefined>(name: S[K]['actions'], body?: unknown, options?: RequestOptions): Promise<T>;

    /**
     * Follows an edge by name. Same as the edge property, and the only way to reach an edge whose
     * name collides with a method (`get`, `update`, `delete`, `action`, `edge`, `path`, `then`).
     *
     * @example
     * ```ts
     * pco.people.people.id('123').edge('emails').list();
     * ```
     */
    edge<N extends keyof S[K]['edges'] & string>(name: N): EdgeBuilder<S, S[K]['edges'][N]>;
}

/**
 * Present on an {@link ItemRef} when the resource type accepts updates.
 *
 * @example
 * ```ts
 * await pco.people.people.id('123').update({ nickname: 'Ada' });
 * ```
 */
export interface Updatable<S extends ProductSchema, K extends keyof S & string> {
    /**
     * Updates the resource: `PATCH` with `{ data: { type, id, attributes, relationships } }`.
     *
     * @example
     * ```ts
     * const { data } = await pco.people.people.id('123').update({ nickname: 'Ada' });
     * ```
     */
    update(attributes: S[K]['update'], options?: WriteOptions<S[K]>): Promise<ItemResult<S, K>>;
}

/**
 * Present on an {@link ItemRef} when the resource type can be deleted.
 *
 * @example
 * ```ts
 * await pco.people.people.id('123').delete();
 * ```
 */
export interface Deletable {
    /**
     * Deletes the resource (`DELETE`). The runtime also refuses (with a {@link PcoError}, before
     * sending anything) if the API doesn't support deleting this resource type.
     */
    delete(options?: RequestOptions): Promise<void>;
}

/** Names that are methods on {@link ItemRef}; edges with these names are reachable via `edge()` only. */
export type ItemReservedName = 'get' | 'update' | 'delete' | 'action' | 'edge' | 'path' | 'then';

/** One property per edge of vertex `K`, excluding {@link ItemReservedName}s. */
export type ItemEdges<S extends ProductSchema, K extends keyof S & string> = {
    readonly [N in Exclude<keyof S[K]['edges'] & string, ItemReservedName>]: EdgeBuilder<S, S[K]['edges'][N]>;
};

/**
 * One resource by id: `get`, `update` and `delete` (when supported), `action`, and a property for
 * every edge you can follow from it.
 *
 * @example
 * ```ts
 * const person = pco.people.people.id('123');
 * await person.update({ nickname: 'Ada' });
 * const emails = await person.emails.list();
 * const enrollment = await pco.groups.groups.id('5').enrollment.get();
 * const plan = await pco.services.service_types.id('1').plans.id('2').get({ include: ['plan_times'] });
 * ```
 */
export type ItemRef<S extends ProductSchema, K extends keyof S & string> = ItemRefBase<S, K> &
    ItemEdges<S, K> &
    ([keyof S[K]['update']] extends [never] ? unknown : Updatable<S, K>) &
    (S[K]['delete'] extends true ? Deletable : unknown);

/**
 * An edge that returns a single resource, e.g. `pco.groups.groups.id('5').enrollment`.
 *
 * @example
 * ```ts
 * const { data: enrollment } = await pco.groups.groups.id('5').enrollment.get();
 * enrollment?.attributes.status;
 * ```
 */
export interface SingleRef<S extends ProductSchema, K extends keyof S & string> {
    /** The edge's URL path, e.g. `/groups/v2/groups/5/enrollment`. For debugging. */
    readonly path: string;

    /**
     * Fetches the resource. `data` is `null` when the to-one relationship is empty.
     *
     * @example
     * ```ts
     * const { data } = await pco.groups.groups.id('5').enrollment.get();
     * ```
     */
    get(options?: GetOptions<S[K]>): Promise<ItemResult<S, K, PcoResource<S[K]> | null>>;
}

/**
 * A {@link SingleRef} whose resource can be created by `POST`ing to the edge, e.g. starring a list.
 *
 * @example
 * ```ts
 * await pco.people.lists.id('1').star.create({});
 * ```
 */
export interface CreatableSingleRef<S extends ProductSchema, K extends keyof S & string> extends SingleRef<S, K> {
    /** Creates the resource: `POST` to this edge with `{ data: { type, attributes, relationships } }`. */
    create(attributes: S[K]['create'], options?: WriteOptions<S[K]>): Promise<ItemResult<S, K>>;
}

/**
 * The builder for an edge: {@link CreatableCollection} or {@link Collection} for `many` edges,
 * {@link SingleRef} otherwise.
 *
 * @example
 * ```ts
 * type Emails = EdgeBuilder<PeopleSchema, PeopleSchema['person']['edges']['emails']>;
 * ```
 */
export type EdgeBuilder<S extends ProductSchema, E extends EdgeSchema> = E['vertex'] extends keyof S & string
    ? E['many'] extends true
        ? E['create'] extends true
            ? CreatableCollection<S, E['vertex'], E['filters']>
            : Collection<S, E['vertex'], E['filters']>
        : E['create'] extends true
          ? CreatableSingleRef<S, E['vertex']>
          : SingleRef<S, E['vertex']>
    : never;

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

/**
 * Shared state for every builder of one product client.
 * @internal
 */
export interface QueryContext {
    readonly graph: ProductGraph;
    readonly transport: PcoTransport;
    /** Sent as `version` on every request. */
    readonly version: string;
}

const WHERE_OPERATORS: ReadonlySet<string> = new Set<WhereOperator>(['gt', 'gte', 'lt', 'lte']);

interface CollectionState {
    readonly where: Readonly<Record<string, QueryValue>>;
    readonly params: Readonly<Record<string, QueryValue>>;
    readonly include: readonly string[];
    readonly filter: readonly string[];
    readonly order: readonly string[];
    readonly perPage?: number;
    readonly offset?: number;
}

const EMPTY_STATE: CollectionState = { where: {}, params: {}, include: [], filter: [], order: [] };

function vertexMeta(ctx: QueryContext, vertex: string): VertexMeta {
    const meta = ctx.graph.vertices[vertex];
    if (!meta) throw new PcoError(`Unknown ${ctx.graph.product} resource type "${vertex}".`);
    return meta;
}

/**
 * Validates an id. Rejects dot segments (`.`, `..`, and encoded forms): URL parsing resolves them,
 * so `emails.id('..').delete()` would otherwise delete the parent resource.
 */
function assertId(id: unknown): string {
    if (typeof id === 'number' && Number.isFinite(id)) return String(id);
    if (typeof id === 'string' && /^(?:\.|%2e){1,2}$/i.test(id.trim())) {
        throw new PcoError(`Invalid resource id ${JSON.stringify(id)}: "." and ".." would change which URL is requested.`);
    }
    if (typeof id === 'string' && id.trim() !== '') return id;
    throw new PcoError(`Invalid resource id ${JSON.stringify(id) ?? String(id)}: expected a non-empty string or a number.`);
}

/** URL of one item: under the vertex's canonical collection when it has one, else under `collectionPath`. */
function itemPath(ctx: QueryContext, vertex: string, collectionPath: string, id: string): string {
    const canonical = ctx.graph.vertices[vertex]?.canonicalPath;
    return `${canonical ?? collectionPath}/${encodeURIComponent(id)}`;
}

function assertNames(kind: string, names: readonly unknown[]): string[] {
    for (const name of names) {
        if (typeof name !== 'string' || name === '') throw new PcoError(`Invalid ${kind} name ${JSON.stringify(name)}.`);
    }
    return names as string[];
}

function merge(existing: readonly string[], added: readonly string[]): string[] {
    return [...new Set([...existing, ...added])];
}

function asDocument(body: unknown): JsonApiDocument {
    if (body && typeof body === 'object') return body as JsonApiDocument;
    return { data: null };
}

function resourceKey(type: string, id: string): string {
    return `${type}\u0000${id}`;
}

function makeRelated(doc: JsonApiDocument): (resource: RelatedSource, name: string) => AnyResource[] {
    let index: Map<string, AnyResource> | undefined;
    return (resource, name) => {
        const rels = resource?.relationships as Record<string, Relationship | undefined> | undefined;
        const linkage = rels?.[name]?.data;
        if (!linkage) return [];
        if (!index) {
            index = new Map();
            const primary = Array.isArray(doc.data) ? doc.data : doc.data ? [doc.data] : [];
            for (const r of [...primary, ...(doc.included ?? [])]) index.set(resourceKey(r.type, r.id), r);
        }
        const ids = Array.isArray(linkage) ? linkage : [linkage];
        const found: AnyResource[] = [];
        for (const ref of ids) {
            const hit = index.get(resourceKey(ref.type, ref.id));
            if (hit) found.push(hit);
        }
        return found;
    };
}

function toListResult(body: unknown): ListResult<ProductSchema, string> {
    const doc = asDocument(body);
    const meta = doc.meta ?? {};
    return {
        // Some edges are documented as collections but return a single resource; accept both.
        data: (Array.isArray(doc.data) ? doc.data : doc.data ? [doc.data] : []) as PcoResource[],
        included: doc.included ?? [],
        meta,
        links: doc.links ?? {},
        totalCount: typeof meta.total_count === 'number' ? meta.total_count : undefined,
        nextOffset: typeof meta.next?.offset === 'number' ? meta.next.offset : undefined,
        related: makeRelated(doc) as ListResult<ProductSchema, string>['related'],
    };
}

function toItemResult(body: unknown): ItemResult<ProductSchema, string, PcoResource | null> {
    const doc = asDocument(body);
    return {
        data: (Array.isArray(doc.data) ? (doc.data[0] ?? null) : (doc.data ?? null)) as PcoResource | null,
        included: doc.included ?? [],
        meta: doc.meta ?? {},
        links: doc.links ?? {},
        related: makeRelated(doc) as ItemResult<ProductSchema, string>['related'],
    };
}

function includeQuery(include: readonly unknown[] | undefined): Record<string, QueryValue> {
    return include && include.length ? { include: assertNames('include', include) } : {};
}

async function getItem(ctx: QueryContext, path: string, include: readonly unknown[] | undefined, signal?: AbortSignal) {
    const body = await ctx.transport.request({
        method: 'GET',
        path,
        query: includeQuery(include),
        version: ctx.version,
        signal,
    });
    return toItemResult(body);
}

function writeBody(type: string, id: string | undefined, attributes: unknown, options: WriteOptions | undefined) {
    const data: Record<string, unknown> = { type };
    if (id !== undefined) data.id = id;
    data.attributes = attributes ?? {};
    if (options?.relationships) data.relationships = options.relationships;
    return { data };
}

/** @internal Runtime implementation of {@link Collection} and {@link CreatableCollection}. */
class CollectionImpl {
    readonly path: string;
    readonly #ctx: QueryContext;
    readonly #edgeName: string;
    readonly #edge: EdgeMeta;
    readonly #state: CollectionState;

    constructor(ctx: QueryContext, edgeName: string, edge: EdgeMeta, path: string, state: CollectionState = EMPTY_STATE) {
        this.#ctx = ctx;
        this.#edgeName = edgeName;
        this.#edge = edge;
        this.path = path;
        this.#state = state;
    }

    #with(patch: Partial<CollectionState>): CollectionImpl {
        return new CollectionImpl(this.#ctx, this.#edgeName, this.#edge, this.path, { ...this.#state, ...patch });
    }

    where(field: string, opOrValue: unknown, value?: unknown): CollectionImpl {
        assertNames('where field', [field]);
        const given = arguments.length >= 3 ? value : opOrValue;
        if (given === undefined || given === null) {
            // Silently dropping the condition would widen the query (e.g. to every person).
            throw new PcoError(`where("${field}") was given ${String(given)}; pass a value or leave the condition out.`);
        }
        if (arguments.length >= 3) {
            const op = opOrValue;
            if (typeof op !== 'string' || !WHERE_OPERATORS.has(op)) {
                throw new PcoError(`Invalid where operator ${JSON.stringify(op)} for "${field}": expected gt, gte, lt, or lte.`);
            }
            return this.#with({ where: { ...this.#state.where, [`where[${field}][${op}]`]: value as QueryValue } });
        }
        return this.#with({ where: { ...this.#state.where, [`where[${field}]`]: opOrValue as QueryValue } });
    }

    filter(...names: string[]): CollectionImpl {
        return this.#with({ filter: merge(this.#state.filter, assertNames('filter', names)) });
    }

    include(...names: string[]): CollectionImpl {
        return this.#with({ include: merge(this.#state.include, assertNames('include', names)) });
    }

    order(...fields: string[]): CollectionImpl {
        return this.#with({ order: assertNames('order', fields) });
    }

    perPage(n: number): CollectionImpl {
        if (!Number.isInteger(n) || n < 1 || n > 100) {
            throw new PcoError(`perPage must be an integer from 1 to 100 (got ${String(n)}).`);
        }
        return this.#with({ perPage: n });
    }

    offset(n: number): CollectionImpl {
        if (!Number.isInteger(n) || n < 0) throw new PcoError(`offset must be a non-negative integer (got ${String(n)}).`);
        return this.#with({ offset: n });
    }

    param(key: string, value: QueryValue): CollectionImpl {
        if (typeof key !== 'string' || key === '') throw new PcoError('param key must be a non-empty string.');
        return this.#with({ params: { ...this.#state.params, [key]: value } });
    }

    #query(overrides: { perPage?: number; offset?: number } = {}): Record<string, QueryValue> {
        const s = this.#state;
        const query: Record<string, QueryValue> = { ...s.where };
        if (s.filter.length) query.filter = s.filter;
        if (s.include.length) query.include = s.include;
        if (s.order.length) query.order = s.order;
        const perPage = overrides.perPage ?? s.perPage;
        if (perPage !== undefined) query.per_page = perPage;
        const offset = overrides.offset ?? s.offset;
        if (offset !== undefined) query.offset = offset;
        return Object.assign(query, s.params);
    }

    async #fetch(query: Record<string, QueryValue> | undefined, path: string, signal?: AbortSignal) {
        const body = await this.#ctx.transport.request({ method: 'GET', path, query, version: this.#ctx.version, signal });
        return toListResult(body);
    }

    list(options?: RequestOptions): Promise<ListResult<ProductSchema, string>> {
        return this.#fetch(this.#query(), this.path, options?.signal);
    }

    async *pages(options?: PagesOptions): AsyncGenerator<ListResult<ProductSchema, string>, void, undefined> {
        const maxPages = options?.maxPages ?? Infinity;
        if (maxPages <= 0) return;
        const perPage = this.#state.perPage ?? 100;
        let page = await this.#fetch(this.#query({ perPage }), this.path, options?.signal);
        let count = 0;
        const seen = new Set<string>();
        for (;;) {
            yield page;
            if (++count >= maxPages || page.data.length === 0) return;
            let next: Promise<ListResult<ProductSchema, string>> | undefined;
            if (page.nextOffset !== undefined) {
                const key = `offset:${page.nextOffset}`;
                if (seen.has(key)) return;
                seen.add(key);
                next = this.#fetch(this.#query({ perPage, offset: page.nextOffset }), this.path, options?.signal);
            } else if (typeof page.links.next === 'string' && page.links.next) {
                const key = `link:${page.links.next}`;
                if (seen.has(key)) return;
                seen.add(key);
                next = this.#fetch(undefined, page.links.next, options?.signal);
            }
            if (!next) return;
            page = await next;
        }
    }

    async *all(options?: IterateOptions): AsyncGenerator<PcoResource, void, undefined> {
        const max = options?.max ?? Infinity;
        if (max <= 0) return;
        let yielded = 0;
        for await (const page of this.pages({ signal: options?.signal })) {
            for (const resource of page.data) {
                yield resource;
                if (++yielded >= max) return;
            }
        }
    }

    async toArray(options?: IterateOptions): Promise<PcoResource[]> {
        const out: PcoResource[] = [];
        for await (const resource of this.all(options)) out.push(resource);
        return out;
    }

    async first(options?: RequestOptions): Promise<PcoResource | undefined> {
        const page = await this.#fetch(this.#query({ perPage: 1 }), this.path, options?.signal);
        return page.data[0];
    }

    async count(options?: RequestOptions): Promise<number> {
        const page = await this.#fetch(this.#query({ perPage: 1 }), this.path, options?.signal);
        if (page.totalCount !== undefined) return page.totalCount;
        // No total from the API: count by paging rather than guess from `meta.count` (the page size).
        let total = 0;
        for await (const _ of this.all(options)) total++;
        return total;
    }

    async get(id: ResourceId, options?: GetOptions): Promise<ItemResult<ProductSchema, string, PcoResource | null>> {
        const url = itemPath(this.#ctx, this.#edge.vertex, this.path, assertId(id));
        return getItem(this.#ctx, url, options?.include ?? this.#state.include, options?.signal);
    }

    id(id: ResourceId): ItemRefImpl {
        const value = assertId(id);
        return createItemRef(this.#ctx, this.#edge.vertex, itemPath(this.#ctx, this.#edge.vertex, this.path, value), value);
    }

    async create(attributes: unknown, options?: WriteOptions): Promise<ItemResult<ProductSchema, string, PcoResource | null>> {
        if (!this.#edge.canCreate) {
            throw new PcoError(`Planning Center does not support creating resources at ${this.path} ("${this.#edgeName}").`);
        }
        const meta = vertexMeta(this.#ctx, this.#edge.vertex);
        const body = await this.#ctx.transport.request({
            method: 'POST',
            path: this.path,
            query: includeQuery(options?.include),
            body: writeBody(meta.type, undefined, attributes, options),
            version: this.#ctx.version,
            signal: options?.signal,
        });
        return toItemResult(body);
    }
}

/** @internal Runtime implementation of {@link SingleRef}. */
class SingleRefImpl {
    readonly path: string;
    readonly #ctx: QueryContext;
    readonly #edge: EdgeMeta;
    readonly #edgeName: string;

    constructor(ctx: QueryContext, name: string, edge: EdgeMeta, path: string) {
        this.#ctx = ctx;
        this.#edge = edge;
        this.#edgeName = name;
        this.path = path;
    }

    get(options?: GetOptions): Promise<ItemResult<ProductSchema, string, PcoResource | null>> {
        return getItem(this.#ctx, this.path, options?.include, options?.signal);
    }

    async create(attributes: unknown, options?: WriteOptions): Promise<ItemResult<ProductSchema, string, PcoResource | null>> {
        if (!this.#edge.canCreate) {
            throw new PcoError(`Planning Center does not support creating resources at ${this.path} ("${this.#edgeName}").`);
        }
        const meta = vertexMeta(this.#ctx, this.#edge.vertex);
        const body = await this.#ctx.transport.request({
            method: 'POST',
            path: this.path,
            query: includeQuery(options?.include),
            body: writeBody(meta.type, undefined, attributes, options),
            version: this.#ctx.version,
            signal: options?.signal,
        });
        return toItemResult(body);
    }
}

/** @internal Runtime implementation of {@link ItemRef}. Edge getters live on per-vertex subclasses. */
class ItemRefImpl {
    readonly path: string;
    readonly #ctx: QueryContext;
    readonly #vertex: string;
    readonly #id: string;

    constructor(ctx: QueryContext, vertex: string, path: string, id: string) {
        this.#ctx = ctx;
        this.#vertex = vertex;
        this.path = path;
        this.#id = id;
    }

    get(options?: GetOptions): Promise<ItemResult<ProductSchema, string, PcoResource | null>> {
        return getItem(this.#ctx, this.path, options?.include, options?.signal);
    }

    async update(attributes: unknown, options?: WriteOptions): Promise<ItemResult<ProductSchema, string, PcoResource | null>> {
        const meta = vertexMeta(this.#ctx, this.#vertex);
        if (!meta.canUpdate) throw new PcoError(`Planning Center does not support updating ${meta.type} resources (${this.path}).`);
        const body = await this.#ctx.transport.request({
            method: 'PATCH',
            path: this.path,
            query: includeQuery(options?.include),
            body: writeBody(meta.type, this.#id, attributes, options),
            version: this.#ctx.version,
            signal: options?.signal,
        });
        return toItemResult(body);
    }

    async delete(options?: RequestOptions): Promise<void> {
        const meta = vertexMeta(this.#ctx, this.#vertex);
        if (!meta.canDelete) throw new PcoError(`Planning Center does not support deleting ${meta.type} resources (${this.path}).`);
        await this.#ctx.transport.request({ method: 'DELETE', path: this.path, version: this.#ctx.version, signal: options?.signal });
    }

    action(name: string, body?: unknown, options?: RequestOptions): Promise<unknown> {
        const meta = vertexMeta(this.#ctx, this.#vertex);
        if (typeof name !== 'string' || !meta.actions.includes(name)) {
            return Promise.reject(new PcoError(
                `Unknown action ${JSON.stringify(name)} for ${meta.type}. Known actions: ${meta.actions.join(', ') || 'none'}. ` +
                    'Use pco.request() for undocumented endpoints.',
            ));
        }
        return this.#ctx.transport.request({
            method: 'POST',
            path: `${this.path}/${name}`,
            body,
            version: this.#ctx.version,
            signal: options?.signal,
        });
    }

    edge(name: string): object {
        const meta = vertexMeta(this.#ctx, this.#vertex);
        const edge = Object.hasOwn(meta.edges, name) ? meta.edges[name] : undefined;
        if (!edge) throw new PcoError(`${meta.type} has no edge "${name}".`);
        return createEdgeBuilder(this.#ctx, name, edge, `${this.path}/${name}`);
    }
}

/**
 * Builds the builder for an edge at `path`.
 * @internal
 */
export function createEdgeBuilder(ctx: QueryContext, name: string, edge: EdgeMeta, path: string): object {
    return edge.many ? new CollectionImpl(ctx, name, edge, path) : new SingleRefImpl(ctx, name, edge, path);
}

/**
 * Defines a lazy getter on `proto` for each edge, skipping names that are already members of the
 * prototype chain (methods such as `get`) and `reserved` names. Always reserve `then`: defining it
 * would make the object thenable.
 * @internal
 */
export function defineEdgeGetters<T extends object>(
    proto: T,
    names: Iterable<string>,
    reserved: ReadonlySet<string>,
    follow: (self: T, name: string) => unknown,
): void {
    for (const name of names) {
        if (reserved.has(name) || name in proto) continue;
        Object.defineProperty(proto, name, {
            configurable: true,
            enumerable: false,
            get(this: T) {
                return follow(this, name);
            },
        });
    }
}

const ITEM_RESERVED: ReadonlySet<string> = new Set<ItemReservedName>(['get', 'update', 'delete', 'action', 'edge', 'path', 'then']);

const itemClasses = new WeakMap<VertexMeta, typeof ItemRefImpl>();

function createItemRef(ctx: QueryContext, vertex: string, path: string, id: string): ItemRefImpl {
    const meta = vertexMeta(ctx, vertex);
    let cls = itemClasses.get(meta);
    if (!cls) {
        cls = class extends ItemRefImpl {};
        Object.defineProperty(cls, 'name', { value: `ItemRef(${meta.type})` });
        defineEdgeGetters<ItemRefImpl>(cls.prototype, Object.keys(meta.edges), ITEM_RESERVED, (self, name) => self.edge(name));
        itemClasses.set(meta, cls);
    }
    return new cls(ctx, vertex, path, id);
}
