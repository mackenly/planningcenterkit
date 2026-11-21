/**
 * The contract between generated code (`src/generated/*`) and the runtime.
 *
 * Each product is generated into two parts:
 * - a runtime {@link ProductGraph} object (small: paths and capabilities only), and
 * - type-level schemas ({@link VertexSchema} per resource, plus a root edge map) that give the
 *   query builder its autocomplete and type checking. These cost nothing at runtime.
 *
 * Terminology follows Planning Center's documentation: a *vertex* is a resource type
 * (e.g. `person`), an *edge* is a URL you can follow from a vertex (e.g. `emails`).
 */

/** Product property names on the client. */
export type ProductName =
    | 'api'
    | 'calendar'
    | 'checkIns'
    | 'current'
    | 'giving'
    | 'groups'
    | 'people'
    | 'publishing'
    | 'registrations'
    | 'services'
    | 'webhooks';

// ---------------------------------------------------------------------------
// Runtime metadata (generated as `as const satisfies ProductGraph`)
// ---------------------------------------------------------------------------

/** An edge followed from a vertex (or from the product root). */
export interface EdgeMeta {
    /** Vertex id of the resource the edge leads to, e.g. `email`. */
    readonly vertex: string;
    /** `true` if the edge returns a collection, `false` for a single resource. */
    readonly many: boolean;
    /** `true` if `POST` to this edge's URL creates a resource. */
    readonly canCreate: boolean;
}

/** A resource type. */
export interface VertexMeta {
    /** JSON:API `type`, e.g. `Person`. */
    readonly type: string;
    /**
     * Edges that can be followed from a single resource of this type, keyed by edge name.
     * URL rule: `${itemUrl}/${edgeName}`, e.g. `/people/v2/people/1` + `emails`.
     */
    readonly edges: Readonly<Record<string, EdgeMeta>>;
    /** Action names: `POST ${itemUrl}/${action}`. */
    readonly actions: readonly string[];
    /** `true` if `PATCH ${itemUrl}` is supported. */
    readonly canUpdate: boolean;
    /** `true` if `DELETE ${itemUrl}` is supported. */
    readonly canDelete: boolean;
    /**
     * The resource's own top-level collection URL, e.g. `/people/v2/lists`, when it has one.
     * Items of this type are always addressed as `${canonicalPath}/${id}`, however they were
     * reached, so deep chains only ever produce URLs Planning Center documents.
     */
    readonly canonicalPath?: string;
}

/** Everything the runtime needs to know about one product. */
export interface ProductGraph {
    readonly product: ProductName;
    /** URL slug, e.g. `check-ins`. */
    readonly slug: string;
    /** Path prefix for every request, e.g. `/check-ins/v2`. */
    readonly basePath: string;
    /** API version the types were generated from; sent as `X-PCO-API-Version`. */
    readonly version: string;
    /** Vertex id of the product root (`GET ${basePath}`), usually `organization`. */
    readonly rootVertex: string;
    /** Edges available from the product root, e.g. `people` -> `/people/v2/people`. */
    readonly root: Readonly<Record<string, EdgeMeta>>;
    /** Every vertex in the product, keyed by vertex id. */
    readonly vertices: Readonly<Record<string, VertexMeta>>;
}

// ---------------------------------------------------------------------------
// Type-level schemas (generated as `type` aliases, never interfaces)
// ---------------------------------------------------------------------------

/** Comparison operators accepted by `where` on dates, times, and numbers. */
export type WhereOperator = 'gt' | 'gte' | 'lt' | 'lte';

/** Type-level description of an edge. */
export interface EdgeSchema {
    /** Vertex id the edge leads to (a key of the product schema). */
    vertex: string;
    many: boolean;
    /** Union of `?filter=` values this edge accepts (`never` if none). */
    filters: string;
    /** Whether `POST` to this edge creates a resource. */
    create: boolean;
}

/** Type-level description of a resource type. */
export interface VertexSchema {
    /** JSON:API `type`, e.g. `'Person'`. */
    type: string;
    /** Attribute name -> value type. Values the API may omit or null are `T | null`. */
    attributes: object;
    /** Union of relationship names (`never` if none). */
    relationships: string;
    /** Union of `?include=` values (`never` if none). */
    includes: string;
    /**
     * Relationship/include name -> vertex id of the related resource, for every name whose
     * target is known (e.g. `{ emails: 'email'; primary_campus: 'campus' }`). Used to type
     * resources pulled out of `included`.
     */
    related: Record<string, string>;
    /** `where[field]` name -> accepted value type. */
    where: object;
    /** Field name -> operators it supports beyond equality (only comparable fields). */
    whereOps: object;
    /** Union of `?order=` fields, without the `-` prefix (`never` if none). */
    order: string;
    /** Attributes accepted on create (all optional; `{}` if not creatable). */
    create: object;
    /** Attributes accepted on update (all optional; `{}` if not updatable). */
    update: object;
    /** Whether `DELETE ${itemUrl}` is supported (mirrors {@link VertexMeta.canDelete}). */
    delete: boolean;
    /** Union of action names (`never` if none). */
    actions: string;
    /** Edge name -> edge schema for edges followed from a single resource. */
    edges: Record<string, EdgeSchema>;
}

/** Vertex id -> schema, for one product. */
export type ProductSchema = Record<string, VertexSchema>;

/** Root edge name -> edge schema, for one product. */
export type RootSchema = Record<string, EdgeSchema>;
