/**
 * Planning Center Current API (`/current/v2`).
 *
 * Generated from the Planning Center API documentation, version 2018-08-01, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Current: paths and capabilities only. */
export const currentGraph = {
    product: 'current',
    slug: 'current',
    basePath: '/current/v2',
    version: '2018-08-01',
    rootVertex: 'organization',
    root: {
        people: { vertex: 'person', many: true, canCreate: false },
    },
    vertices: {
        organization: {
            type: 'Organization',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        person: {
            type: 'Person',
            edges: {
                organization: { vertex: 'organization', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/current/v2/people',
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/current/versions/2018-08-01/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        name: string | null;
        subdomain: string | null;
        time_zone: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Person}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/current/versions/2018-08-01/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        email: string | null;
        first_name: string | null;
        last_name: string | null;
    };
    relationships: never;
    includes: 'organization';
    related: {
        organization: 'organization';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        organization: { vertex: 'organization'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Planning Center Current resource, keyed by vertex id. */
export type CurrentSchema = {
    organization: OrganizationSchema;
    person: PersonSchema;
};

/** Edges available from the product root (`/current/v2`). */
export type CurrentRoot = {
    people: { vertex: 'person'; many: true; filters: never; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<CurrentSchema>, AssertRoot<CurrentRoot>];

/**
 * A Organization resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/current/versions/2018-08-01/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/current/versions/2018-08-01/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * A Person resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/current/versions/2018-08-01/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/current/versions/2018-08-01/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];
