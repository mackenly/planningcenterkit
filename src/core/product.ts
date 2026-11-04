/**
 * Builds a typed product client (`pco.people`, `pco.services`, ...) from a generated
 * {@link ProductGraph} and its type-level schemas.
 */
import { PcoError } from './errors.js';
import type { ProductGraph, ProductSchema, RootSchema } from './graph.js';
import type { AnyResource, PcoResource } from './jsonapi.js';
import { createEdgeBuilder, defineEdgeGetters } from './query.js';
import type { EdgeBuilder, GetOptions, ItemResult, QueryContext } from './query.js';
import type { PcoTransport } from './transport.js';

/** Options for {@link createProductClient}. */
export interface ProductClientOptions {
    /**
     * API version sent as `X-PCO-API-Version` on every request. Defaults to the version the
     * product's types were generated from (`graph.version`).
     */
    version?: string;
}

/** Names that are methods on a product client; root edges with these names are reachable via `edge()` only. */
export type ProductReservedName = 'get' | 'edge' | 'then';

/** The resource type of the product root: `S[RV]` when the schema has it, otherwise untyped. */
export type ProductRootResource<S extends ProductSchema, RV extends string> = RV extends keyof S
    ? PcoResource<S[RV]>
    : AnyResource;

/**
 * Methods available on every product client.
 *
 * @example
 * ```ts
 * const { data: org } = await pco.people.get();
 * const people = pco.people.edge('people');
 * ```
 */
export interface ProductClientBase<S extends ProductSchema, R extends RootSchema, RV extends string = 'organization'> {
    /**
     * Fetches the product root (`GET /{product}/v2`), usually the Organization.
     *
     * @example
     * ```ts
     * const { data: org } = await pco.people.get();
     * org.attributes.name;
     * ```
     */
    get(
        options?: GetOptions<RV extends keyof S ? S[RV] : S[keyof S]>,
    ): Promise<ItemResult<S, RV extends keyof S ? RV : keyof S, ProductRootResource<S, RV>>>;

    /**
     * Follows a root edge by name. Same as the edge property, and the only way to reach a root
     * edge whose name collides with a method (`get`, `edge`, `then`).
     *
     * @example
     * ```ts
     * const page = await pco.services.edge('service_types').list();
     * ```
     */
    edge<N extends keyof R & string>(name: N): EdgeBuilder<S, R[N]>;
}

/**
 * A product client: one property per root edge plus {@link ProductClientBase} methods.
 *
 * Type parameters: `S` is the generated product schema (vertex id -> schema), `R` the generated
 * root edge map, `RV` the vertex id of the product root (defaults to `organization`).
 *
 * @example
 * ```ts
 * const { data } = await pco.people.people.where('first_name', 'Tim%').include('emails').list();
 * const plans = await pco.services.service_types.id('1').plans.filter('future').list();
 * ```
 */
export type ProductClient<S extends ProductSchema, R extends RootSchema, RV extends string = 'organization'> =
    ProductClientBase<S, R, RV> & {
        readonly [N in Exclude<keyof R & string, ProductReservedName>]: EdgeBuilder<S, R[N]>;
    };

const PRODUCT_RESERVED: ReadonlySet<string> = new Set<ProductReservedName>(['get', 'edge', 'then']);

/** @internal Runtime implementation of {@link ProductClientBase}. Root edge getters live on per-graph subclasses. */
class ProductClientImpl {
    readonly #ctx: QueryContext;

    constructor(ctx: QueryContext) {
        this.#ctx = ctx;
    }

    get(options?: GetOptions): Promise<unknown> {
        const { graph } = this.#ctx;
        const root = createEdgeBuilder(this.#ctx, '', { vertex: graph.rootVertex, many: false, canCreate: false }, graph.basePath);
        return (root as { get(options?: GetOptions): Promise<unknown> }).get(options);
    }

    edge(name: string): unknown {
        const { graph } = this.#ctx;
        const edge = Object.hasOwn(graph.root, name) ? graph.root[name] : undefined;
        if (!edge) throw new PcoError(`${graph.product} has no root edge "${name}".`);
        return createEdgeBuilder(this.#ctx, name, edge, `${graph.basePath}/${name}`);
    }
}

const productClasses = new WeakMap<ProductGraph, typeof ProductClientImpl>();

/**
 * Creates the fluent client for one product from its generated graph.
 *
 * Every request is sent with `version: options.version ?? graph.version`.
 *
 * @example
 * ```ts
 * import { peopleGraph, type PeopleSchema, type PeopleRoot } from './generated/people.js';
 *
 * const people = createProductClient<PeopleSchema, PeopleRoot>(peopleGraph, transport);
 * const { data } = await people.people.where('status', 'active').list();
 * await people.people.id('123').update({ nickname: 'Ada' });
 * ```
 */
export function createProductClient<S extends ProductSchema, R extends RootSchema, RV extends string = 'organization'>(
    graph: ProductGraph,
    transport: PcoTransport,
    options?: ProductClientOptions,
): ProductClient<S, R, RV> {
    let cls = productClasses.get(graph);
    if (!cls) {
        cls = class extends ProductClientImpl {};
        Object.defineProperty(cls, 'name', { value: `ProductClient(${graph.product})` });
        defineEdgeGetters<ProductClientImpl>(cls.prototype, Object.keys(graph.root), PRODUCT_RESERVED, (self, name) =>
            self.edge(name),
        );
        productClasses.set(graph, cls);
    }
    const ctx: QueryContext = { graph, transport, version: options?.version ?? graph.version };
    return new cls(ctx) as unknown as ProductClient<S, R, RV>;
}
