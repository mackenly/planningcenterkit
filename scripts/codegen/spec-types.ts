/** Shape of the trimmed snapshots in `spec/{slug}.json` (written by fetch-spec, read by generate). */

export type WhereOperatorName = 'gt' | 'gte' | 'lt' | 'lte';

export interface SpecAttribute {
    name: string;
    /** `type_annotation.name` from the docs, e.g. `string`, `date_time`, `array`. */
    type: string | null;
    /** `type_annotation.example` from the docs. */
    example: unknown;
    note: string | null;
    description: string | null;
    permissionLevel: string | null;
}

export interface SpecRelationship {
    name: string;
    association: string;
    graphType: string | null;
    polymorphic: unknown;
    note: string | null;
}

export interface SpecAction {
    name: string;
    /** Path without origin, e.g. `/people/v2/lists/{list_id}/run`. */
    path: string;
    description: string | null;
    deprecated: boolean;
}

export interface SpecEdge {
    id: string;
    name: string;
    /** Path without origin, e.g. `/people/v2/people/{person_id}/emails`. */
    path: string;
    /** Vertex id the edge leads to. */
    head: string;
    filters: string[];
    deprecated: boolean;
    details: string | null;
    /** Shape of the GET response according to the OpenAPI document (`null` if not found there). */
    response: 'collection' | 'resource' | null;
    /** Whether the OpenAPI document lists `POST` for this path (`null` without OpenAPI). */
    post: boolean | null;
}

export interface SpecQuery {
    name: string;
    type: string | null;
    /** Comparison operators found in the OpenAPI document for `where[name][op]`. */
    ops: WhereOperatorName[];
}

export interface SpecVertex {
    name: string;
    description: string | null;
    deprecated: boolean;
    path: string | null;
    collectionOnly: boolean;
    resourceOnly: boolean;
    attributes: SpecAttribute[];
    relationships: SpecRelationship[];
    permissions: {
        canCreate: boolean;
        canUpdate: boolean;
        canDestroy: boolean;
        edges: string[];
        createAssignable: string[];
        updateAssignable: string[];
    };
    actions: SpecAction[];
    edges: SpecEdge[];
    includes: string[];
    queries: SpecQuery[];
    orders: string[];
}

export interface SpecProduct {
    slug: string;
    product: string;
    title: string | null;
    version: string;
    basePath: string;
    entry: string;
    openApi: boolean;
    vertices: Record<string, SpecVertex>;
}
