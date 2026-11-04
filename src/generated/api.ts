/**
 * Planning Center API API (`/api/v2`).
 *
 * Generated from the Planning Center API documentation, version 2026-09-24, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center API: paths and capabilities only. */
export const apiGraph = {
    product: 'api',
    slug: 'api',
    basePath: '/api/v2',
    version: '2026-09-24',
    rootVertex: 'organization',
    root: {
        connected_applications: { vertex: 'connected_application', many: true, canCreate: false },
        oauth_applications: { vertex: 'oauth_application', many: true, canCreate: false },
        personal_access_tokens: { vertex: 'personal_access_token', many: true, canCreate: false },
    },
    vertices: {
        connected_application: {
            type: 'ConnectedApplication',
            edges: {
                people: { vertex: 'connected_application_person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/api/v2/connected_applications',
        },
        connected_application_person: {
            type: 'ConnectedApplicationPerson',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        oauth_application: {
            type: 'OauthApplication',
            edges: {
                mau: { vertex: 'oauth_application_mau', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/api/v2/oauth_applications',
        },
        oauth_application_mau: {
            type: 'OauthApplicationMau',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        organization: {
            type: 'Organization',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        person: {
            type: 'Person',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        personal_access_token: {
            type: 'PersonalAccessToken',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: ['revoke'],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/api/v2/personal_access_tokens',
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link ConnectedApplication}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/connected_application
 */
export interface ConnectedApplicationSchema {
    type: 'ConnectedApplication';
    attributes: {
        description: string | null;
        name: string | null;
        url: string | null;
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
    edges: {
        people: { vertex: 'connected_application_person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ConnectedApplicationPerson}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/connected_application_person
 */
export interface ConnectedApplicationPersonSchema {
    type: 'ConnectedApplicationPerson';
    attributes: {
        avatar_url: string | null;
        connected_at: string | null;
        first_name: string | null;
        last_name: string | null;
        scopes: unknown[] | null;
        site_administrator: boolean | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        site_administrator: boolean;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link OauthApplication}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/oauth_application
 */
export interface OauthApplicationSchema {
    type: 'OauthApplication';
    attributes: {
        description: string | null;
        name: string | null;
        url: string | null;
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
    edges: {
        mau: { vertex: 'oauth_application_mau'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link OauthApplicationMau}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/oauth_application_mau
 */
export interface OauthApplicationMauSchema {
    type: 'OauthApplicationMau';
    attributes: {
        /** The total number of unique active users for the application. */
        count: number | null;
        /**
         * The month the stat was recorded for.
         *
         * Starting at 1 for January.
         */
        month: number | null;
        /** The year the stat was recorded for. */
        year: number | null;
    };
    relationships: 'oauth_application';
    includes: never;
    related: {
        oauth_application: 'oauth_application';
    };
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
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {};
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
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        avatar_url: string | null;
        first_name: string | null;
        last_name: string | null;
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
 * Type-level schema of {@link PersonalAccessToken}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/personal_access_token
 */
export interface PersonalAccessTokenSchema {
    type: 'PersonalAccessToken';
    attributes: {
        created_at: string | null;
        /**
         * The day this token was last used to make an api request, or `null` if it never has.
         */
        last_used_on: string | null;
        name: string | null;
        /** When the token was revoked, or `null` while it is still usable. */
        revoked_at: string | null;
    };
    relationships: 'person';
    includes: 'person';
    related: {
        person: 'person';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'last_used_on' | 'name' | 'person' | 'revoked_at';
    create: {};
    update: {};
    delete: false;
    actions: 'revoke';
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Planning Center API resource, keyed by vertex id. */
export type ApiSchema = {
    connected_application: ConnectedApplicationSchema;
    connected_application_person: ConnectedApplicationPersonSchema;
    oauth_application: OauthApplicationSchema;
    oauth_application_mau: OauthApplicationMauSchema;
    organization: OrganizationSchema;
    person: PersonSchema;
    personal_access_token: PersonalAccessTokenSchema;
};

/** Edges available from the product root (`/api/v2`). */
export type ApiRoot = {
    connected_applications: { vertex: 'connected_application'; many: true; filters: never; create: false };
    oauth_applications: { vertex: 'oauth_application'; many: true; filters: never; create: false };
    personal_access_tokens: { vertex: 'personal_access_token'; many: true; filters: 'accessible'; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<ApiSchema>, AssertRoot<ApiRoot>];

/**
 * A ConnectedApplication resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/connected_application
 */
export type ConnectedApplication = PcoResource<ConnectedApplicationSchema>;
/**
 * Attributes of {@link ConnectedApplication}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/connected_application
 */
export type ConnectedApplicationAttributes = ConnectedApplicationSchema['attributes'];

/**
 * A ConnectedApplicationPerson resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/connected_application_person
 */
export type ConnectedApplicationPerson = PcoResource<ConnectedApplicationPersonSchema>;
/**
 * Attributes of {@link ConnectedApplicationPerson}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/connected_application_person
 */
export type ConnectedApplicationPersonAttributes = ConnectedApplicationPersonSchema['attributes'];

/**
 * A OauthApplication resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/oauth_application
 */
export type OauthApplication = PcoResource<OauthApplicationSchema>;
/**
 * Attributes of {@link OauthApplication}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/oauth_application
 */
export type OauthApplicationAttributes = OauthApplicationSchema['attributes'];

/**
 * Monthly Active Users for an Oauth Application.
 *
 * A "Monthly Active User" is any person who has been issued an Oauth token during that month.
 *
 * Historical data will be kept for 24 months.
 *
 * _Note:_ There is no historical data before mid-February 2019.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/oauth_application_mau
 */
export type OauthApplicationMau = PcoResource<OauthApplicationMauSchema>;
/**
 * Attributes of {@link OauthApplicationMau}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/oauth_application_mau
 */
export type OauthApplicationMauAttributes = OauthApplicationMauSchema['attributes'];

/**
 * A Organization resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * A Person resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A PersonalAccessToken resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/personal_access_token
 */
export type PersonalAccessToken = PcoResource<PersonalAccessTokenSchema>;
/**
 * Attributes of {@link PersonalAccessToken}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/api/versions/2026-09-24/vertices/personal_access_token
 */
export type PersonalAccessTokenAttributes = PersonalAccessTokenSchema['attributes'];
