/**
 * Webhooks API (`/webhooks/v2`).
 *
 * Generated from the Planning Center API documentation, version 2022-10-20, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Webhooks: paths and capabilities only. */
export const webhooksGraph = {
    product: 'webhooks',
    slug: 'webhooks',
    basePath: '/webhooks/v2',
    version: '2022-10-20',
    rootVertex: 'organization',
    root: {
        available_events: { vertex: 'available_event', many: true, canCreate: false },
        webhook_subscriptions: { vertex: 'webhook_subscription', many: true, canCreate: true },
    },
    vertices: {
        available_event: {
            type: 'AvailableEvent',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        delivery: {
            type: 'Delivery',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event: {
            type: 'Event',
            edges: {
                deliveries: { vertex: 'delivery', many: true, canCreate: false },
            },
            actions: ['ignore', 'redeliver'],
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
        webhook_subscription: {
            type: 'WebhookSubscription',
            edges: {
                events: { vertex: 'event', many: true, canCreate: false },
            },
            actions: ['rotate_secret'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/webhooks/v2/webhook_subscriptions',
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link AvailableEvent}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/available_event
 */
export interface AvailableEventSchema {
    type: 'AvailableEvent';
    attributes: {
        action: string | null;
        app: string | null;
        name: string | null;
        resource: string | null;
        type: string | null;
        version: string | null;
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
 * Type-level schema of {@link Delivery}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/delivery
 */
export interface DeliverySchema {
    type: 'Delivery';
    attributes: {
        created_at: string | null;
        object_url: string | null;
        request_body: string | null;
        request_headers: string | null;
        response_body: string | null;
        response_headers: string | null;
        status: number | null;
        timing: number | null;
        updated_at: string | null;
    };
    relationships: 'event';
    includes: never;
    related: {
        event: 'event';
    };
    where: {};
    whereOps: {};
    order: 'created_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Event}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/event
 */
export interface EventSchema {
    type: 'Event';
    attributes: {
        created_at: string | null;
        /** A string encoded JSON object. E.G. `"{\"data\":{...}}"` */
        payload: string | null;
        /**
         * Possible values: `pending`, `delivered`, `failed`, `skipped`, `duplicated`, `ignored_failed`, `ignored_skipped`, or `ignored_duplicated`
         */
        status: string | null;
        updated_at: string | null;
        uuid: string | null;
    };
    relationships: 'person' | 'subscription';
    includes: never;
    related: {};
    where: {
        status: string;
        uuid: string;
    };
    whereOps: {};
    order: 'created_at';
    create: {};
    update: {};
    delete: false;
    actions: 'ignore' | 'redeliver';
    edges: {
        deliveries: { vertex: 'delivery'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/organization
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
 * Type-level schema of {@link WebhookSubscription}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/webhook_subscription
 */
export interface WebhookSubscriptionSchema {
    type: 'WebhookSubscription';
    attributes: {
        active: boolean | null;
        application_id: string | null;
        /**
         * Every delivery will include a header `X-PCO-Webhooks-Authenticity`.
         *
         * This header will be the `HMAC-SHA256` value of this the `authenticity_secret` used as the key,
         * and the message as the webhook body.
         *
         * `hmac_sha256(authenticity_secret, webhook_body)`
         */
        authenticity_secret: string | null;
        created_at: string | null;
        name: string | null;
        updated_at: string | null;
        url: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        application_id: string;
    };
    whereOps: {};
    order: never;
    create: {
        active?: boolean | null;
        name?: string | null;
        url?: string | null;
    };
    update: {
        active?: boolean | null;
    };
    delete: true;
    actions: 'rotate_secret';
    edges: {
        events: { vertex: 'event'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Webhooks resource, keyed by vertex id. */
export type WebhooksSchema = {
    available_event: AvailableEventSchema;
    delivery: DeliverySchema;
    event: EventSchema;
    organization: OrganizationSchema;
    webhook_subscription: WebhookSubscriptionSchema;
};

/** Edges available from the product root (`/webhooks/v2`). */
export type WebhooksRoot = {
    available_events: { vertex: 'available_event'; many: true; filters: never; create: false };
    webhook_subscriptions: { vertex: 'webhook_subscription'; many: true; filters: never; create: true };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<WebhooksSchema>, AssertRoot<WebhooksRoot>];

/**
 * An event supported by webhooks
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/available_event
 */
export type AvailableEvent = PcoResource<AvailableEventSchema>;
/**
 * Attributes of {@link AvailableEvent}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/available_event
 */
export type AvailableEventAttributes = AvailableEventSchema['attributes'];

/**
 * A Delivery resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/delivery
 */
export type Delivery = PcoResource<DeliverySchema>;
/**
 * Attributes of {@link Delivery}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/delivery
 */
export type DeliveryAttributes = DeliverySchema['attributes'];

/**
 * A Event resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/event
 */
export type Event = PcoResource<EventSchema>;
/**
 * Attributes of {@link Event}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/event
 */
export type EventAttributes = EventSchema['attributes'];

/**
 * A Organization resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * A WebhookSubscription resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/webhook_subscription
 */
export type WebhookSubscription = PcoResource<WebhookSubscriptionSchema>;
/**
 * Attributes of {@link WebhookSubscription}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/webhooks/versions/2022-10-20/vertices/webhook_subscription
 */
export type WebhookSubscriptionAttributes = WebhookSubscriptionSchema['attributes'];
