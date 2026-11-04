/**
 * JSON:API document and resource types as returned by Planning Center.
 * @see https://api.planningcenteronline.com/docs/overview/json-api
 */
import type { VertexSchema } from './graph.js';

/** `{ type, id }` pointer to a resource. */
export interface ResourceIdentifier<T extends string = string> {
    type: T;
    id: string;
}

/** A relationship entry on a resource. */
export interface Relationship {
    data?: ResourceIdentifier | ResourceIdentifier[] | null;
    links?: Record<string, string | null>;
    meta?: Record<string, unknown>;
}

/**
 * A single resource as returned by the API, typed from its generated schema.
 * Attribute names are exactly as in Planning Center's docs (snake_case).
 */
export interface PcoResource<S extends VertexSchema = VertexSchema> {
    type: S['type'];
    id: string;
    attributes: S['attributes'];
    relationships?: { [K in S['relationships']]?: Relationship };
    links?: Record<string, string | null>;
    meta?: Record<string, unknown>;
}

/** An untyped resource, used for `included` entries and raw requests. */
export interface AnyResource {
    type: string;
    id: string;
    attributes?: Record<string, unknown>;
    relationships?: Record<string, Relationship>;
    links?: Record<string, string | null>;
    meta?: Record<string, unknown>;
}

/** `meta` on collection responses. */
export interface PcoListMeta {
    total_count?: number;
    count?: number;
    next?: { offset: number };
    prev?: { offset: number };
    can_include?: string[];
    can_order_by?: string[];
    can_query_by?: string[];
    can_filter?: string[];
    parent?: ResourceIdentifier;
    [key: string]: unknown;
}

/** A raw JSON:API document. */
export interface JsonApiDocument<D = AnyResource | AnyResource[] | null> {
    data: D;
    included?: AnyResource[];
    meta?: PcoListMeta;
    links?: Record<string, string | null>;
    errors?: import('./errors.js').PcoErrorObject[];
}
