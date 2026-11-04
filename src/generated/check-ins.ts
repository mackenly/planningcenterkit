/**
 * Planning Center Check-Ins API (`/check-ins/v2`).
 *
 * Generated from the Planning Center API documentation, version 2025-05-28, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Check-Ins: paths and capabilities only. */
export const checkInsGraph = {
    product: 'checkIns',
    slug: 'check-ins',
    basePath: '/check-ins/v2',
    version: '2025-05-28',
    rootVertex: 'organization',
    root: {
        check_ins: { vertex: 'check_in', many: true, canCreate: false },
        event_times: { vertex: 'event_time', many: true, canCreate: false },
        events: { vertex: 'event', many: true, canCreate: false },
        headcounts: { vertex: 'headcount', many: true, canCreate: false },
        integration_links: { vertex: 'integration_link', many: true, canCreate: false },
        labels: { vertex: 'label', many: true, canCreate: false },
        options: { vertex: 'option', many: true, canCreate: false },
        passes: { vertex: 'pass', many: true, canCreate: false },
        people: { vertex: 'person', many: true, canCreate: false },
        stations: { vertex: 'station', many: true, canCreate: false },
        themes: { vertex: 'theme', many: true, canCreate: false },
    },
    vertices: {
        attendance_type: {
            type: 'AttendanceType',
            edges: {
                event: { vertex: 'event', many: true, canCreate: false },
                headcounts: { vertex: 'headcount', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        check_in: {
            type: 'CheckIn',
            edges: {
                check_in_group: { vertex: 'check_in_group', many: true, canCreate: false },
                check_in_times: { vertex: 'check_in_time', many: true, canCreate: false },
                checked_in_at: { vertex: 'station', many: true, canCreate: false },
                checked_in_by: { vertex: 'person', many: true, canCreate: false },
                checked_out_by: { vertex: 'person', many: true, canCreate: false },
                event: { vertex: 'event', many: true, canCreate: false },
                event_period: { vertex: 'event_period', many: true, canCreate: false },
                event_times: { vertex: 'event_time', many: true, canCreate: false },
                locations: { vertex: 'location', many: true, canCreate: false },
                options: { vertex: 'option', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/check_ins',
        },
        check_in_group: {
            type: 'CheckInGroup',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event_period: { vertex: 'event_period', many: true, canCreate: false },
                print_station: { vertex: 'station', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        check_in_time: {
            type: 'CheckInTime',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event: {
            type: 'Event',
            edges: {
                attendance_types: { vertex: 'attendance_type', many: true, canCreate: false },
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                current_event_times: { vertex: 'event_time', many: true, canCreate: false },
                event_labels: { vertex: 'event_label', many: true, canCreate: false },
                event_periods: { vertex: 'event_period', many: true, canCreate: false },
                integration_links: { vertex: 'integration_link', many: true, canCreate: false },
                locations: { vertex: 'location', many: true, canCreate: false },
                person_events: { vertex: 'person_event', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/events',
        },
        event_label: {
            type: 'EventLabel',
            edges: {
                event: { vertex: 'event', many: true, canCreate: false },
                label: { vertex: 'label', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event_period: {
            type: 'EventPeriod',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event: { vertex: 'event', many: true, canCreate: false },
                event_times: { vertex: 'event_time', many: true, canCreate: false },
                location_event_periods: { vertex: 'location_event_period', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        event_time: {
            type: 'EventTime',
            edges: {
                available_locations: { vertex: 'location', many: true, canCreate: false },
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event: { vertex: 'event', many: true, canCreate: false },
                event_period: { vertex: 'event_period', many: true, canCreate: false },
                headcounts: { vertex: 'headcount', many: true, canCreate: false },
                location_event_times: { vertex: 'location_event_time', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/event_times',
        },
        headcount: {
            type: 'Headcount',
            edges: {
                attendance_type: { vertex: 'attendance_type', many: true, canCreate: false },
                event_time: { vertex: 'event_time', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/headcounts',
        },
        integration_link: {
            type: 'IntegrationLink',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/integration_links',
        },
        label: {
            type: 'Label',
            edges: {
                event_labels: { vertex: 'event_label', many: true, canCreate: false },
                location_labels: { vertex: 'location_label', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/labels',
        },
        location: {
            type: 'Location',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event: { vertex: 'event', many: true, canCreate: false },
                integration_links: { vertex: 'integration_link', many: true, canCreate: false },
                location_event_periods: { vertex: 'location_event_period', many: true, canCreate: false },
                location_event_times: { vertex: 'location_event_time', many: true, canCreate: false },
                location_labels: { vertex: 'location_label', many: true, canCreate: false },
                locations: { vertex: 'location', many: true, canCreate: false },
                options: { vertex: 'option', many: true, canCreate: false },
                parent: { vertex: 'location', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        location_event_period: {
            type: 'LocationEventPeriod',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event_period: { vertex: 'event_period', many: true, canCreate: false },
                location: { vertex: 'location', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        location_event_time: {
            type: 'LocationEventTime',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event_time: { vertex: 'event_time', many: true, canCreate: false },
                location: { vertex: 'location', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        location_label: {
            type: 'LocationLabel',
            edges: {
                label: { vertex: 'label', many: true, canCreate: false },
                location: { vertex: 'location', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        option: {
            type: 'Option',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                label: { vertex: 'label', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/options',
        },
        organization: {
            type: 'Organization',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        pass: {
            type: 'Pass',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/passes',
        },
        person: {
            type: 'Person',
            edges: {
                check_ins: { vertex: 'check_in', many: true, canCreate: false },
                organization: { vertex: 'organization', many: true, canCreate: false },
                passes: { vertex: 'pass', many: true, canCreate: false },
                person_events: { vertex: 'person_event', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/people',
        },
        person_event: {
            type: 'PersonEvent',
            edges: {
                event: { vertex: 'event', many: true, canCreate: false },
                first_check_in: { vertex: 'check_in', many: true, canCreate: false },
                last_check_in: { vertex: 'check_in', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        pre_check: {
            type: 'PreCheck',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        roster_list_person: {
            type: 'RosterListPerson',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        station: {
            type: 'Station',
            edges: {
                check_in_groups: { vertex: 'check_in_group', many: true, canCreate: false },
                checked_in_at_check_ins: { vertex: 'check_in', many: true, canCreate: false },
                event: { vertex: 'event', many: true, canCreate: false },
                location: { vertex: 'location', many: true, canCreate: false },
                print_station: { vertex: 'station', many: true, canCreate: false },
                theme: { vertex: 'theme', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/stations',
        },
        theme: {
            type: 'Theme',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/check-ins/v2/themes',
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link AttendanceType}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/attendance_type
 */
export interface AttendanceTypeSchema {
    type: 'AttendanceType';
    attributes: {
        color: string | null;
        created_at: string | null;
        limit: number | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: 'event';
    includes: 'event';
    related: {
        event: 'event';
    };
    where: {
        id: string;
        name: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event: { vertex: 'event'; many: true; filters: never; create: false };
        headcounts: { vertex: 'headcount'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link CheckIn}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in
 */
export interface CheckInSchema {
    type: 'CheckIn';
    attributes: {
        checked_out_at: string | null;
        confirmed_at: string | null;
        created_at: string | null;
        emergency_contact_name: string | null;
        emergency_contact_phone_number: string | null;
        first_name: string | null;
        kind: string | null;
        last_name: string | null;
        medical_notes: string | null;
        number: number | null;
        one_time_guest: boolean | null;
        security_code: string | null;
        updated_at: string | null;
    };
    relationships: 'event_period' | 'person';
    includes:
        | 'check_in_times'
        | 'checked_in_at'
        | 'checked_in_by'
        | 'checked_out_by'
        | 'event'
        | 'event_period'
        | 'event_times'
        | 'locations'
        | 'options'
        | 'person';
    related: {
        check_in_times: 'check_in_time';
        checked_in_at: 'station';
        checked_in_by: 'person';
        checked_out_by: 'person';
        event: 'event';
        event_period: 'event_period';
        event_times: 'event_time';
        locations: 'location';
        options: 'option';
        person: 'person';
    };
    where: {
        account_center_person_id: string | number;
        created_at: string | Date;
        security_code: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'checked_out_at'
        | 'created_at'
        | 'first_name'
        | 'last_name'
        | 'number'
        | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_in_group: { vertex: 'check_in_group'; many: true; filters: never; create: false };
        check_in_times: { vertex: 'check_in_time'; many: true; filters: never; create: false };
        checked_in_at: { vertex: 'station'; many: true; filters: never; create: false };
        checked_in_by: { vertex: 'person'; many: true; filters: never; create: false };
        checked_out_by: { vertex: 'person'; many: true; filters: never; create: false };
        event: { vertex: 'event'; many: true; filters: never; create: false };
        event_period: { vertex: 'event_period'; many: true; filters: never; create: false };
        event_times: { vertex: 'event_time'; many: true; filters: never; create: false };
        locations: { vertex: 'location'; many: true; filters: never; create: false };
        options: { vertex: 'option'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link CheckInGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in_group
 */
export interface CheckInGroupSchema {
    type: 'CheckInGroup';
    attributes: {
        check_ins_count: number | null;
        created_at: string | null;
        name_labels_count: number | null;
        /**
         * Possible values:
         *   - `ready`: This group isn't printed or canceled yet
         *   - `printed`: This group was successfully printed at a station
         *   - `canceled`: This group was canceled at a station
         *   - `skipped`: This group had no labels to print, so it was never printed.
         */
        print_status: string | null;
        security_labels_count: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'check_ins' | 'event_period' | 'print_station';
    related: {
        check_ins: 'check_in';
        event_period: 'event_period';
        print_station: 'station';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_ins: { vertex: 'check_in'; many: true; filters: never; create: false };
        event_period: { vertex: 'event_period'; many: true; filters: never; create: false };
        print_station: { vertex: 'station'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link CheckInTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in_time
 */
export interface CheckInTimeSchema {
    type: 'CheckInTime';
    attributes: {
        alerts: unknown[] | null;
        has_validated: boolean | null;
        kind: string | null;
        services_integrated: boolean | null;
    };
    relationships: 'check_in' | 'event_time' | 'location' | 'pre_check';
    includes: never;
    related: {
        check_in: 'check_in';
        event_time: 'event_time';
        location: 'location';
        pre_check: 'pre_check';
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
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event
 */
export interface EventSchema {
    type: 'Event';
    attributes: {
        /** Only available when requested with the `?fields` param */
        app_source: string | null;
        archived_at: string | null;
        created_at: string | null;
        enable_services_integration: boolean | null;
        frequency: string | null;
        integration_key: string | null;
        location_times_enabled: boolean | null;
        name: string | null;
        pre_select_enabled: boolean | null;
        updated_at: string | null;
    };
    relationships: 'campuses';
    includes: 'attendance_types';
    related: {
        attendance_types: 'attendance_type';
    };
    where: {
        id: string;
        name: string;
    };
    whereOps: {};
    order: 'created_at' | 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        attendance_types: { vertex: 'attendance_type'; many: true; filters: never; create: false };
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        current_event_times: { vertex: 'event_time'; many: true; filters: never; create: false };
        event_labels: { vertex: 'event_label'; many: true; filters: never; create: false };
        event_periods: { vertex: 'event_period'; many: true; filters: never; create: false };
        integration_links: { vertex: 'integration_link'; many: true; filters: never; create: false };
        locations: { vertex: 'location'; many: true; filters: 'locations' | 'root'; create: false };
        person_events: { vertex: 'person_event'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventLabel}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_label
 */
export interface EventLabelSchema {
    type: 'EventLabel';
    attributes: {
        created_at: string | null;
        for_guest: boolean | null;
        for_regular: boolean | null;
        for_volunteer: boolean | null;
        quantity: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'event' | 'label';
    related: {
        event: 'event';
        label: 'label';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event: { vertex: 'event'; many: true; filters: never; create: false };
        label: { vertex: 'label'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventPeriod}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_period
 */
export interface EventPeriodSchema {
    type: 'EventPeriod';
    attributes: {
        created_at: string | null;
        ends_at: string | null;
        guest_count: number | null;
        note: string | null;
        regular_count: number | null;
        starts_at: string | null;
        /**
         * Deduplicated people with a Guest check-in.
         *
         * Only available when requested with the `?fields` param
         */
        unique_guest_count: number | null;
        /**
         * Deduplicated people with a Regular check-in.
         *
         * Only available when requested with the `?fields` param
         */
        unique_regular_count: number | null;
        /**
         * Deduplicated people with any check-in.
         *
         * Only available when requested with the `?fields` param
         */
        unique_total_count: number | null;
        /**
         * Deduplicated people with a Volunteer check-in.
         *
         * Only available when requested with the `?fields` param
         */
        unique_volunteer_count: number | null;
        updated_at: string | null;
        volunteer_count: number | null;
    };
    relationships: 'event';
    includes: 'event' | 'event_times';
    related: {
        event: 'event';
        event_times: 'event_time';
    };
    where: {
        ends_at: string | Date;
        starts_at: string | Date;
    };
    whereOps: {
        ends_at: 'gt' | 'gte' | 'lt' | 'lte';
        starts_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'starts_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        event: { vertex: 'event'; many: true; filters: never; create: false };
        event_times: { vertex: 'event_time'; many: true; filters: 'available'; create: false };
        location_event_periods: { vertex: 'location_event_period'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EventTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_time
 */
export interface EventTimeSchema {
    type: 'EventTime';
    attributes: {
        created_at: string | null;
        day_of_week: number | null;
        guest_count: number | null;
        hides_at: string | null;
        hour: number | null;
        minute: number | null;
        name: string | null;
        regular_count: number | null;
        shows_at: string | null;
        starts_at: string | null;
        total_count: number | null;
        updated_at: string | null;
        volunteer_count: number | null;
    };
    relationships: 'event' | 'event_period';
    includes: 'event' | 'event_period' | 'headcounts';
    related: {
        event: 'event';
        event_period: 'event_period';
        headcounts: 'headcount';
    };
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'shows_at' | 'starts_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        available_locations: { vertex: 'location'; many: true; filters: never; create: false };
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        event: { vertex: 'event'; many: true; filters: never; create: false };
        event_period: { vertex: 'event_period'; many: true; filters: never; create: false };
        headcounts: { vertex: 'headcount'; many: true; filters: never; create: false };
        location_event_times: { vertex: 'location_event_time'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Headcount}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/headcount
 */
export interface HeadcountSchema {
    type: 'Headcount';
    attributes: {
        created_at: string | null;
        total: number | null;
        updated_at: string | null;
    };
    relationships: 'attendance_type' | 'event_time';
    includes: 'attendance_type' | 'event_time';
    related: {
        attendance_type: 'attendance_type';
        event_time: 'event_time';
    };
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'total' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        attendance_type: { vertex: 'attendance_type'; many: true; filters: never; create: false };
        event_time: { vertex: 'event_time'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link IntegrationLink}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/integration_link
 */
export interface IntegrationLinkSchema {
    type: 'IntegrationLink';
    attributes: {
        remote_app: string | null;
        /**
         * The Global ID for the external resource. Formatted as `gid://<app>/<type>/<id>`.
         */
        remote_gid: string | null;
        remote_id: string | null;
        remote_type: string | null;
        sync_future_assignment_types: boolean | null;
    };
    relationships: 'local';
    includes: never;
    related: {
        local: 'event';
    };
    where: {
        remote_gid: string;
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
 * Type-level schema of {@link Label}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/label
 */
export interface LabelSchema {
    type: 'Label';
    attributes: {
        created_at: string | null;
        name: string | null;
        prints_for: string | null;
        roll: string | null;
        updated_at: string | null;
        xml: string | null;
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
        event_labels: { vertex: 'event_label'; many: true; filters: never; create: false };
        location_labels: { vertex: 'location_label'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Location}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location
 */
export interface LocationSchema {
    type: 'Location';
    attributes: {
        age_max_in_months: number | null;
        age_min_in_months: number | null;
        age_on: string | null;
        age_range_by: string | null;
        attendees_per_volunteer: number | null;
        child_or_adult: string | null;
        created_at: string | null;
        effective_date: string | null;
        gender: string | null;
        grade_max: number | null;
        grade_min: number | null;
        kind: string | null;
        max_occupancy: number | null;
        milestone: string | null;
        min_volunteers: number | null;
        name: string | null;
        opened: boolean | null;
        position: number | null;
        questions: string | null;
        updated_at: string | null;
    };
    relationships: 'parent';
    includes: 'event' | 'locations' | 'options' | 'parent';
    related: {
        event: 'event';
        locations: 'location';
        options: 'option';
        parent: 'location';
    };
    where: {};
    whereOps: {};
    order: 'kind' | 'name' | 'position';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        event: { vertex: 'event'; many: true; filters: never; create: false };
        integration_links: { vertex: 'integration_link'; many: true; filters: never; create: false };
        location_event_periods: { vertex: 'location_event_period'; many: true; filters: never; create: false };
        location_event_times: { vertex: 'location_event_time'; many: true; filters: never; create: false };
        location_labels: { vertex: 'location_label'; many: true; filters: never; create: false };
        locations: { vertex: 'location'; many: true; filters: never; create: false };
        options: { vertex: 'option'; many: true; filters: never; create: false };
        parent: { vertex: 'location'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link LocationEventPeriod}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_event_period
 */
export interface LocationEventPeriodSchema {
    type: 'LocationEventPeriod';
    attributes: {
        created_at: string | null;
        guest_count: number | null;
        regular_count: number | null;
        updated_at: string | null;
        volunteer_count: number | null;
    };
    relationships: never;
    includes: 'event_period' | 'location';
    related: {
        event_period: 'event_period';
        location: 'location';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        event_period: { vertex: 'event_period'; many: true; filters: never; create: false };
        location: { vertex: 'location'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link LocationEventTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_event_time
 */
export interface LocationEventTimeSchema {
    type: 'LocationEventTime';
    attributes: {
        created_at: string | null;
        guest_count: number | null;
        regular_count: number | null;
        updated_at: string | null;
        volunteer_count: number | null;
    };
    relationships: never;
    includes: 'event_time' | 'location';
    related: {
        event_time: 'event_time';
        location: 'location';
    };
    where: {
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
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        event_time: { vertex: 'event_time'; many: true; filters: never; create: false };
        location: { vertex: 'location'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link LocationLabel}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_label
 */
export interface LocationLabelSchema {
    type: 'LocationLabel';
    attributes: {
        created_at: string | null;
        for_guest: boolean | null;
        for_regular: boolean | null;
        for_volunteer: boolean | null;
        quantity: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'label' | 'location';
    related: {
        label: 'label';
        location: 'location';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        label: { vertex: 'label'; many: true; filters: never; create: false };
        location: { vertex: 'location'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Option}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/option
 */
export interface OptionSchema {
    type: 'Option';
    attributes: {
        body: string | null;
        created_at: string | null;
        quantity: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'label';
    related: {
        label: 'label';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_ins: { vertex: 'check_in'; many: true; filters: never; create: false };
        label: { vertex: 'label'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        avatar_url: string | null;
        created_at: string | null;
        daily_check_ins: number | null;
        date_format_pattern: string | null;
        name: string | null;
        time_zone: string | null;
        updated_at: string | null;
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
 * Type-level schema of {@link Pass}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/pass
 */
export interface PassSchema {
    type: 'Pass';
    attributes: {
        code: string | null;
        created_at: string | null;
        /**
         * Possible values: `barcode` or `pkpass`.
         *
         * Using the `pkpass` value creates a mobile pass and sends an email to the associated person.
         */
        kind: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'person';
    related: {
        person: 'person';
    };
    where: {
        code: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Person}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        addresses: unknown[] | null;
        avatar_url: string | null;
        birthdate: string | null;
        check_in_count: number | null;
        child: boolean | null;
        created_at: string | null;
        demographic_avatar_url: string | null;
        email_addresses: unknown[] | null;
        first_name: string | null;
        gender: string | null;
        grade: number | null;
        headcounter: boolean | null;
        ignore_filters: boolean | null;
        last_checked_in_at: string | null;
        last_name: string | null;
        medical_notes: string | null;
        middle_name: string | null;
        name: string | null;
        name_prefix: string | null;
        name_suffix: string | null;
        passed_background_check: boolean | null;
        permission: string | null;
        phone_numbers: unknown[] | null;
        top_permission: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'organization';
    related: {
        organization: 'organization';
    };
    where: {
        headcounter: boolean;
        ignore_filters: boolean;
        permission: string;
        search_name: string;
    };
    whereOps: {};
    order: 'check_in_count' | 'first_name' | 'last_checked_in_at' | 'last_name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        organization: { vertex: 'organization'; many: true; filters: never; create: false };
        passes: { vertex: 'pass'; many: true; filters: never; create: false };
        person_events: { vertex: 'person_event'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PersonEvent}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/person_event
 */
export interface PersonEventSchema {
    type: 'PersonEvent';
    attributes: {
        check_in_count: number | null;
        created_at: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'event' | 'first_check_in' | 'last_check_in' | 'person';
    related: {
        event: 'event';
        first_check_in: 'check_in';
        last_check_in: 'check_in';
        person: 'person';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        event: { vertex: 'event'; many: true; filters: never; create: false };
        first_check_in: { vertex: 'check_in'; many: true; filters: never; create: false };
        last_check_in: { vertex: 'check_in'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PreCheck}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/pre_check
 */
export interface PreCheckSchema {
    type: 'PreCheck';
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
 * Type-level schema of {@link RosterListPerson}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/roster_list_person
 */
export interface RosterListPersonSchema {
    type: 'RosterListPerson';
    attributes: {
        birthdate: string | null;
        demographic_avatar_url: string | null;
        first_name: string | null;
        gender: string | null;
        grade: string | null;
        ignore_filters: boolean | null;
        last_name: string | null;
        medical_notes: string | null;
        name: string | null;
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
 * Type-level schema of {@link Station}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/station
 */
export interface StationSchema {
    type: 'Station';
    attributes: {
        /** Only available when requested with the `?fields` param */
        check_in_count: number | null;
        /** Only available when requested with the `?fields` param */
        closes_at: string | null;
        created_at: string | null;
        /** Possible values: `scanner` or `keypad` */
        input_type: string | null;
        /** Possible values: `all_input_types`, `only_keypad`, or `only_scanner` */
        input_type_options: string | null;
        mode: number | null;
        name: string | null;
        /** Only available when requested with the `?fields` param */
        next_shows_at: string | null;
        /** Only available when requested with the `?fields` param */
        online: boolean | null;
        /** Only available when requested with the `?fields` param */
        open_for_check_in: boolean | null;
        /** Only available when requested with the `?fields` param */
        seconds_until_closes_at: number | null;
        /** Only available when requested with the `?fields` param */
        seconds_until_next_shows_at: number | null;
        timeout_seconds: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'event' | 'location' | 'print_station' | 'theme';
    related: {
        event: 'event';
        location: 'location';
        print_station: 'station';
        theme: 'theme';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        check_in_groups: { vertex: 'check_in_group'; many: true; filters: 'canceled' | 'printed' | 'ready' | 'skipped'; create: false };
        checked_in_at_check_ins: { vertex: 'check_in'; many: true; filters:
            | 'attendee'
            | 'checked_out'
            | 'first_time'
            | 'guest'
            | 'not_checked_out'
            | 'not_one_time_guest'
            | 'one_time_guest'
            | 'regular'
            | 'volunteer'; create: false };
        event: { vertex: 'event'; many: true; filters: never; create: false };
        location: { vertex: 'location'; many: true; filters: never; create: false };
        print_station: { vertex: 'station'; many: true; filters: never; create: false };
        theme: { vertex: 'theme'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Theme}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/theme
 */
export interface ThemeSchema {
    type: 'Theme';
    attributes: {
        background_color: string | null;
        color: string | null;
        created_at: string | null;
        image: string | null;
        image_thumbnail: string | null;
        mode: string | null;
        name: string | null;
        text_color: string | null;
        updated_at: string | null;
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

/** Type-level schema of every Planning Center Check-Ins resource, keyed by vertex id. */
export type CheckInsSchema = {
    attendance_type: AttendanceTypeSchema;
    check_in: CheckInSchema;
    check_in_group: CheckInGroupSchema;
    check_in_time: CheckInTimeSchema;
    event: EventSchema;
    event_label: EventLabelSchema;
    event_period: EventPeriodSchema;
    event_time: EventTimeSchema;
    headcount: HeadcountSchema;
    integration_link: IntegrationLinkSchema;
    label: LabelSchema;
    location: LocationSchema;
    location_event_period: LocationEventPeriodSchema;
    location_event_time: LocationEventTimeSchema;
    location_label: LocationLabelSchema;
    option: OptionSchema;
    organization: OrganizationSchema;
    pass: PassSchema;
    person: PersonSchema;
    person_event: PersonEventSchema;
    pre_check: PreCheckSchema;
    roster_list_person: RosterListPersonSchema;
    station: StationSchema;
    theme: ThemeSchema;
};

/** Edges available from the product root (`/check-ins/v2`). */
export type CheckInsRoot = {
    check_ins: { vertex: 'check_in'; many: true; filters:
        | 'attendee'
        | 'checked_out'
        | 'first_time'
        | 'guest'
        | 'not_checked_out'
        | 'not_one_time_guest'
        | 'one_time_guest'
        | 'regular'
        | 'volunteer'; create: false };
    event_times: { vertex: 'event_time'; many: true; filters: never; create: false };
    events: { vertex: 'event'; many: true; filters:
        | 'archived'
        | 'for_campus'
        | 'for_headcounts'
        | 'for_registrations'
        | 'not_archived'; create: false };
    headcounts: { vertex: 'headcount'; many: true; filters: never; create: false };
    integration_links: { vertex: 'integration_link'; many: true; filters: never; create: false };
    labels: { vertex: 'label'; many: true; filters: never; create: false };
    options: { vertex: 'option'; many: true; filters: never; create: false };
    passes: { vertex: 'pass'; many: true; filters: never; create: false };
    people: { vertex: 'person'; many: true; filters: never; create: false };
    stations: { vertex: 'station'; many: true; filters: never; create: false };
    themes: { vertex: 'theme'; many: true; filters: never; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<CheckInsSchema>, AssertRoot<CheckInsRoot>];

/**
 * A kind of attendee which is tracked by _headcount_, not by check-in.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/attendance_type
 */
export type AttendanceType = PcoResource<AttendanceTypeSchema>;
/**
 * Attributes of {@link AttendanceType}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/attendance_type
 */
export type AttendanceTypeAttributes = AttendanceTypeSchema['attributes'];

/**
 * An attendance record for an event.
 *
 * If someone was checked out, `checked_out_at` will be present.
 *
 * You can scope check-ins in a few ways:
 *
 * - `regular`s, `guest`s, and `volunteer`s correspond to the option selected when checking in.
 * - `attendee`s are `regular`s and `guest`s together.
 * - `one_time_guest`s are check-ins which were created without a corresponding person record.
 * - `not_one_time_guest`s are check-ins which had a corresponding person record when they were created.
 * - `checked_out` are check-ins where `checked_out_at` is present (meaning they were checked out from a station).
 * - `first_time`s are check-ins which are the person's first for a given event. (Label-only visitors are not included here.)
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in
 */
export type CheckIn = PcoResource<CheckInSchema>;
/**
 * Attributes of {@link CheckIn}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in
 */
export type CheckInAttributes = CheckInSchema['attributes'];

/**
 * When one or more people check in, they're grouped in a `CheckInGroup`.
 * These check-ins all have the same "checked-in by" person.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in_group
 */
export type CheckInGroup = PcoResource<CheckInGroupSchema>;
/**
 * Attributes of {@link CheckInGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in_group
 */
export type CheckInGroupAttributes = CheckInGroupSchema['attributes'];

/**
 * A CheckInTime combines an EventTime and a Location, and associates it with
 * the parent CheckIn.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in_time
 */
export type CheckInTime = PcoResource<CheckInTimeSchema>;
/**
 * Attributes of {@link CheckInTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/check_in_time
 */
export type CheckInTimeAttributes = CheckInTimeSchema['attributes'];

/**
 * A recurring event which people may attend.
 *
 * Each recurrence is an _event period_ (which often corresponds to a week).
 *
 * Event periods have _event times_ where people may actually check in.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event
 */
export type Event = PcoResource<EventSchema>;
/**
 * Attributes of {@link Event}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event
 */
export type EventAttributes = EventSchema['attributes'];

/**
 * Says how many of a given label to print for this event and
 * whether to print it for regulars, guests, and/or volunteers.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_label
 */
export type EventLabel = PcoResource<EventLabelSchema>;
/**
 * Attributes of {@link EventLabel}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_label
 */
export type EventLabelAttributes = EventLabelSchema['attributes'];

/**
 * A recurrence of an event, sometimes called a "session".
 * For weekly events, an event period is a week. For daily events, an event period is a day.
 * An event period has event times, which is what people select
 * when they actually check in. When new sessions are created, times
 * are copied from one session to the next.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_period
 */
export type EventPeriod = PcoResource<EventPeriodSchema>;
/**
 * Attributes of {@link EventPeriod}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_period
 */
export type EventPeriodAttributes = EventPeriodSchema['attributes'];

/**
 * A time that someone may check in. Times are copied from session to session.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_time
 */
export type EventTime = PcoResource<EventTimeSchema>;
/**
 * Attributes of {@link EventTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/event_time
 */
export type EventTimeAttributes = EventTimeSchema['attributes'];

/**
 * A tally of attendees for a given event time and attendance type.
 * If one does not exist, the count may have been zero.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/headcount
 */
export type Headcount = PcoResource<HeadcountSchema>;
/**
 * Attributes of {@link Headcount}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/headcount
 */
export type HeadcountAttributes = HeadcountSchema['attributes'];

/**
 * A record linking another product's resource to a Check-Ins resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/integration_link
 */
export type IntegrationLink = PcoResource<IntegrationLinkSchema>;
/**
 * Attributes of {@link IntegrationLink}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/integration_link
 */
export type IntegrationLinkAttributes = IntegrationLinkSchema['attributes'];

/**
 * Labels can be set to print for events (through `EventLabel`s),
 * locations (through `LocationLabel`s) or options.
 * Label type (security label / name label) is expressed with the
 * `prints_for` attribute. `prints_for="Person"` is a name label,
 * `prints_for="Group"` is a security label.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/label
 */
export type Label = PcoResource<LabelSchema>;
/**
 * Attributes of {@link Label}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/label
 */
export type LabelAttributes = LabelSchema['attributes'];

/**
 * A place where people may check in to for a given event.
 * Some locations have `kind="Folder"`, which means that people
 * can't check-in here, but this location contains other locations.
 * You can get its contents from the `locations` attribute.
 * You can get a location's parent folder from the `parent` attribute.
 * (If it's not in a folder, `parent` will be empty.)
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location
 */
export type Location = PcoResource<LocationSchema>;
/**
 * Attributes of {@link Location}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location
 */
export type LocationAttributes = LocationSchema['attributes'];

/**
 * Counts check-ins for a location during a certain event period.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_event_period
 */
export type LocationEventPeriod = PcoResource<LocationEventPeriodSchema>;
/**
 * Attributes of {@link LocationEventPeriod}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_event_period
 */
export type LocationEventPeriodAttributes = LocationEventPeriodSchema['attributes'];

/**
 * Counts check-ins for a location for a given event time.
 * This is useful for checking occupancy.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_event_time
 */
export type LocationEventTime = PcoResource<LocationEventTimeSchema>;
/**
 * Attributes of {@link LocationEventTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_event_time
 */
export type LocationEventTimeAttributes = LocationEventTimeSchema['attributes'];

/**
 * Says how many of a given label to print for this location and
 * whether to print it for regulars, guests, and/or volunteers.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_label
 */
export type LocationLabel = PcoResource<LocationLabelSchema>;
/**
 * Attributes of {@link LocationLabel}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/location_label
 */
export type LocationLabelAttributes = LocationLabelSchema['attributes'];

/**
 * An option which an attendee may select when checking in.
 *
 * Options may have extra labels associated with them, denoted by `label` and `quantity`.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/option
 */
export type Option = PcoResource<OptionSchema>;
/**
 * Attributes of {@link Option}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/option
 */
export type OptionAttributes = OptionSchema['attributes'];

/**
 * An organization which has people and events.
 * This contains its date format & time zone preferences.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * Enables quick lookup of a person via barcode reader.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/pass
 */
export type Pass = PcoResource<PassSchema>;
/**
 * Attributes of {@link Pass}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/pass
 */
export type PassAttributes = PassSchema['attributes'];

/**
 * An attendee, volunteer or administrator.
 *
 * _Usually_, a person who checked in will be present as a `Person`. In some cases, they may not be present:
 * - The person was manually deleted from the admin interface
 * - The check-in was created as a "Visitor - Label Only" (which doesn't create a corresponding person record)
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * Counts a person's attendence for a given event.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/person_event
 */
export type PersonEvent = PcoResource<PersonEventSchema>;
/**
 * Attributes of {@link PersonEvent}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/person_event
 */
export type PersonEventAttributes = PersonEventSchema['attributes'];

/**
 * A PreCheck resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/pre_check
 */
export type PreCheck = PcoResource<PreCheckSchema>;
/**
 * Attributes of {@link PreCheck}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/pre_check
 */
export type PreCheckAttributes = PreCheckSchema['attributes'];

/**
 * A RosterListPerson resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/roster_list_person
 */
export type RosterListPerson = PcoResource<RosterListPersonSchema>;
/**
 * Attributes of {@link RosterListPerson}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/roster_list_person
 */
export type RosterListPersonAttributes = RosterListPersonSchema['attributes'];

/**
 * A device where people can be checked in.
 * A device may also be connected to a printer
 * and print labels for itself or other stations.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/station
 */
export type Station = PcoResource<StationSchema>;
/**
 * Attributes of {@link Station}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/station
 */
export type StationAttributes = StationSchema['attributes'];

/**
 * A custom style which may be applied to stations.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/theme
 */
export type Theme = PcoResource<ThemeSchema>;
/**
 * Attributes of {@link Theme}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/check-ins/versions/2025-05-28/vertices/theme
 */
export type ThemeAttributes = ThemeSchema['attributes'];
