/**
 * Planning Center Groups API (`/groups/v2`).
 *
 * Generated from the Planning Center API documentation, version 2023-07-10, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Groups: paths and capabilities only. */
export const groupsGraph = {
    product: 'groups',
    slug: 'groups',
    basePath: '/groups/v2',
    version: '2023-07-10',
    rootVertex: 'organization',
    root: {
        campuses: { vertex: 'campus', many: true, canCreate: false },
        event_notes: { vertex: 'event_note', many: true, canCreate: false },
        events: { vertex: 'event', many: true, canCreate: false },
        group_applications: { vertex: 'group_application', many: true, canCreate: false },
        group_types: { vertex: 'group_type', many: true, canCreate: false },
        groups: { vertex: 'group', many: true, canCreate: false },
        memberships: { vertex: 'membership', many: true, canCreate: false },
        people: { vertex: 'person', many: true, canCreate: false },
        tag_groups: { vertex: 'tag_group', many: true, canCreate: false },
    },
    vertices: {
        attendance: {
            type: 'Attendance',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        campus: {
            type: 'Campus',
            edges: {
                groups: { vertex: 'group', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/campuses',
        },
        enrollment: {
            type: 'Enrollment',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event: {
            type: 'Event',
            edges: {
                attendances: { vertex: 'attendance', many: true, canCreate: false },
                group: { vertex: 'group', many: true, canCreate: false },
                location: { vertex: 'location', many: true, canCreate: false },
                notes: { vertex: 'event_note', many: true, canCreate: false },
                rsvps: { vertex: 'rsvp', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/events',
        },
        event_note: {
            type: 'EventNote',
            edges: {
                owner: { vertex: 'owner', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/event_notes',
        },
        group: {
            type: 'Group',
            edges: {
                applications: { vertex: 'group_application', many: true, canCreate: false },
                campuses: { vertex: 'campus', many: true, canCreate: false },
                enrollment: { vertex: 'enrollment', many: false, canCreate: false },
                events: { vertex: 'event', many: true, canCreate: false },
                group_type: { vertex: 'group_type', many: true, canCreate: false },
                location: { vertex: 'location', many: true, canCreate: false },
                memberships: { vertex: 'membership', many: true, canCreate: true },
                my_membership: { vertex: 'membership', many: true, canCreate: false },
                people: { vertex: 'person', many: true, canCreate: false },
                resources: { vertex: 'resource', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: ['assign_campuses', 'disable_chat', 'duplicate', 'enable_chat'],
            canUpdate: true,
            canDelete: false,
            canonicalPath: '/groups/v2/groups',
        },
        group_application: {
            type: 'GroupApplication',
            edges: {
                group: { vertex: 'group', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: ['approve', 'reject'],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/group_applications',
        },
        group_type: {
            type: 'GroupType',
            edges: {
                events: { vertex: 'event', many: true, canCreate: false },
                groups: { vertex: 'group', many: true, canCreate: false },
                resources: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/group_types',
        },
        location: {
            type: 'Location',
            edges: {
                group: { vertex: 'group', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        membership: {
            type: 'Membership',
            edges: {
                group: { vertex: 'group', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/groups/v2/memberships',
        },
        organization: {
            type: 'Organization',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        owner: {
            type: 'Owner',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        person: {
            type: 'Person',
            edges: {
                events: { vertex: 'event', many: true, canCreate: false },
                groups: { vertex: 'group', many: true, canCreate: false },
                memberships: { vertex: 'membership', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/people',
        },
        resource: {
            type: 'Resource',
            edges: {
                download: { vertex: 'resource', many: true, canCreate: false },
                visit: { vertex: 'resource', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        rsvp: {
            type: 'RSVP',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        tag: {
            type: 'Tag',
            edges: {
                groups: { vertex: 'group', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        tag_group: {
            type: 'TagGroup',
            edges: {
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/groups/v2/tag_groups',
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Attendance}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/attendance
 */
export interface AttendanceSchema {
    type: 'Attendance';
    attributes: {
        /** Whether or not the person attended the event. */
        attended: boolean | null;
        /**
         * The role of the person at the time of event.
         *
         *
         * Possible values: `member`, `leader`, `visitor`, or `applicant`
         */
        role: string | null;
    };
    relationships: 'event' | 'person';
    includes: 'person';
    related: {
        event: 'event';
        person: 'person';
    };
    where: {
        role: string;
    };
    whereOps: {};
    order: 'first_name' | 'last_name' | 'role';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** person belonging to this attendance */
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Campus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/campus
 */
export interface CampusSchema {
    type: 'Campus';
    attributes: {
        /** The name of the campus */
        name: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        id: string;
        name: string;
    };
    whereOps: {};
    order: 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** groups which have applied this campus */
        groups: { vertex: 'group'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Enrollment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/enrollment
 */
export interface EnrollmentSchema {
    type: 'Enrollment';
    attributes: {
        /** Whether or not enrollment has been closed automatically due to set limits */
        auto_closed: boolean | null;
        /** Brief description as to which limit automatically closed enrollment */
        auto_closed_reason: string | null;
        /** Date when enrollment should automatically close */
        date_limit: string | null;
        /** Whether or not the `date_limit` has been reached */
        date_limit_reached: boolean | null;
        /** Total number of members allowed before enrollment should automatically close */
        member_limit: number | null;
        /** Whether or not the `member_limit` has been reached */
        member_limit_reached: boolean | null;
        /**
         * Current enrollment status. Possible values:
         * * `open` - strategy is not `closed` and no limits have been reached
         * * `closed` - strategy is `closed` _or_ limits have been reached
         * * `full` - member limit has been reached
         * * `private` - group is unlisted
         */
        status: string | null;
        /**
         * Sign up strategy. Possible values: `request_to_join`, `open_signup`, or `closed`
         */
        strategy: string | null;
    };
    relationships: 'group';
    includes: never;
    related: {
        group: 'group';
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
 * Type-level schema of {@link Event}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/event
 */
export interface EventSchema {
    type: 'Event';
    attributes: {
        /**
         * This is a group setting that applies to all the events in the group.
         * If selected, an email will be sent to the primary email address of the group leader
         * 60 minutes before the event start time, asking them to report attendance.
         */
        attendance_requests_enabled: boolean | null;
        /**
         * If `true`, we send an event remind some specified time before the event starts
         * to all members in the group.
         */
        automated_reminder_enabled: boolean | null;
        /** Whether or not the event has been canceled. */
        canceled: boolean | null;
        /** The date and time the event was canceled. */
        canceled_at: string | null;
        /** A longform description of the event. Can contain HTML markup. */
        description: string | null;
        /** The date and time the event ends. */
        ends_at: string | null;
        /** The image for the event. */
        image: Record<string, unknown> | null;
        /** Either "physical" or "virtual". */
        location_type_preference: string | null;
        /** `true` if the event spans multiple days. Otherwise `false`. */
        multi_day: boolean | null;
        /** The name/title of the event. */
        name: string | null;
        /** `true` if reminders have been sent for this event. Otherwise `false`. */
        reminders_sent: boolean | null;
        /** The date and time reminders were sent for this event. */
        reminders_sent_at: string | null;
        /** `true` if the event is a repeating event. Otherwise `false`. */
        repeating: boolean | null;
        /** The date and time the event starts. */
        starts_at: string | null;
        /**
         * The URL for the virtual location. Typically we don't show this URL unless
         * unless the location_type_preference is "virtual".
         */
        virtual_location_url: string | null;
        /**
         * The number of visitors who attended the event. These are people who are not
         * members of the group.
         */
        visitors_count: number | null;
    };
    relationships: 'attendance_submitter' | 'group' | 'location' | 'repeating_event';
    includes: 'group' | 'location';
    related: {
        attendance_submitter: 'person';
        group: 'group';
        location: 'location';
    };
    where: {
        ends_at: string | Date;
        name: string;
        starts_at: string | Date;
    };
    whereOps: {
        ends_at: 'gt' | 'gte' | 'lt' | 'lte';
        starts_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'ends_at' | 'name' | 'starts_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** attendances recorded for this event */
        attendances: { vertex: 'attendance'; many: true; filters: 'attended'; create: false };
        /** group which the event belongs to */
        group: { vertex: 'group'; many: true; filters: never; create: false };
        /** physical location of the event */
        location: { vertex: 'location'; many: true; filters: never; create: false };
        /** notes added to the event */
        notes: { vertex: 'event_note'; many: true; filters: never; create: false };
        /** RSVP responses for the event */
        rsvps: { vertex: 'rsvp'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventNote}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/event_note
 */
export interface EventNoteSchema {
    type: 'EventNote';
    attributes: {
        /** The body text of the note. */
        body: string | null;
    };
    relationships: 'annotatable' | 'owner';
    includes: 'owner';
    related: {
        owner: 'owner';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** person who created the note */
        owner: { vertex: 'owner'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Group}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group
 */
export interface GroupSchema {
    type: 'Group';
    attributes: {
        /** The date and time the group was archived. */
        archived_at: string | null;
        /**
         * A boolean representing the current user's authorization to start a new conversation in the group.
         *
         *
         * Only available when requested with the `?fields` param
         */
        can_create_conversation: boolean | null;
        /**
         * A code representing why the current user can or cannot start a new conversation in the group.
         * Possible values: `chat_disabled`, `group_archived`, `non_member`, `leaders_only`.
         * Nil when the user is permitted to create a conversation.
         *
         *
         * Only available when requested with the `?fields` param
         */
        can_create_conversation_reason_code: string | null;
        /** A boolean representing whether or not the group has Chat enabled. */
        chat_enabled: boolean | null;
        /**
         * If a contact_email is provided, we will display a contact button on the public page
         * where potential members can ask questions before joining the group.
         */
        contact_email: string | null;
        /** The date and time the group was created. */
        created_at: string | null;
        /** A longform description of the group. Can contain HTML markup. */
        description: string | null;
        /** The plain text version of the group description. */
        description_as_plain_text: string | null;
        /**
         * A boolean representing whether or not direct messages are enabled for the group.
         */
        direct_messages_enabled: boolean | null;
        /** Whether or not events are visible to the public on Church Center */
        events_listed: boolean | null;
        /**
         * The visibility of events for the group.
         *
         *
         * Possible values: `public` or `members`
         */
        events_visibility: string | null;
        /**
         * A hash of header image URLs. The keys are `thumbnail`, `medium`, and `original`.
         *
         * ```json
         * {
         *   "thumbnail": "https://groups-production.s3.amazonaws.com/uploads/group/header_image/1986065/thumbnail_image-1676676396838.jpg",
         *   "medium": "https://groups-production.s3.amazonaws.com/uploads/group/header_image/1986065/medium_image-1676676396838.jpg",
         *   "original": "https://groups-production.s3.amazonaws.com/uploads/group/header_image/1986065/image-1676676396838.jpg"
         * }
         * ```
         */
        header_image: Record<string, unknown> | null;
        /**
         * Whether or not group leaders have access to the entire
         * church database on the admin side of Groups. (Not recommended)
         */
        leaders_can_search_people_database: boolean | null;
        /** Whether or not the group is visible on Church Center */
        listed: boolean | null;
        /**
         * The location type preference for the group.
         *
         *
         * Possible values: `physical` or `virtual`
         */
        location_type_preference: string | null;
        /** Whether or not group members can see other members' info */
        members_are_confidential: boolean | null;
        /**
         * The number of members in the group, includes leaders.
         * Does not include membership requests.
         */
        memberships_count: number | null;
        /** The name/title of the group. */
        name: string | null;
        /** The public URL for the group on Church Center. */
        public_church_center_web_url: string | null;
        /**
         * A text summary of the group's typical meeting schedule.
         * Can be a string like "Sundays at 9:30am" or "Every other Tuesday at 7pm".
         */
        schedule: string | null;
        /**
         * The IDs of the tags associated with the group.
         *
         *
         * Only available when requested with the `?fields` param
         */
        tag_ids: number | null;
        /**
         * The URL for the group's virtual location. A zoom link, for example.
         * This could be set even if `location_type_preference` is `physical`.
         * This is useful if you want to display a zoom link even if the group is meeting in person.
         */
        virtual_location_url: string | null;
        /**
         * DEPRECATED: This is a private attribute used by Home widgets that we plan to remove soon.
         *
         *
         * Only available when requested with the `?fields` param
         */
        widget_status: Record<string, unknown> | null;
    };
    relationships: 'group_type' | 'location';
    includes: 'enrollment' | 'group_type' | 'location';
    related: {
        enrollment: 'enrollment';
        group_type: 'group_type';
        location: 'location';
    };
    where: {
        archive_status: string;
        name: string;
    };
    whereOps: {};
    order:
        | 'chat_enabled'
        | 'contact_email'
        | 'created_at'
        | 'enrollment_limit'
        | 'listed'
        | 'members_are_confidential'
        | 'memberships_count'
        | 'name';
    create: {};
    update: {
        group_type_id?: string;
        /** The name/title of the group. */
        name?: string | null;
        /**
         * A text summary of the group's typical meeting schedule.
         * Can be a string like "Sundays at 9:30am" or "Every other Tuesday at 7pm".
         */
        schedule?: string | null;
        /**
         * The IDs of the tags associated with the group.
         *
         *
         * Only available when requested with the `?fields` param
         */
        tag_ids?: number | null;
    };
    delete: false;
    actions: 'assign_campuses' | 'disable_chat' | 'duplicate' | 'enable_chat';
    edges: {
        /** requests to join this group */
        applications: { vertex: 'group_application'; many: true; filters: never; create: false };
        /** campuses assigned this group */
        campuses: { vertex: 'campus'; many: true; filters: never; create: false };
        /** enrollment details for this group */
        enrollment: { vertex: 'enrollment'; many: false; filters: never; create: false };
        /** events for this group */
        events: { vertex: 'event'; many: true; filters: 'canceled' | 'not_canceled'; create: false };
        /** group type of this group */
        group_type: { vertex: 'group_type'; many: true; filters: never; create: false };
        /** default physical location for this group's events */
        location: { vertex: 'location'; many: true; filters: never; create: false };
        /** memberships belonging to this group */
        memberships: { vertex: 'membership'; many: true; filters: never; create: true };
        /** the current person's membership for this group */
        my_membership: { vertex: 'membership'; many: true; filters: never; create: false };
        /** people who have memberships for this group */
        people: { vertex: 'person'; many: true; filters: never; create: false };
        /** file and link resources shared with this group */
        resources: { vertex: 'resource'; many: true; filters: 'leaders'; create: false };
        /** tags assigned to this group */
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link GroupApplication}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group_application
 */
export interface GroupApplicationSchema {
    type: 'GroupApplication';
    attributes: {
        /** Timestamp when this person applied. */
        applied_at: string | null;
        /** An optional personal message from the applicant. */
        message: string | null;
        /**
         * The approval status of the application.
         *
         * Possible values: `pending`, `approved`, or `rejected`
         */
        status: string | null;
    };
    relationships: 'group' | 'person';
    includes: 'group' | 'person';
    related: {
        group: 'group';
        person: 'person';
    };
    where: {
        applied_at: string | Date;
        status: string;
    };
    whereOps: {
        applied_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'applied_at' | 'status';
    create: {};
    update: {};
    delete: false;
    actions: 'approve' | 'reject';
    edges: {
        /** group being applied to */
        group: { vertex: 'group'; many: true; filters: never; create: false };
        /** person who applied */
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link GroupType}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group_type
 */
export interface GroupTypeSchema {
    type: 'GroupType';
    attributes: {
        /**
         * `true` if the map view is visible on the public groups list page. Otherwise `false`.
         */
        church_center_map_visible: boolean | null;
        /** `true` if the group type contains any published groups. Otherwise `false`. */
        church_center_visible: boolean | null;
        /**
         * Hex color value. Color themes are a visual tool for administrators on the admin side of Groups.
         * Ex: "#4fd2e3"
         */
        color: string | null;
        /** A JSON object of default settings for groups of this type. */
        default_group_settings: string | null;
        /** A description of the group type */
        description: string | null;
        /** The name of the group type */
        name: string | null;
        /** The position of the group type in relation to other group types. */
        position: number | null;
        /** The public URL for the group on Church Center. */
        public_church_center_web_url: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        id: string;
    };
    whereOps: {};
    order: 'name' | 'position';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** events of groups with this group type */
        events: { vertex: 'event'; many: true; filters: 'canceled' | 'not_canceled' | 'upcoming'; create: false };
        /** groups belonging to this group type */
        groups: { vertex: 'group'; many: true; filters: never; create: false };
        /** file or link resources shared with all groups in this group type */
        resources: { vertex: 'resource'; many: true; filters: 'leaders'; create: false };
    };
}

/**
 * Type-level schema of {@link Location}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/location
 */
export interface LocationSchema {
    type: 'Location';
    attributes: {
        /**
         * This preference controls how the location is displayed to non-members for public groups and events.
         *
         *
         * Possible values: `hidden`, `approximate`, or `exact`
         */
        display_preference: string | null;
        /**
         * Ex: "1313 Disneyland Dr
         * Anaheim, CA 92802" (may be approximate or `null`)
         * Approximate address would be "Anaheim, CA 92802".
         * We obscure Canadian zip codes.
         */
        full_formatted_address: string | null;
        /** Ex: `33.815396` (may be approximate or `null`) */
        latitude: number | null;
        /** Ex: `-117.926399` (may be approximate or `null`) */
        longitude: number | null;
        /** Ex: "Disneyland" */
        name: string | null;
        /**
         * The number of miles in a location's approximate address.
         * Will be `0` if the strategy is exact, and will be `null` if the strategy is hidden.
         */
        radius: string | null;
        /**
         * The display preference strategy used for the current request, based on user permissions.
         * Either `hidden`, `approximate`, or `exact`.
         */
        strategy: string | null;
    };
    relationships: never;
    includes: 'group';
    related: {
        group: 'group';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** group that manages this location */
        group: { vertex: 'group'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Membership}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/membership
 */
export interface MembershipSchema {
    type: 'Membership';
    attributes: {
        /** The date and time the person joined the group. */
        joined_at: string | null;
        /**
         * The role of the person in the group.
         * Possible values: `member` or `leader`
         */
        role: string | null;
    };
    relationships: 'group' | 'person';
    includes: 'person';
    related: {
        group: 'group';
        person: 'person';
    };
    where: {
        role: string;
    };
    whereOps: {};
    order: 'first_name' | 'joined_at' | 'last_name' | 'role';
    create: {
        /** The date and time the person joined the group. */
        joined_at?: string | null;
        person_id?: string;
        /**
         * The role of the person in the group.
         * Possible values: `member` or `leader`
         */
        role?: string | null;
    };
    update: {
        /** The date and time the person joined the group. */
        joined_at?: string | null;
        /**
         * The role of the person in the group.
         * Possible values: `member` or `leader`
         */
        role?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        /** group for this membership */
        group: { vertex: 'group'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        /** The name of the organization. */
        name: string | null;
        /** The time zone of the organization. */
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
 * Type-level schema of {@link Owner}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/owner
 */
export interface OwnerSchema {
    type: 'Owner';
    attributes: {
        /** The URL of the person's avatar. */
        avatar_url: string | null;
        /** The person's first name. */
        first_name: string | null;
        /** The person's last name. */
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
 * Type-level schema of {@link Person}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        /** Returns all the addresses associated with this person. */
        addresses: unknown[] | null;
        /** The URL of the person's avatar. */
        avatar_url: string | null;
        /**
         * Whether or not the person is under 13 years old.
         * This is false if a birthdate is not set.
         *
         *
         * Only available when requested with the `?fields` param
         */
        child: boolean | null;
        /** Date and time this person was first created in Planning Center */
        created_at: string | null;
        /**
         * Returns all the email addresses associated with this person.
         *
         * ```json
         * [{
         *   "address": "sam@example.com",
         *   "location": "Home",
         *   "primary": true
         * }]
         * ```
         */
        email_addresses: unknown[] | null;
        /** The person's first name. */
        first_name: string | null;
        /** The person's gender (e.g. `Male`, `Female`). */
        gender: string | null;
        /** The person's last name. */
        last_name: string | null;
        /**
         * Can be `administrator`, `group_type_manager`, `leader`, `member`, or `no access`.
         */
        permissions: string | null;
        /**
         * Returns all the phone numbers associated with this person.
         *
         * ```json
         * [{
         *   "number": "(800) 123-4567",
         *   "carrier": null,
         *   "location": "Mobile",
         *   "primary": true
         * }]
         * ```
         */
        phone_numbers: unknown[] | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        first_name: string;
        last_name: string;
    };
    whereOps: {};
    order: 'first_name' | 'last_name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** events of groups which this person is a member */
        events: { vertex: 'event'; many: true; filters: 'canceled' | 'not_canceled'; create: false };
        /** groups of which this person is a member */
        groups: { vertex: 'group'; many: true; filters: never; create: false };
        /** memberships for this person */
        memberships: { vertex: 'membership'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Resource}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/resource
 */
export interface ResourceSchema {
    type: 'Resource';
    attributes: {
        /** The description of the resource written by the person who created it. */
        description: string | null;
        /** The date and time the resource was last updated. */
        last_updated: string | null;
        /** The name/title of the resource. */
        name: string | null;
        /** Either `FileResource` or `LinkResource` */
        type: string | null;
        /** Possible values: `leaders` or `members` */
        visibility: string | null;
    };
    relationships: 'created_by';
    includes: never;
    related: {
        created_by: 'person';
    };
    where: {};
    whereOps: {};
    order: 'last_updated' | 'name' | 'pinned';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** link to download this file resource */
        download: { vertex: 'resource'; many: true; filters: never; create: false };
        /** link to visit this link resource */
        visit: { vertex: 'resource'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link RSVP}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/rsvp
 */
export interface RSVPSchema {
    type: 'RSVP';
    attributes: {
        /**
         * The number of guests the person is bringing. Always `0` unless the response is `yes` or `maybe`.
         */
        guest_count: number | null;
        /** Possible values: `awaiting_response`, `yes`, `no`, `maybe`, or `not_sent` */
        response: string | null;
    };
    relationships: 'event' | 'group' | 'person';
    includes: never;
    related: {
        event: 'event';
        group: 'group';
        person: 'person';
    };
    where: {
        response: string;
    };
    whereOps: {};
    order: 'response';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Tag}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/tag
 */
export interface TagSchema {
    type: 'Tag';
    attributes: {
        /** The name of the tag */
        name: string | null;
        /** The position of the tag in relation to other tags */
        position: number | null;
    };
    relationships: 'tag_group';
    includes: never;
    related: {
        tag_group: 'tag_group';
    };
    where: {
        id: string;
        name: string;
    };
    whereOps: {};
    order: 'name' | 'position';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** groups which have applied this tag */
        groups: { vertex: 'group'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link TagGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/tag_group
 */
export interface TagGroupSchema {
    type: 'TagGroup';
    attributes: {
        /** Whether or not this tag group is visible to the public on Church Center */
        display_publicly: boolean | null;
        /** Whether or not a group can belong to many tags within this tag group */
        multiple_options_enabled: boolean | null;
        /** The name of the tag group */
        name: string | null;
        /** The position of the tag group in relation to other tag groups */
        position: number | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        name: string;
    };
    whereOps: {};
    order: 'name' | 'position';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        /** tags belonging to this tag group */
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Planning Center Groups resource, keyed by vertex id. */
export type GroupsSchema = {
    attendance: AttendanceSchema;
    campus: CampusSchema;
    enrollment: EnrollmentSchema;
    event: EventSchema;
    event_note: EventNoteSchema;
    group: GroupSchema;
    group_application: GroupApplicationSchema;
    group_type: GroupTypeSchema;
    location: LocationSchema;
    membership: MembershipSchema;
    organization: OrganizationSchema;
    owner: OwnerSchema;
    person: PersonSchema;
    resource: ResourceSchema;
    rsvp: RSVPSchema;
    tag: TagSchema;
    tag_group: TagGroupSchema;
};

/** Edges available from the product root (`/groups/v2`). */
export type GroupsRoot = {
    /** campuses for this organization */
    campuses: { vertex: 'campus'; many: true; filters: never; create: false };
    /** event notes for all groups in this organization */
    event_notes: { vertex: 'event_note'; many: true; filters: never; create: false };
    /** events for all groups in this organization */
    events: { vertex: 'event'; many: true; filters:
        | 'campus'
        | 'canceled'
        | 'group'
        | 'group_type'
        | 'my_groups'
        | 'not_canceled'
        | 'upcoming'; create: false };
    /** requests to join groups for this organization */
    group_applications: { vertex: 'group_application'; many: true; filters: never; create: false };
    /** group types for this organization */
    group_types: { vertex: 'group_type'; many: true; filters: 'church_center_visible' | 'not_church_center_visible'; create: false };
    /** groups for this organization */
    groups: { vertex: 'group'; many: true; filters:
        | 'campus'
        | 'enrollment'
        | 'group'
        | 'group_type'
        | 'hidden'
        | 'meeting_schedule'
        | 'my_groups'
        | 'people_database_searchable'
        | 'published'
        | 'tag'; create: false };
    /** memberships for all groups in this organization */
    memberships: { vertex: 'membership'; many: true; filters: 'group' | 'leader'; create: false };
    /** people for this organization */
    people: { vertex: 'person'; many: true; filters: never; create: false };
    /** tag groups in this organization */
    tag_groups: { vertex: 'tag_group'; many: true; filters: 'public'; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<GroupsSchema>, AssertRoot<GroupsRoot>];

/**
 * Individual event attendance for a person.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/attendance
 */
export type Attendance = PcoResource<AttendanceSchema>;
/**
 * Attributes of {@link Attendance}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/attendance
 */
export type AttendanceAttributes = AttendanceSchema['attributes'];

/**
 * A campus as defined in Planning Center Accounts
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/campus
 */
export type Campus = PcoResource<CampusSchema>;
/**
 * Attributes of {@link Campus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/campus
 */
export type CampusAttributes = CampusSchema['attributes'];

/**
 * Details on how and when members can join a `Group`.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/enrollment
 */
export type Enrollment = PcoResource<EnrollmentSchema>;
/**
 * Attributes of {@link Enrollment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/enrollment
 */
export type EnrollmentAttributes = EnrollmentSchema['attributes'];

/**
 * An event is a meeting of a group. It has a start and end time, and can be
 * either physical or virtual.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/event
 */
export type Event = PcoResource<EventSchema>;
/**
 * Attributes of {@link Event}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/event
 */
export type EventAttributes = EventSchema['attributes'];

/**
 * Notes that group leaders can write for an event, generally related to attendance.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/event_note
 */
export type EventNote = PcoResource<EventNoteSchema>;
/**
 * Attributes of {@link EventNote}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/event_note
 */
export type EventNoteAttributes = EventNoteSchema['attributes'];

/**
 * A group of people that meet together regularly.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group
 */
export type Group = PcoResource<GroupSchema>;
/**
 * Attributes of {@link Group}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group
 */
export type GroupAttributes = GroupSchema['attributes'];

/**
 * A group application is a request to join a group which can be approved or rejected.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group_application
 */
export type GroupApplication = PcoResource<GroupApplicationSchema>;
/**
 * Attributes of {@link GroupApplication}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group_application
 */
export type GroupApplicationAttributes = GroupApplicationSchema['attributes'];

/**
 * A group type is a category of groups.
 * For example, a church might have group types for "Small Groups" and "Classes".
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group_type
 */
export type GroupType = PcoResource<GroupTypeSchema>;
/**
 * Attributes of {@link GroupType}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/group_type
 */
export type GroupTypeAttributes = GroupTypeSchema['attributes'];

/**
 * A physical event location
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/location
 */
export type Location = PcoResource<LocationSchema>;
/**
 * Attributes of {@link Location}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/location
 */
export type LocationAttributes = LocationSchema['attributes'];

/**
 * The state of a `Person` belonging to a `Group`.
 *
 * A `Person` can only have one active `Membership` to a `Group` at a time.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/membership
 */
export type Membership = PcoResource<MembershipSchema>;
/**
 * Attributes of {@link Membership}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/membership
 */
export type MembershipAttributes = MembershipSchema['attributes'];

/**
 * The organization represents a single church. Every other resource is scoped to this record.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * The owner/creator of an event note.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/owner
 */
export type Owner = PcoResource<OwnerSchema>;
/**
 * Attributes of {@link Owner}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/owner
 */
export type OwnerAttributes = OwnerSchema['attributes'];

/**
 * A person is a user of Planning Center.
 * They can be a member of a group, a leader of a group, or an administrator.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A file or link resource that can be shared with a group.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/resource
 */
export type Resource = PcoResource<ResourceSchema>;
/**
 * Attributes of {@link Resource}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/resource
 */
export type ResourceAttributes = ResourceSchema['attributes'];

/**
 * A person's RSVP response for a group event.
 * RSVPs can be submitted at any point leading up to the event.
 * When an event reminder is sent, `awaiting_response` RSVPs are generated for
 * any remaining members, or `not_sent` if they're missing an email address.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/rsvp
 */
export type RSVP = PcoResource<RSVPSchema>;
/**
 * Attributes of {@link RSVP}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/rsvp
 */
export type RSVPAttributes = RSVPSchema['attributes'];

/**
 * Tags are used to filter groups.
 * They can be organized into tag_groups.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/tag
 */
export type Tag = PcoResource<TagSchema>;
/**
 * Attributes of {@link Tag}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/tag
 */
export type TagAttributes = TagSchema['attributes'];

/**
 * A way to group related tags.
 * For example you could have a "Life Stage" tag group
 * with tags like "Child", "Teen", "Adult", etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/tag_group
 */
export type TagGroup = PcoResource<TagGroupSchema>;
/**
 * Attributes of {@link TagGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/groups/versions/2023-07-10/vertices/tag_group
 */
export type TagGroupAttributes = TagGroupSchema['attributes'];
