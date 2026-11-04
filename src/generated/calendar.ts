/**
 * Planning Center Calendar API (`/calendar/v2`).
 *
 * Generated from the Planning Center API documentation, version 2026-06-22, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Calendar: paths and capabilities only. */
export const calendarGraph = {
    product: 'calendar',
    slug: 'calendar',
    basePath: '/calendar/v2',
    version: '2026-06-22',
    rootVertex: 'organization',
    root: {
        attachments: { vertex: 'attachment', many: true, canCreate: false },
        calendars: { vertex: 'calendar', many: true, canCreate: false },
        conflicts: { vertex: 'conflict', many: true, canCreate: false },
        event_instances: { vertex: 'event_instance', many: true, canCreate: false },
        event_resource_requests: { vertex: 'event_resource_request', many: true, canCreate: false },
        events: { vertex: 'event', many: true, canCreate: false },
        feeds: { vertex: 'feed', many: true, canCreate: false },
        job_statuses: { vertex: 'job_status', many: true, canCreate: false },
        people: { vertex: 'person', many: true, canCreate: false },
        report_templates: { vertex: 'report_template', many: true, canCreate: true },
        resource_approval_groups: { vertex: 'resource_approval_group', many: true, canCreate: false },
        resource_bookings: { vertex: 'resource_booking', many: true, canCreate: false },
        resource_folders: { vertex: 'resource_folder', many: true, canCreate: true },
        resource_questions: { vertex: 'resource_question', many: true, canCreate: false },
        resources: { vertex: 'resource', many: true, canCreate: true },
        room_setups: { vertex: 'room_setup', many: true, canCreate: false },
        tag_groups: { vertex: 'tag_group', many: true, canCreate: true },
        tags: { vertex: 'tag', many: true, canCreate: true },
    },
    vertices: {
        attachment: {
            type: 'Attachment',
            edges: {
                event: { vertex: 'event', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/attachments',
        },
        calendar: {
            type: 'Calendar',
            edges: {
                approval_groups: { vertex: 'resource_approval_group', many: true, canCreate: false },
                events: { vertex: 'event', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/calendars',
        },
        conflict: {
            type: 'Conflict',
            edges: {
                resolved_by: { vertex: 'person', many: true, canCreate: false },
                resource: { vertex: 'resource', many: true, canCreate: false },
                winner: { vertex: 'event', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/conflicts',
        },
        containing_resource: {
            type: 'ContainingResource',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event: {
            type: 'Event',
            edges: {
                attachments: { vertex: 'attachment', many: true, canCreate: false },
                calendar: { vertex: 'calendar', many: true, canCreate: false },
                conflicts: { vertex: 'conflict', many: true, canCreate: false },
                event_connections: { vertex: 'event_connection', many: true, canCreate: true },
                event_instances: { vertex: 'event_instance', many: true, canCreate: false },
                event_resource_requests: { vertex: 'event_resource_request', many: true, canCreate: false },
                feed: { vertex: 'feed', many: true, canCreate: false },
                owner: { vertex: 'person', many: true, canCreate: false },
                resource_bookings: { vertex: 'resource_booking', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/events',
        },
        event_connection: {
            type: 'EventConnection',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        event_instance: {
            type: 'EventInstance',
            edges: {
                event: { vertex: 'event', many: true, canCreate: false },
                event_times: { vertex: 'event_time', many: true, canCreate: false },
                resource_bookings: { vertex: 'resource_booking', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/event_instances',
        },
        event_resource_answer: {
            type: 'EventResourceAnswer',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event_resource_request: {
            type: 'EventResourceRequest',
            edges: {
                answers: { vertex: 'event_resource_answer', many: true, canCreate: false },
                created_by: { vertex: 'person', many: true, canCreate: false },
                event: { vertex: 'event', many: true, canCreate: false },
                resource: { vertex: 'resource', many: true, canCreate: false },
                resource_bookings: { vertex: 'resource_booking', many: true, canCreate: false },
                room_setup: { vertex: 'room_setup', many: true, canCreate: false },
                updated_by: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/event_resource_requests',
        },
        event_time: {
            type: 'EventTime',
            edges: {
                event: { vertex: 'event', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        feed: {
            type: 'Feed',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/feeds',
        },
        job_status: {
            type: 'JobStatus',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/job_statuses',
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
            edges: {
                event_resource_requests: { vertex: 'event_resource_request', many: true, canCreate: false },
                organization: { vertex: 'organization', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/people',
        },
        report_template: {
            type: 'ReportTemplate',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/calendar/v2/report_templates',
        },
        required_approval: {
            type: 'RequiredApproval',
            edges: {
                resource: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        resource: {
            type: 'Resource',
            edges: {
                conflicts: { vertex: 'conflict', many: true, canCreate: false },
                event_resource_requests: { vertex: 'event_resource_request', many: true, canCreate: false },
                required_approvals: { vertex: 'required_approval', many: true, canCreate: false },
                resource_approval_groups: { vertex: 'resource_approval_group', many: true, canCreate: false },
                resource_bookings: { vertex: 'resource_booking', many: true, canCreate: false },
                resource_folder: { vertex: 'resource_folder', many: true, canCreate: false },
                resource_questions: { vertex: 'resource_question', many: true, canCreate: true },
                room_setups: { vertex: 'room_setup', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/calendar/v2/resources',
        },
        resource_approval_group: {
            type: 'ResourceApprovalGroup',
            edges: {
                calendars: { vertex: 'calendar', many: true, canCreate: false },
                event_resource_requests: { vertex: 'event_resource_request', many: true, canCreate: false },
                people: { vertex: 'person', many: true, canCreate: false },
                required_approvals: { vertex: 'required_approval', many: true, canCreate: false },
                resources: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/resource_approval_groups',
        },
        resource_booking: {
            type: 'ResourceBooking',
            edges: {
                event_resource_request: { vertex: 'event_resource_request', many: true, canCreate: false },
                resource: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/resource_bookings',
        },
        resource_folder: {
            type: 'ResourceFolder',
            edges: {
                resources: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/calendar/v2/resource_folders',
        },
        resource_question: {
            type: 'ResourceQuestion',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/calendar/v2/resource_questions',
        },
        resource_suggestion: {
            type: 'ResourceSuggestion',
            edges: {
                resource: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        room_setup: {
            type: 'RoomSetup',
            edges: {
                containing_resource: { vertex: 'containing_resource', many: true, canCreate: false },
                resource_suggestions: { vertex: 'resource_suggestion', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/calendar/v2/room_setups',
        },
        tag: {
            type: 'Tag',
            edges: {
                event_instances: { vertex: 'event_instance', many: true, canCreate: false },
                events: { vertex: 'event', many: true, canCreate: false },
                tag_group: { vertex: 'tag_group', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/calendar/v2/tags',
        },
        tag_group: {
            type: 'TagGroup',
            edges: {
                events: { vertex: 'event', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/calendar/v2/tag_groups',
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Attachment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/attachment
 */
export interface AttachmentSchema {
    type: 'Attachment';
    attributes: {
        /** MIME type of the attachment. Null for external links. */
        content_type: string | null;
        /** UTC time at which the attachment was created */
        created_at: string | null;
        /** Description of the attachment */
        description: string | null;
        /** File size in bytes. Null for external links. */
        file_size: number | null;
        /**
         * Possible values: file_upload, external_link
         *
         * Possible values: `file_upload` or `external_link`
         */
        kind: string | null;
        /** Set to the file name if not provided */
        name: string | null;
        /** UTC time at which the attachment was updated */
        updated_at: string | null;
        /**
         * Path to where the attachment is stored, or the external link URL for external_link attachments
         */
        url: string | null;
    };
    relationships: 'event';
    includes: 'event';
    related: {
        event: 'event';
    };
    where: {
        content_type: string;
        created_at: string | Date;
        description: string;
        file_size: number;
        kind: string;
        name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'content_type'
        | 'created_at'
        | 'description'
        | 'file_size'
        | 'kind'
        | 'name'
        | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event: { vertex: 'event'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Calendar2}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/calendar
 */
export interface Calendar2Schema {
    type: 'Calendar';
    attributes: {
        access: string | null;
        access_restricted: boolean | null;
        /**
         * Possible values: `blue`, `aqua`, `teal`, `green`, `yellow`, `orange`, `pink`, `purple`, `magenta`, `indigo`, `aqua_bold`, `teal_bold`, `orange_bold`, `magenta_bold`, `blue_bold`, `green_bold`, `yellow_bold`, `pink_bold`, `purple_bold`, or `indigo_bold`
         */
        color: string | null;
        /**
         * The number of pending events that would confirm if the calendar stopped requiring approval
         *
         * Only available when requested with the `?fields` param
         */
        confirmable_event_count: number | null;
        created_at: string | null;
        default: boolean | null;
        description: string | null;
        name: string | null;
        requires_approval: boolean | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'approval_groups';
    related: {
        approval_groups: 'resource_approval_group';
    };
    where: {};
    whereOps: {};
    order: 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        approval_groups: { vertex: 'resource_approval_group'; many: true; filters: never; create: false };
        events: { vertex: 'event'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Conflict}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/conflict
 */
export interface ConflictSchema {
    type: 'Conflict';
    attributes: {
        /** UTC time at which the conflict was created */
        created_at: string | null;
        /** Additional information about the conflict or resolution */
        note: string | null;
        /** UTC time at which the conflict was resolved */
        resolved_at: string | null;
        /** UTC time at which the conflict was updated */
        updated_at: string | null;
    };
    relationships: 'resolved_by' | 'resource' | 'winner';
    includes: 'resolved_by' | 'resource' | 'winner';
    related: {
        resolved_by: 'person';
        resource: 'resource';
        winner: 'event';
    };
    where: {};
    whereOps: {};
    order: 'resolved_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        resolved_by: { vertex: 'person'; many: true; filters: never; create: false };
        resource: { vertex: 'resource'; many: true; filters: never; create: false };
        winner: { vertex: 'event'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ContainingResource}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/containing_resource
 */
export interface ContainingResourceSchema {
    type: 'ContainingResource';
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
 * Type-level schema of {@link Event}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event
 */
export interface EventSchema {
    type: 'Event';
    attributes: {
        /**
         * Possible values:
         * - `A`: approved.
         * - `P`: pending.
         * - `R`: rejected.
         */
        approval_status: string | null;
        /** UTC time at which the event was created */
        created_at: string | null;
        /** A rich text public-facing summary of the event */
        description: string | null;
        /**
         * - `true` indicates the event is featured on Church Center
         * - `false` indicates the event is not featured on Church Center
         */
        featured: boolean | null;
        /** Path to where the event image is stored */
        image_url: string | null;
        /**
         * - `true` indicates the event is published to Church Center through the link only
         * - `false` indicates the event is published to Church Center normally
         */
        link_only: boolean | null;
        /** The name of the event */
        name: string | null;
        /**
         * Calculated by taking the sum of the `percent_approved` for all
         * future `ReservationBlocks` and dividing that by the `count` of all future
         * `ReservationBlocks`.
         *
         * If there are no future `ReservationBlocks`, returns `100`
         */
        percent_approved: number | null;
        /**
         * Calculated by taking the sum of the `percent_rejected` for all
         * future `ReservationBlocks` and dividing that by the `count` of all future
         * `ReservationBlocks`.
         *
         * If there are no future `ReservationBlocks`, returns `0`
         */
        percent_rejected: number | null;
        /** The registration URL for the event */
        registration_url: string | null;
        /** A plain text public-facing summary of the event */
        summary: string | null;
        /** UTC time at which the event was updated */
        updated_at: string | null;
        /**
         * - `true` indicates the event Church Center visibility is set to 'Published'
         * - `false` indicates the event Church Center visibility is set to 'Hidden'
         */
        visible_in_church_center: boolean | null;
    };
    relationships: 'calendar' | 'owner';
    includes: 'attachments' | 'calendar' | 'feed' | 'owner' | 'tags';
    related: {
        attachments: 'attachment';
        calendar: 'calendar';
        feed: 'feed';
        owner: 'person';
        tags: 'tag';
    };
    where: {
        approval_status: string;
        created_at: string | Date;
        featured: boolean;
        link_only: boolean;
        name: string;
        percent_approved: number;
        percent_rejected: number;
        updated_at: string | Date;
        visible_in_church_center: boolean;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        attachments: { vertex: 'attachment'; many: true; filters: never; create: false };
        calendar: { vertex: 'calendar'; many: true; filters: never; create: false };
        conflicts: { vertex: 'conflict'; many: true; filters: never; create: false };
        event_connections: { vertex: 'event_connection'; many: true; filters: never; create: true };
        event_instances: { vertex: 'event_instance'; many: true; filters: 'future'; create: false };
        event_resource_requests: { vertex: 'event_resource_request'; many: true; filters: never; create: false };
        feed: { vertex: 'feed'; many: true; filters: never; create: false };
        owner: { vertex: 'person'; many: true; filters: never; create: false };
        resource_bookings: { vertex: 'resource_booking'; many: true; filters: 'future'; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventConnection}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_connection
 */
export interface EventConnectionSchema {
    type: 'EventConnection';
    attributes: {
        /** Unique identifier for the connected record */
        connected_to_id: string | null;
        /** Name of the record that the event is connected to */
        connected_to_name: string | null;
        /** Currently we support `signup`, `group`, `event`, and `service_type` */
        connected_to_type: string | null;
        /** A link to the connected record */
        connected_to_url: string | null;
        /** Currently we support `registrations`, `groups`, `check-ins`, and `services` */
        product_name: string | null;
        /**
         * Whether this connection is promoted for display (only applies to Groups connections)
         *
         * Only available when requested with the `?fields` param
         */
        promoted: boolean | null;
    };
    relationships: 'event';
    includes: never;
    related: {
        event: 'event';
    };
    where: {
        connected_to_id: string;
        product_name: string;
        promoted: boolean;
    };
    whereOps: {};
    order: never;
    create: {
        /** Unique identifier for the connected record */
        connected_to_id?: string | null;
        /** Name of the record that the event is connected to */
        connected_to_name?: string | null;
        /** Currently we support `signup`, `group`, `event`, and `service_type` */
        connected_to_type?: string | null;
        /** Currently we support `registrations`, `groups`, `check-ins`, and `services` */
        product_name?: string | null;
        /**
         * Whether this connection is promoted for display (only applies to Groups connections)
         *
         * Only available when requested with the `?fields` param
         */
        promoted?: boolean | null;
    };
    update: {
        /** Unique identifier for the connected record */
        connected_to_id?: string | null;
        /** Name of the record that the event is connected to */
        connected_to_name?: string | null;
        /** Currently we support `signup`, `group`, `event`, and `service_type` */
        connected_to_type?: string | null;
        /** Currently we support `registrations`, `groups`, `check-ins`, and `services` */
        product_name?: string | null;
        /**
         * Whether this connection is promoted for display (only applies to Groups connections)
         *
         * Only available when requested with the `?fields` param
         */
        promoted?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link EventInstance}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_instance
 */
export interface EventInstanceSchema {
    type: 'EventInstance';
    attributes: {
        /** Indicates whether event instance lasts all day */
        all_day_event: boolean | null;
        /** The URL for the event on Church Center */
        church_center_url: string | null;
        /** Compact representation of event instance's recurrence pattern */
        compact_recurrence_description: string | null;
        /** UTC time at which the event instance was created */
        created_at: string | null;
        /**
         * A rich text public-facing summary of the event
         *
         * Only available when requested with the `?fields` param
         */
        description: string | null;
        /** UTC time at which the event instance ends */
        ends_at: string | null;
        /**
         * Path to where the event image is stored
         *
         * Only available when requested with the `?fields` param
         */
        image_url: string | null;
        /**
         * The type of event: `standard` or `blockout`
         *
         * Only available when requested with the `?fields` param
         */
        kind: string | null;
        /** Representation of where the event instance takes place */
        location: string | null;
        /** Name of event. Can be overridden for specific instances */
        name: string | null;
        /** Publicly visible end time */
        published_ends_at: string | null;
        /** Publicly visible start time */
        published_starts_at: string | null;
        /**
         * For a recurring event instance, the interval of how often the event instance occurs
         */
        recurrence: string | null;
        /** Longer description of the event instance's recurrence pattern */
        recurrence_description: string | null;
        /** UTC time at which the event instance starts */
        starts_at: string | null;
        /** UTC time at which the event instance was updated */
        updated_at: string | null;
    };
    relationships: 'event';
    includes: 'event' | 'event_times' | 'resource_bookings' | 'tags';
    related: {
        event: 'event';
        event_times: 'event_time';
        resource_bookings: 'resource_booking';
        tags: 'tag';
    };
    where: {
        created_at: string | Date;
        ends_at: string | Date;
        kind: string;
        starts_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        ends_at: 'gt' | 'gte' | 'lt' | 'lte';
        starts_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'ends_at' | 'starts_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event: { vertex: 'event'; many: true; filters: never; create: false };
        event_times: { vertex: 'event_time'; many: true; filters: never; create: false };
        resource_bookings: { vertex: 'resource_booking'; many: true; filters: 'future' | 'resources' | 'rooms'; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventResourceAnswer}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_resource_answer
 */
export interface EventResourceAnswerSchema {
    type: 'EventResourceAnswer';
    attributes: {
        /** The answer formatted for display */
        answer: Record<string, unknown> | null;
        created_at: string | null;
        /** Only available when requested with the `?fields` param */
        db_answer: string | null;
        /** Question details as of when it was answered */
        question: Record<string, unknown> | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'event_resource_request' | 'resource_question' | 'updated_by';
    includes: never;
    related: {
        created_by: 'person';
        event_resource_request: 'event_resource_request';
        resource_question: 'resource_question';
        updated_by: 'person';
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
 * Type-level schema of {@link EventResourceRequest}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_resource_request
 */
export interface EventResourceRequestSchema {
    type: 'EventResourceRequest';
    attributes: {
        /** Whether or not an email has been sent to request approval */
        approval_sent: boolean | null;
        /**
         * Possible values:
         * - `A`: approved
         * - `P`: pending
         * - `R`: rejected
         */
        approval_status: string | null;
        /** UTC time at which request was created */
        created_at: string | null;
        /** Additional information about the room or resource request */
        notes: string | null;
        /** How many of the rooms or resources are being requested */
        quantity: number | null;
        /** UTC time at which request was updated */
        updated_at: string | null;
        /** Whether this resource request is visible on kiosks */
        visible_on_kiosks: boolean | null;
    };
    relationships:
        | 'created_by'
        | 'event'
        | 'event_resource_request'
        | 'resource'
        | 'room_setup'
        | 'updated_by';
    includes: 'created_by' | 'event' | 'resource' | 'room_setup' | 'updated_by';
    related: {
        created_by: 'person';
        event: 'event';
        event_resource_request: 'event_resource_request';
        resource: 'resource';
        room_setup: 'room_setup';
        updated_by: 'person';
    };
    where: {
        approval_sent: boolean;
        approval_status: string;
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        answers: { vertex: 'event_resource_answer'; many: true; filters: never; create: false };
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
        event: { vertex: 'event'; many: true; filters: never; create: false };
        resource: { vertex: 'resource'; many: true; filters: never; create: false };
        resource_bookings: { vertex: 'resource_booking'; many: true; filters:
            | 'approved'
            | 'approved_conflict'
            | 'approved_pending'
            | 'approved_pending_conflict'
            | 'approved_pending_rejected'
            | 'approved_pending_rejected_conflict'
            | 'approved_rejected'
            | 'approved_rejected_conflict'
            | 'conflict'
            | 'future'
            | 'pending'
            | 'pending_conflict'
            | 'pending_rejected'
            | 'pending_rejected_conflict'
            | 'rejected'
            | 'rejected_conflict'; create: false };
        room_setup: { vertex: 'room_setup'; many: true; filters: never; create: false };
        updated_by: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_time
 */
export interface EventTimeSchema {
    type: 'EventTime';
    attributes: {
        /** UTC time at which the event time ends */
        ends_at: string | null;
        /** Name of the event time */
        name: string | null;
        /** UTC time at which the event time starts */
        starts_at: string | null;
        /** Set to `true` if the time is visible on kiosk */
        visible_on_kiosks: boolean | null;
        /** Set to `true` if the time is visible on widget or iCal */
        visible_on_widget_and_ical: boolean | null;
    };
    relationships: 'event';
    includes: 'event';
    related: {
        event: 'event';
    };
    where: {
        ends_at: string | Date;
        name: string;
        starts_at: string | Date;
        visible_on_kiosks: boolean;
        visible_on_widget_and_ical: boolean;
    };
    whereOps: {
        ends_at: 'gt' | 'gte' | 'lt' | 'lte';
        starts_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'ends_at' | 'starts_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event: { vertex: 'event'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Feed}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/feed
 */
export interface FeedSchema {
    type: 'Feed';
    attributes: {
        can_delete: boolean | null;
        /** Possible values: `hidden` or `published` */
        default_church_center_visibility: string | null;
        deleting: boolean | null;
        /** Possible values: `registrations`, `groups`, `ical`, or `form` */
        feed_type: string | null;
        imported_at: string | null;
        name: string | null;
        /** Only available when requested with the `?fields` param */
        prefix_event_names: boolean | null;
        source_id: string | null;
        /** Only available when requested with the `?fields` param */
        sync_campus_tags: boolean | null;
    };
    relationships: 'default_calendar' | 'event_owner';
    includes: never;
    related: {
        default_calendar: 'calendar';
        event_owner: 'person';
    };
    where: {
        feed_type: string;
        source_id: string;
    };
    whereOps: {};
    order: 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link JobStatus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/job_status
 */
export interface JobStatusSchema {
    type: 'JobStatus';
    attributes: {
        errors: Record<string, unknown> | null;
        message: string | null;
        retries: number | null;
        started_at: string | null;
        status: string | null;
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
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        /** The day of the week the calendar starts on */
        calendar_starts_on: string | null;
        /**
         * Possible values:
         * - `%d/%m/%Y`: indicates date/month/year formatting
         * - `%m/%d/%Y`: indicates month/date/year formatting
         */
        date_format: string | null;
        /** The name of the organization */
        name: string | null;
        /** Only available when requested with the `?fields` param */
        onboarding: boolean | null;
        /** The time zone of the organization */
        time_zone: string | null;
        /**
         * - `true` indicates hours for times will use a 24-hour clock
         * - `false` indicates hours for times will use a 12-hour clock
         */
        twenty_four_hour_time: boolean | null;
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
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        /** Path to where the avatar image is stored */
        avatar_url: string | null;
        /** Indicates whether the person can edit other people */
        can_edit_people: boolean | null;
        /** Indicates whether the person can edit resources */
        can_edit_resources: boolean | null;
        /** Indicates whether the person can edit rooms */
        can_edit_rooms: boolean | null;
        /** Indicates whether the person is a child */
        child: boolean | null;
        /**
         * An object containing the person's contact data.
         *
         * This can include an array of `email_addresses`, `addresses` and `phone_numbers`
         */
        contact_data: string | null;
        /** UTC time at which the person was created */
        created_at: string | null;
        /**
         * Indicates whether the person is an Event Administrator, and therefore has access to every calendar
         *
         *
         * Only available when requested with the `?fields` param
         */
        event_administrator: boolean | null;
        /** Event permissions for the person */
        event_permissions_type: string | null;
        /** The person's first name */
        first_name: string | null;
        /** `M` indicates male, `F` indicates female */
        gender: string | null;
        /** Indicates whether the person has access to Calendar */
        has_access: boolean | null;
        /**
         * Indicates whether the person has full (not limited, event-level-only) access to at least one calendar
         *
         *
         * Only available when requested with the `?fields` param
         */
        has_full_access_to_any_calendar: boolean | null;
        /** The person's last name */
        last_name: string | null;
        /**
         * Indicates whether the person is a member of at least one approval group
         *
         * Only available when requested with the `?fields` param
         */
        member_of_approval_groups: boolean | null;
        /** The person's middle name */
        middle_name: string | null;
        /** The person's first name, last name, and name suffix */
        name: string | null;
        /**
         * Possible values:
         * - `Mr.`
         * - `Mrs.`
         * - `Ms.`
         * - `Miss`
         * - `Dr.`
         * - `Rev.`
         */
        name_prefix: string | null;
        /**
         * Possible values:
         * - `Jr.`
         * - `Sr.`
         * - `Ph.D.`
         * - `II`
         * - `III`
         */
        name_suffix: string | null;
        /**
         * If the person is a member of an approval group, the number of EventResourceRequests needing resolution.
         *
         * If `resolves_conflicts` is `true`, the count will also include the number of Conflicts needing resolution.
         */
        pending_request_count: number | null;
        /** People permissions for the person */
        people_permissions_type: string | null;
        /** Integer that corresponds to the person's permissions in Calendar */
        permissions: number | null;
        /** Indicates whether the person is able to resolve Conflicts */
        resolves_conflicts: boolean | null;
        /** Resource permissions for the person */
        resources_permissions_type: string | null;
        /** Room permissions for the person */
        room_permissions_type: string | null;
        /** Indicates whether the person is a Organization Administrator */
        site_administrator: boolean | null;
        /**
         * Possible values:
         * - `active`: The person is marked "active" in People
         * - `inactive`: The person is marked "inactive" in People
         *
         *
         * Possible values: `active`, `pending`, or `inactive`
         */
        status: string | null;
        /** UTC time at which the person was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'organization';
    related: {
        organization: 'organization';
    };
    where: {
        created_at: string | Date;
        first_name: string;
        last_name: string;
        middle_name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'first_name' | 'last_name' | 'resolves_conflicts' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event_resource_requests: { vertex: 'event_resource_request'; many: true; filters:
            | 'awaiting_response'
            | 'future'
            | 'not_in_conflict'
            | 'not_overbooked'
            | 'overbooked'; create: false };
        organization: { vertex: 'organization'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ReportTemplate}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/report_template
 */
export interface ReportTemplateSchema {
    type: 'ReportTemplate';
    attributes: {
        /** The contents of the report template */
        body: string | null;
        /** UTC time at which the report was created */
        created_at: string | null;
        /** A summarization of the report */
        description: string | null;
        /** The title of the report */
        title: string | null;
        /** UTC time at which the report was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {
        /** The contents of the report template */
        body?: string | null;
        /** A summarization of the report */
        description?: string | null;
        /** The title of the report */
        title?: string | null;
    };
    update: {
        /** The contents of the report template */
        body?: string | null;
        /** A summarization of the report */
        description?: string | null;
        /** The title of the report */
        title?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link RequiredApproval}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/required_approval
 */
export interface RequiredApprovalSchema {
    type: 'RequiredApproval';
    attributes: {};
    relationships: never;
    includes: 'resource';
    related: {
        resource: 'resource';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        resource: { vertex: 'resource'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Resource}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource
 */
export interface ResourceSchema {
    type: 'Resource';
    attributes: {
        /** UTC time at which the room or resource was created */
        created_at: string | null;
        /** Description of the room or resource */
        description: string | null;
        /** UTC time at which the resource expires */
        expires_at: string | null;
        /** Where the resource is normally kept */
        home_location: string | null;
        /** Path to where resource image is stored */
        image: string | null;
        /** The type of resource, can either be `Room` or `Resource` */
        kind: string | null;
        /** The name of the room or resource */
        name: string | null;
        /**
         * A string representing the location of the resource if it is nested within a folder.
         *
         * Each parent folder is separated by `/`
         */
        path_name: string | null;
        /** The quantity of the resource */
        quantity: number | null;
        /** The serial number of the resource */
        serial_number: string | null;
        /** UTC time at which the room or resource was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes:
        | 'resource_approval_groups'
        | 'resource_folder'
        | 'resource_questions'
        | 'room_setups';
    related: {
        resource_approval_groups: 'resource_approval_group';
        resource_folder: 'resource_folder';
        resource_questions: 'resource_question';
        room_setups: 'room_setup';
    };
    where: {
        created_at: string | Date;
        id: string;
        kind: string;
        name: string;
        path_name: string;
        serial_number: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'expires_at' | 'name' | 'updated_at';
    create: {
        /** Description of the room or resource */
        description?: string | null;
        /** UTC time at which the resource expires */
        expires_at?: string | null;
        /** Where the resource is normally kept */
        home_location?: string | null;
        /** The type of resource, can either be `Room` or `Resource` */
        kind?: string | null;
        /** The name of the room or resource */
        name?: string | null;
        /** The quantity of the resource */
        quantity?: number | null;
        /** The serial number of the resource */
        serial_number?: string | null;
    };
    update: {
        /** Description of the room or resource */
        description?: string | null;
        /** UTC time at which the resource expires */
        expires_at?: string | null;
        /** Where the resource is normally kept */
        home_location?: string | null;
        /** The name of the room or resource */
        name?: string | null;
        /** The quantity of the resource */
        quantity?: number | null;
        /** The serial number of the resource */
        serial_number?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        conflicts: { vertex: 'conflict'; many: true; filters: never; create: false };
        event_resource_requests: { vertex: 'event_resource_request'; many: true; filters: never; create: false };
        required_approvals: { vertex: 'required_approval'; many: true; filters: never; create: false };
        resource_approval_groups: { vertex: 'resource_approval_group'; many: true; filters: never; create: false };
        resource_bookings: { vertex: 'resource_booking'; many: true; filters:
            | 'approved'
            | 'approved_conflict'
            | 'approved_pending'
            | 'approved_pending_conflict'
            | 'approved_pending_rejected'
            | 'approved_pending_rejected_conflict'
            | 'approved_rejected'
            | 'approved_rejected_conflict'
            | 'conflict'
            | 'future'
            | 'pending'
            | 'pending_conflict'
            | 'pending_rejected'
            | 'pending_rejected_conflict'
            | 'rejected'
            | 'rejected_conflict'; create: false };
        resource_folder: { vertex: 'resource_folder'; many: true; filters: never; create: false };
        resource_questions: { vertex: 'resource_question'; many: true; filters: never; create: true };
        room_setups: { vertex: 'room_setup'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ResourceApprovalGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_approval_group
 */
export interface ResourceApprovalGroupSchema {
    type: 'ResourceApprovalGroup';
    attributes: {
        /**
         * The number of calendars that require approval from the group
         *
         * Only available when requested with the `?fields` param
         */
        calendar_count: number | null;
        /** UTC time at which the approval group was created */
        created_at: string | null;
        /** Only available when requested with the `?fields` param */
        form_count: number | null;
        /** Name of the approval group */
        name: string | null;
        /**
         * The number of people in the approval group
         *
         * Only available when requested with the `?fields` param
         */
        person_count: number | null;
        /**
         * The number of resources in the approval group
         *
         * Only available when requested with the `?fields` param
         */
        resource_count: number | null;
        /**
         * The number of rooms in the approval group
         *
         * Only available when requested with the `?fields` param
         */
        room_count: number | null;
        /** UTC time at which the approval group was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'calendars' | 'people' | 'resources';
    related: {
        calendars: 'calendar';
        people: 'person';
        resources: 'resource';
    };
    where: {
        created_at: string | Date;
        id: string;
        name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'name' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        calendars: { vertex: 'calendar'; many: true; filters: never; create: false };
        event_resource_requests: { vertex: 'event_resource_request'; many: true; filters:
            | 'awaiting_response'
            | 'future'
            | 'not_in_conflict'
            | 'not_overbooked'
            | 'overbooked'; create: false };
        people: { vertex: 'person'; many: true; filters: never; create: false };
        required_approvals: { vertex: 'required_approval'; many: true; filters: 'resources' | 'rooms'; create: false };
        resources: { vertex: 'resource'; many: true; filters: 'resources' | 'rooms'; create: false };
    };
}

/**
 * Type-level schema of {@link ResourceBooking}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_booking
 */
export interface ResourceBookingSchema {
    type: 'ResourceBooking';
    attributes: {
        /** UTC time at which the booking was created */
        created_at: string | null;
        /** UTC time at which usage of the booked room or resource ends */
        ends_at: string | null;
        /** The quantity of the rooms or resources booked */
        quantity: number | null;
        /** UTC time at which usage of the booked room or resource starts */
        starts_at: string | null;
        /** UTC time at which the booking was updated */
        updated_at: string | null;
    };
    relationships: 'event' | 'event_instance' | 'resource';
    includes: 'event_resource_request' | 'resource';
    related: {
        event: 'event';
        event_instance: 'event_instance';
        event_resource_request: 'event_resource_request';
        resource: 'resource';
    };
    where: {
        created_at: string | Date;
        ends_at: string | Date;
        starts_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        ends_at: 'gt' | 'gte' | 'lt' | 'lte';
        starts_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'ends_at' | 'starts_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event_resource_request: { vertex: 'event_resource_request'; many: true; filters: never; create: false };
        resource: { vertex: 'resource'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ResourceFolder}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_folder
 */
export interface ResourceFolderSchema {
    type: 'ResourceFolder';
    attributes: {
        ancestry: string | null;
        /** UTC time at which the folder was created */
        created_at: string | null;
        /** The type of folder, can either be `Room` or `Resource` */
        kind: string | null;
        /** The folder name */
        name: string | null;
        /**
         * A string representing the location of the folder if it is nested.
         *
         * Each parent folder is separated by `/`
         */
        path_name: string | null;
        /** UTC time at which the folder was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'resources';
    related: {
        resources: 'resource';
    };
    where: {
        ancestry: string;
        created_at: string | Date;
        name: string;
        path_name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'ancestry' | 'created_at' | 'name' | 'updated_at';
    create: {
        /** The type of folder, can either be `Room` or `Resource` */
        kind?: string | null;
        /** The folder name */
        name?: string | null;
    };
    update: {
        /** The folder name */
        name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        resources: { vertex: 'resource'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ResourceQuestion}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_question
 */
export interface ResourceQuestionSchema {
    type: 'ResourceQuestion';
    attributes: {
        /**
         * If `kind` is `dropdown`, represents a string of dropdown choices
         * separated by the `|` character
         */
        choices: string | null;
        /** UTC time at which the question was created */
        created_at: string | null;
        /** Optional description of the question */
        description: string | null;
        /**
         * Possible values:
         * - `dropdown`: predefined list of choices as an answer
         * - `paragraph`: expected answer is a paragraph
         * - `text`: expected answer is a sentence
         * - `yesno`: expected answer is 'Yes' or 'No'
         *
         * - `section_header`: used to separate questions in the UI, no expected answer
         */
        kind: string | null;
        /**
         * If `kind` is `dropdown`,
         * `true` indicates that more than one selection is permitted
         */
        multiple_select: boolean | null;
        /**
         * - `true` indicates answering the question is not required when booking
         * - `false` indicates answering the question is required when booking
         */
        optional: boolean | null;
        /** Position of question in list in the UI */
        position: number | null;
        /** The question to be answered */
        question: string | null;
        /** UTC time at which the question was updated */
        updated_at: string | null;
    };
    relationships: 'resource';
    includes: never;
    related: {
        resource: 'resource';
    };
    where: {
        created_at: string | Date;
        kind: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: never;
    create: {
        /**
         * If `kind` is `dropdown`, represents a string of dropdown choices
         * separated by the `|` character
         */
        choices?: string | null;
        /** Optional description of the question */
        description?: string | null;
        /**
         * Possible values:
         * - `dropdown`: predefined list of choices as an answer
         * - `paragraph`: expected answer is a paragraph
         * - `text`: expected answer is a sentence
         * - `yesno`: expected answer is 'Yes' or 'No'
         *
         * - `section_header`: used to separate questions in the UI, no expected answer
         */
        kind?: string | null;
        /**
         * If `kind` is `dropdown`,
         * `true` indicates that more than one selection is permitted
         */
        multiple_select?: boolean | null;
        /**
         * - `true` indicates answering the question is not required when booking
         * - `false` indicates answering the question is required when booking
         */
        optional?: boolean | null;
        /** Position of question in list in the UI */
        position?: number | null;
        /** The question to be answered */
        question?: string | null;
    };
    update: {
        /**
         * If `kind` is `dropdown`, represents a string of dropdown choices
         * separated by the `|` character
         */
        choices?: string | null;
        /** Optional description of the question */
        description?: string | null;
        /**
         * Possible values:
         * - `dropdown`: predefined list of choices as an answer
         * - `paragraph`: expected answer is a paragraph
         * - `text`: expected answer is a sentence
         * - `yesno`: expected answer is 'Yes' or 'No'
         *
         * - `section_header`: used to separate questions in the UI, no expected answer
         */
        kind?: string | null;
        /**
         * If `kind` is `dropdown`,
         * `true` indicates that more than one selection is permitted
         */
        multiple_select?: boolean | null;
        /**
         * - `true` indicates answering the question is not required when booking
         * - `false` indicates answering the question is required when booking
         */
        optional?: boolean | null;
        /** Position of question in list in the UI */
        position?: number | null;
        /** The question to be answered */
        question?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link ResourceSuggestion}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_suggestion
 */
export interface ResourceSuggestionSchema {
    type: 'ResourceSuggestion';
    attributes: {
        /** UTC time at which the suggestion was created */
        created_at: string | null;
        /** How many resources should be requested */
        quantity: number | null;
        /** UTC time at which the suggestion was updated */
        updated_at: string | null;
    };
    relationships: 'resource' | 'room_setup';
    includes: 'resource';
    related: {
        resource: 'resource';
        room_setup: 'room_setup';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        resource: { vertex: 'resource'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link RoomSetup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/room_setup
 */
export interface RoomSetupSchema {
    type: 'RoomSetup';
    attributes: {
        /** UTC time at which the room setup was created */
        created_at: string | null;
        /** A description of the room setup */
        description: string | null;
        /**
         * An object containing `url` and `thumbnail`.
         *
         * `url` is path to where room setup is stored.
         * `thumbnail` contains `url` path to where thumbnail is stored.
         */
        diagram: string | null;
        /** Path to where thumbnail version of room setup is stored */
        diagram_thumbnail_url: string | null;
        /** Path to where room setup is stored */
        diagram_url: string | null;
        /** The name of the room setup */
        name: string | null;
        /** UTC time at which the room setup was updated */
        updated_at: string | null;
    };
    relationships: 'containing_resource' | 'resource_suggestions' | 'room_setup';
    includes: 'containing_resource' | 'resource_suggestions';
    related: {
        containing_resource: 'resource';
        resource_suggestions: 'resource_suggestion';
        room_setup: 'room_setup';
    };
    where: {
        created_at: string | Date;
        name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'name' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        containing_resource: { vertex: 'containing_resource'; many: true; filters: never; create: false };
        resource_suggestions: { vertex: 'resource_suggestion'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Tag}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/tag
 */
export interface TagSchema {
    type: 'Tag';
    attributes: {
        /** `true` indicates that this tag is used as a category on Church Center */
        church_center_category: boolean | null;
        /** Hex color code of the tag */
        color: string | null;
        /** UTC time at which the tag was created */
        created_at: string | null;
        /** The tag name */
        name: string | null;
        /**
         * If the tag belongs to a TagGroup,
         * position indicates place in list within TagGroup in the UI.
         *
         * If the tag does not belong to a TagGroup,
         * position indicates place in list under "Individual Tags" in the UI.
         */
        position: number | null;
        /** UTC time at which the tag was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'tag_group';
    related: {
        tag_group: 'tag_group';
    };
    where: {
        church_center_category: boolean;
        color: string;
        created_at: string | Date;
        id: string;
        name: string;
        position: number;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'name' | 'position';
    create: {
        /** `true` indicates that this tag is used as a category on Church Center */
        church_center_category?: boolean | null;
        /** Hex color code of the tag */
        color?: string | null;
        /** The tag name */
        name?: string | null;
        /**
         * If the tag belongs to a TagGroup,
         * position indicates place in list within TagGroup in the UI.
         *
         * If the tag does not belong to a TagGroup,
         * position indicates place in list under "Individual Tags" in the UI.
         */
        position?: number | null;
    };
    update: {
        /** `true` indicates that this tag is used as a category on Church Center */
        church_center_category?: boolean | null;
        /** Hex color code of the tag */
        color?: string | null;
        /** The tag name */
        name?: string | null;
        /**
         * If the tag belongs to a TagGroup,
         * position indicates place in list within TagGroup in the UI.
         *
         * If the tag does not belong to a TagGroup,
         * position indicates place in list under "Individual Tags" in the UI.
         */
        position?: number | null;
    };
    delete: true;
    actions: never;
    edges: {
        event_instances: { vertex: 'event_instance'; many: true; filters: never; create: false };
        events: { vertex: 'event'; many: true; filters: never; create: false };
        tag_group: { vertex: 'tag_group'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link TagGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/tag_group
 */
export interface TagGroupSchema {
    type: 'TagGroup';
    attributes: {
        /** UTC time at which the tag group was created */
        created_at: string | null;
        /** The name of the tag group */
        name: string | null;
        /**
         * - `true` indicates tag from this tag group must be applied when creating an event
         */
        required: boolean | null;
        /** UTC time at which the tag group was updated */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'events' | 'tags';
    related: {
        events: 'event';
        tags: 'tag';
    };
    where: {
        created_at: string | Date;
        name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'name';
    create: {
        /** The name of the tag group */
        name?: string | null;
        /**
         * - `true` indicates tag from this tag group must be applied when creating an event
         */
        required?: boolean | null;
    };
    update: {
        /** The name of the tag group */
        name?: string | null;
        /**
         * - `true` indicates tag from this tag group must be applied when creating an event
         */
        required?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {
        events: { vertex: 'event'; many: true; filters: never; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Planning Center Calendar resource, keyed by vertex id. */
export type CalendarSchema = {
    attachment: AttachmentSchema;
    calendar: Calendar2Schema;
    conflict: ConflictSchema;
    containing_resource: ContainingResourceSchema;
    event: EventSchema;
    event_connection: EventConnectionSchema;
    event_instance: EventInstanceSchema;
    event_resource_answer: EventResourceAnswerSchema;
    event_resource_request: EventResourceRequestSchema;
    event_time: EventTimeSchema;
    feed: FeedSchema;
    job_status: JobStatusSchema;
    organization: OrganizationSchema;
    person: PersonSchema;
    report_template: ReportTemplateSchema;
    required_approval: RequiredApprovalSchema;
    resource: ResourceSchema;
    resource_approval_group: ResourceApprovalGroupSchema;
    resource_booking: ResourceBookingSchema;
    resource_folder: ResourceFolderSchema;
    resource_question: ResourceQuestionSchema;
    resource_suggestion: ResourceSuggestionSchema;
    room_setup: RoomSetupSchema;
    tag: TagSchema;
    tag_group: TagGroupSchema;
};

/** Edges available from the product root (`/calendar/v2`). */
export type CalendarRoot = {
    attachments: { vertex: 'attachment'; many: true; filters: never; create: false };
    calendars: { vertex: 'calendar'; many: true; filters: never; create: false };
    conflicts: { vertex: 'conflict'; many: true; filters: 'future' | 'resolved' | 'unresolved'; create: false };
    event_instances: { vertex: 'event_instance'; many: true; filters:
        | 'all'
        | 'approved'
        | 'approved_conflict'
        | 'approved_pending'
        | 'approved_pending_conflict'
        | 'approved_pending_rejected'
        | 'approved_pending_rejected_conflict'
        | 'approved_rejected'
        | 'approved_rejected_conflict'
        | 'approver'
        | 'approver_subscriber'
        | 'conflict'
        | 'event_request_approved'
        | 'event_request_approved_pending'
        | 'event_request_approved_pending_rejected'
        | 'event_request_approved_rejected'
        | 'event_request_pending'
        | 'event_request_pending_rejected'
        | 'event_request_rejected'
        | 'future'
        | 'lost'
        | 'lost_due_to_blockout'
        | 'manager'
        | 'manager_approver'
        | 'manager_approver_subscriber'
        | 'manager_subscriber'
        | 'not_pending_event_requests'
        | 'owner'
        | 'owner_approver'
        | 'owner_approver_subscriber'
        | 'owner_manager'
        | 'owner_manager_approver'
        | 'owner_manager_approver_subscriber'
        | 'owner_manager_subscriber'
        | 'owner_subscriber'
        | 'pending'
        | 'pending_conflict'
        | 'pending_rejected'
        | 'pending_rejected_conflict'
        | 'rejected'
        | 'rejected_conflict'
        | 'shared'
        | 'subscriber'
        | 'unresolved'; create: false };
    event_resource_requests: { vertex: 'event_resource_request'; many: true; filters: never; create: false };
    events: { vertex: 'event'; many: true; filters: 'future'; create: false };
    feeds: { vertex: 'feed'; many: true; filters: never; create: false };
    job_statuses: { vertex: 'job_status'; many: true; filters: never; create: false };
    people: { vertex: 'person'; many: true; filters: 'active' | 'event_owners'; create: false };
    report_templates: { vertex: 'report_template'; many: true; filters: never; create: true };
    resource_approval_groups: { vertex: 'resource_approval_group'; many: true; filters: never; create: false };
    resource_bookings: { vertex: 'resource_booking'; many: true; filters:
        | 'approved'
        | 'approved_conflict'
        | 'approved_pending'
        | 'approved_pending_conflict'
        | 'approved_pending_rejected'
        | 'approved_pending_rejected_conflict'
        | 'approved_rejected'
        | 'approved_rejected_conflict'
        | 'conflict'
        | 'future'
        | 'pending'
        | 'pending_conflict'
        | 'pending_rejected'
        | 'pending_rejected_conflict'
        | 'rejected'
        | 'rejected_conflict'
        | 'resources'
        | 'rooms'; create: false };
    resource_folders: { vertex: 'resource_folder'; many: true; filters: 'resources' | 'rooms'; create: true };
    resource_questions: { vertex: 'resource_question'; many: true; filters: never; create: false };
    resources: { vertex: 'resource'; many: true; filters: 'resources' | 'rooms'; create: true };
    room_setups: { vertex: 'room_setup'; many: true; filters: 'shared_room_setups'; create: false };
    tag_groups: { vertex: 'tag_group'; many: true; filters: 'required'; create: true };
    tags: { vertex: 'tag'; many: true; filters: 'individual'; create: true };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<CalendarSchema>, AssertRoot<CalendarRoot>];

/**
 * A file or external link attached to an event.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/attachment
 */
export type Attachment = PcoResource<AttachmentSchema>;
/**
 * Attributes of {@link Attachment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/attachment
 */
export type AttachmentAttributes = AttachmentSchema['attributes'];

/**
 * Calendars associated with an Organization.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/calendar
 */
export type Calendar2 = PcoResource<Calendar2Schema>;
/**
 * Attributes of {@link Calendar2}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/calendar
 */
export type Calendar2Attributes = Calendar2Schema['attributes'];

/**
 * A conflict between two events caused by overlapping event resource
 * requests.
 *
 * If the conflict has been resolved, `resolved_at` will be present.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/conflict
 */
export type Conflict = PcoResource<ConflictSchema>;
/**
 * Attributes of {@link Conflict}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/conflict
 */
export type ConflictAttributes = ConflictSchema['attributes'];

/**
 * The containing record for a RoomSetup. Can be a Resource or
 * an Organization
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/containing_resource
 */
export type ContainingResource = PcoResource<ContainingResourceSchema>;
/**
 * Attributes of {@link ContainingResource}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/containing_resource
 */
export type ContainingResourceAttributes = ContainingResourceSchema['attributes'];

/**
 * An event.
 *
 * May contain information such as who owns
 * the event, visibility on Church Center and a public-facing summary.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event
 */
export type Event = PcoResource<EventSchema>;
/**
 * Attributes of {@link Event}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event
 */
export type EventAttributes = EventSchema['attributes'];

/**
 * A connection between a Calendar event and a record in another product
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_connection
 */
export type EventConnection = PcoResource<EventConnectionSchema>;
/**
 * Attributes of {@link EventConnection}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_connection
 */
export type EventConnectionAttributes = EventConnectionSchema['attributes'];

/**
 * A specific occurrence of an event.
 *
 * If the event is recurring, `recurrence` will be set and
 * `recurrence_description` will provide an overview of the recurrence pattern.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_instance
 */
export type EventInstance = PcoResource<EventInstanceSchema>;
/**
 * Attributes of {@link EventInstance}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_instance
 */
export type EventInstanceAttributes = EventInstanceSchema['attributes'];

/**
 * An answer to a question in a room or resource request.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_resource_answer
 */
export type EventResourceAnswer = PcoResource<EventResourceAnswerSchema>;
/**
 * Attributes of {@link EventResourceAnswer}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_resource_answer
 */
export type EventResourceAnswerAttributes = EventResourceAnswerSchema['attributes'];

/**
 * A room or resource request for a specific event.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_resource_request
 */
export type EventResourceRequest = PcoResource<EventResourceRequestSchema>;
/**
 * Attributes of {@link EventResourceRequest}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_resource_request
 */
export type EventResourceRequestAttributes = EventResourceRequestSchema['attributes'];

/**
 * Start and end times for each event instance.
 *
 * In the Calendar UI, these are represented under the "Schedule" section and
 * may include "Setup" and "Teardown" times for the instance.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_time
 */
export type EventTime = PcoResource<EventTimeSchema>;
/**
 * Attributes of {@link EventTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/event_time
 */
export type EventTimeAttributes = EventTimeSchema['attributes'];

/**
 * A feed belonging to an organization.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/feed
 */
export type Feed = PcoResource<FeedSchema>;
/**
 * Attributes of {@link Feed}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/feed
 */
export type FeedAttributes = FeedSchema['attributes'];

/**
 * A JobStatus resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/job_status
 */
export type JobStatus = PcoResource<JobStatusSchema>;
/**
 * Attributes of {@link JobStatus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/job_status
 */
export type JobStatusAttributes = JobStatusSchema['attributes'];

/**
 * An administrative structure, usually representing a single church.
 * Contains date/time formatting and time zone preferences.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * The people in your organization with access to Calendar.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A template for generating a report.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/report_template
 */
export type ReportTemplate = PcoResource<ReportTemplateSchema>;
/**
 * Attributes of {@link ReportTemplate}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/report_template
 */
export type ReportTemplateAttributes = ReportTemplateSchema['attributes'];

/**
 * Represents the relationship between a Resource and a Resource Approval Group.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/required_approval
 */
export type RequiredApproval = PcoResource<RequiredApprovalSchema>;
/**
 * Attributes of {@link RequiredApproval}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/required_approval
 */
export type RequiredApprovalAttributes = RequiredApprovalSchema['attributes'];

/**
 * A room or resource that can be requested for use as part of
 * an event.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource
 */
export type Resource = PcoResource<ResourceSchema>;
/**
 * Attributes of {@link Resource}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource
 */
export type ResourceAttributes = ResourceSchema['attributes'];

/**
 * A group of people that can be attached to a room or resource
 * in order to require their approval for booking.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_approval_group
 */
export type ResourceApprovalGroup = PcoResource<ResourceApprovalGroupSchema>;
/**
 * Attributes of {@link ResourceApprovalGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_approval_group
 */
export type ResourceApprovalGroupAttributes = ResourceApprovalGroupSchema['attributes'];

/**
 * A specific booking of a room or resource for an event instance.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_booking
 */
export type ResourceBooking = PcoResource<ResourceBookingSchema>;
/**
 * Attributes of {@link ResourceBooking}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_booking
 */
export type ResourceBookingAttributes = ResourceBookingSchema['attributes'];

/**
 * An organizational folder containing rooms or resources.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_folder
 */
export type ResourceFolder = PcoResource<ResourceFolderSchema>;
/**
 * Attributes of {@link ResourceFolder}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_folder
 */
export type ResourceFolderAttributes = ResourceFolderSchema['attributes'];

/**
 * A question to answer when requesting to book a room or resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_question
 */
export type ResourceQuestion = PcoResource<ResourceQuestionSchema>;
/**
 * Attributes of {@link ResourceQuestion}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_question
 */
export type ResourceQuestionAttributes = ResourceQuestionSchema['attributes'];

/**
 * A resource and quantity suggested by a room setup.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_suggestion
 */
export type ResourceSuggestion = PcoResource<ResourceSuggestionSchema>;
/**
 * Attributes of {@link ResourceSuggestion}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/resource_suggestion
 */
export type ResourceSuggestionAttributes = ResourceSuggestionSchema['attributes'];

/**
 * A diagram and list of suggested resources useful for predefined room setups.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/room_setup
 */
export type RoomSetup = PcoResource<RoomSetupSchema>;
/**
 * Attributes of {@link RoomSetup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/room_setup
 */
export type RoomSetupAttributes = RoomSetupSchema['attributes'];

/**
 * An organizational tag that can be applied to events.
 *
 * Applied tags can be used to filter events on the calendar or
 * filter events for reports, iCal feeds, kiosk, and the widget.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/tag
 */
export type Tag = PcoResource<TagSchema>;
/**
 * Attributes of {@link Tag}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/tag
 */
export type TagAttributes = TagSchema['attributes'];

/**
 * A grouping of tags for organizational purposes.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/tag_group
 */
export type TagGroup = PcoResource<TagGroupSchema>;
/**
 * Attributes of {@link TagGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/calendar/versions/2026-06-22/vertices/tag_group
 */
export type TagGroupAttributes = TagGroupSchema['attributes'];
