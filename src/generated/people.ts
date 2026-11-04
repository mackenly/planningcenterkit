/**
 * Planning Center People API (`/people/v2`).
 *
 * Generated from the Planning Center API documentation, version 2026-10-05, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center People: paths and capabilities only. */
export const peopleGraph = {
    product: 'people',
    slug: 'people',
    basePath: '/people/v2',
    version: '2026-10-05',
    rootVertex: 'organization',
    root: {
        addresses: { vertex: 'address', many: true, canCreate: false },
        apps: { vertex: 'app', many: true, canCreate: false },
        background_checks: { vertex: 'background_check', many: true, canCreate: false },
        birthday_people: { vertex: 'birthday_people', many: true, canCreate: false },
        campuses: { vertex: 'campus', many: true, canCreate: true },
        carriers: { vertex: 'carrier', many: true, canCreate: false },
        emails: { vertex: 'email', many: true, canCreate: false },
        field_data: { vertex: 'field_datum', many: true, canCreate: false },
        field_definitions: { vertex: 'field_definition', many: true, canCreate: false },
        form_categories: { vertex: 'form_category', many: true, canCreate: true },
        forms: { vertex: 'form', many: true, canCreate: false },
        households: { vertex: 'household', many: true, canCreate: true },
        inactive_reasons: { vertex: 'inactive_reason', many: true, canCreate: true },
        list_categories: { vertex: 'list_category', many: true, canCreate: true },
        lists: { vertex: 'list', many: true, canCreate: false },
        marital_statuses: { vertex: 'marital_status', many: true, canCreate: true },
        me: { vertex: 'person', many: false, canCreate: false },
        membership_types: { vertex: 'membership_type', many: true, canCreate: true },
        message_groups: { vertex: 'message_group', many: true, canCreate: false },
        messages: { vertex: 'message', many: true, canCreate: false },
        name_prefixes: { vertex: 'name_prefix', many: true, canCreate: true },
        name_suffixes: { vertex: 'name_suffix', many: true, canCreate: true },
        note_categories: { vertex: 'note_category', many: true, canCreate: true },
        note_category_subscriptions: { vertex: 'note_category_subscription', many: true, canCreate: false },
        notes: { vertex: 'note', many: true, canCreate: false },
        people: { vertex: 'person', many: true, canCreate: true },
        people_imports: { vertex: 'people_import', many: true, canCreate: false },
        person_mergers: { vertex: 'person_merger', many: true, canCreate: false },
        phone_numbers: { vertex: 'phone_number', many: true, canCreate: false },
        reports: { vertex: 'report', many: true, canCreate: true },
        school_options: { vertex: 'school_option', many: true, canCreate: true },
        social_profiles: { vertex: 'social_profile', many: true, canCreate: false },
        spam_email_addresses: { vertex: 'spam_email_address', many: true, canCreate: false },
        stats: { vertex: 'organization_statistics', many: true, canCreate: false },
        tabs: { vertex: 'tab', many: true, canCreate: true },
        workflow_assignee_summaries: { vertex: 'workflow_assignee_summary', many: true, canCreate: false },
        workflows: { vertex: 'workflow', many: true, canCreate: true },
    },
    vertices: {
        address: {
            type: 'Address',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/addresses',
        },
        app: {
            type: 'App',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/apps',
        },
        background_check: {
            type: 'BackgroundCheck',
            edges: {
                created_by: { vertex: 'person', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/background_checks',
        },
        birthday_people: {
            type: 'BirthdayPeople',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        campus: {
            type: 'Campus',
            edges: {
                lists: { vertex: 'list', many: true, canCreate: false },
                service_times: { vertex: 'service_time', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/campuses',
        },
        carrier: {
            type: 'Carrier',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        condition: {
            type: 'Condition',
            edges: {
                created_by: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        connected_person: {
            type: 'ConnectedPerson',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        custom_sender: {
            type: 'CustomSender',
            edges: {},
            actions: ['send_verification'],
            canUpdate: false,
            canDelete: false,
        },
        email: {
            type: 'Email',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/emails',
        },
        field_datum: {
            type: 'FieldDatum',
            edges: {
                field_definition: { vertex: 'field_definition', many: true, canCreate: false },
                field_option: { vertex: 'field_option', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
                tab: { vertex: 'tab', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/field_data',
        },
        field_definition: {
            type: 'FieldDefinition',
            edges: {
                field_options: { vertex: 'field_option', many: true, canCreate: true },
                tab: { vertex: 'tab', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/field_definitions',
        },
        field_option: {
            type: 'FieldOption',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        form: {
            type: 'Form',
            edges: {
                campus: { vertex: 'campus', many: true, canCreate: false },
                category: { vertex: 'form_category', many: true, canCreate: false },
                fields: { vertex: 'form_field', many: true, canCreate: false },
                form_submissions: { vertex: 'form_submission', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/forms',
        },
        form_category: {
            type: 'FormCategory',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/form_categories',
        },
        form_field: {
            type: 'FormField',
            edges: {
                form_field_conditions: { vertex: 'form_field_condition', many: true, canCreate: true },
                options: { vertex: 'form_field_option', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        form_field_condition: {
            type: 'FormFieldCondition',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        form_field_option: {
            type: 'FormFieldOption',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        form_submission: {
            type: 'FormSubmission',
            edges: {
                form: { vertex: 'form', many: true, canCreate: false },
                form_fields: { vertex: 'form_field', many: true, canCreate: false },
                form_submission_values: { vertex: 'form_submission_value', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        form_submission_value: {
            type: 'FormSubmissionValue',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        grade: {
            type: 'Grade',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        household: {
            type: 'Household',
            edges: {
                household_memberships: { vertex: 'household_membership', many: true, canCreate: true },
                people: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/households',
        },
        household_membership: {
            type: 'HouseholdMembership',
            edges: {
                household: { vertex: 'household', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        inactive_reason: {
            type: 'InactiveReason',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/inactive_reasons',
        },
        list: {
            type: 'List',
            edges: {
                campus: { vertex: 'campus', many: true, canCreate: false },
                category: { vertex: 'list_category', many: true, canCreate: false },
                created_by: { vertex: 'person', many: true, canCreate: false },
                list_results: { vertex: 'list_result', many: true, canCreate: false },
                mailchimp_sync_status: { vertex: 'mailchimp_sync_status', many: true, canCreate: false },
                people: { vertex: 'person', many: true, canCreate: false },
                rules: { vertex: 'rule', many: true, canCreate: false },
                shares: { vertex: 'list_share', many: true, canCreate: true },
                star: { vertex: 'list_star', many: false, canCreate: true },
                updated_by: { vertex: 'person', many: true, canCreate: false },
            },
            actions: ['mailchimp_sync', 'run'],
            canUpdate: true,
            canDelete: false,
            canonicalPath: '/people/v2/lists',
        },
        list_category: {
            type: 'ListCategory',
            edges: {
                lists: { vertex: 'list', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/list_categories',
        },
        list_result: {
            type: 'ListResult',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        list_share: {
            type: 'ListShare',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        list_star: {
            type: 'ListStar',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: true,
        },
        mailchimp_sync_status: {
            type: 'MailchimpSyncStatus',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        marital_status: {
            type: 'MaritalStatus',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/marital_statuses',
        },
        membership_type: {
            type: 'MembershipType',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/membership_types',
        },
        message: {
            type: 'Message',
            edges: {
                message_group: { vertex: 'message_group', many: true, canCreate: false },
                to: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/messages',
        },
        message_group: {
            type: 'MessageGroup',
            edges: {
                app: { vertex: 'app', many: true, canCreate: false },
                from: { vertex: 'person', many: true, canCreate: false },
                messages: { vertex: 'message', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/message_groups',
        },
        name_prefix: {
            type: 'NamePrefix',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/name_prefixes',
        },
        name_suffix: {
            type: 'NameSuffix',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/name_suffixes',
        },
        note: {
            type: 'Note',
            edges: {
                category: { vertex: 'note_category', many: true, canCreate: false },
                created_by: { vertex: 'person', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/notes',
        },
        note_category: {
            type: 'NoteCategory',
            edges: {
                shares: { vertex: 'note_category_share', many: true, canCreate: true },
                subscribers: { vertex: 'person', many: true, canCreate: false },
                subscriptions: { vertex: 'note_category_subscription', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/note_categories',
        },
        note_category_share: {
            type: 'NoteCategoryShare',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        note_category_subscription: {
            type: 'NoteCategorySubscription',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/note_category_subscriptions',
        },
        organization: {
            type: 'Organization',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        organization_statistics: {
            type: 'OrganizationStatistics',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        people_import: {
            type: 'PeopleImport',
            edges: {
                conflicts: { vertex: 'people_import_conflict', many: true, canCreate: false },
                histories: { vertex: 'people_import_history', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/people_imports',
        },
        people_import_conflict: {
            type: 'PeopleImportConflict',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        people_import_history: {
            type: 'PeopleImportHistory',
            edges: {
                household: { vertex: 'household', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        person: {
            type: 'Person',
            edges: {
                addresses: { vertex: 'address', many: true, canCreate: true },
                apps: { vertex: 'app', many: true, canCreate: false },
                background_checks: { vertex: 'background_check', many: true, canCreate: true },
                connected_people: { vertex: 'connected_person', many: true, canCreate: false },
                emails: { vertex: 'email', many: true, canCreate: true },
                field_data: { vertex: 'field_datum', many: true, canCreate: true },
                household_memberships: { vertex: 'household_membership', many: true, canCreate: false },
                households: { vertex: 'household', many: true, canCreate: false },
                inactive_reason: { vertex: 'inactive_reason', many: true, canCreate: false },
                marital_status: { vertex: 'marital_status', many: true, canCreate: false },
                message_groups: { vertex: 'message_group', many: true, canCreate: false },
                messages: { vertex: 'message', many: true, canCreate: false },
                name_prefix: { vertex: 'name_prefix', many: true, canCreate: false },
                name_suffix: { vertex: 'name_suffix', many: true, canCreate: false },
                notes: { vertex: 'note', many: true, canCreate: true },
                organization: { vertex: 'organization', many: true, canCreate: false },
                person_apps: { vertex: 'person_app', many: true, canCreate: true },
                phone_numbers: { vertex: 'phone_number', many: true, canCreate: true },
                platform_notifications: { vertex: 'platform_notification', many: true, canCreate: false },
                primary_campus: { vertex: 'campus', many: true, canCreate: false },
                school: { vertex: 'school_option', many: true, canCreate: false },
                social_profiles: { vertex: 'social_profile', many: true, canCreate: true },
                workflow_assignee_workflow_summaries: { vertex: 'workflow_assignee_workflow_summary', many: true, canCreate: false },
                workflow_cards: { vertex: 'workflow_card', many: true, canCreate: false },
                workflow_shares: { vertex: 'workflow_share', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/people',
        },
        person_app: {
            type: 'PersonApp',
            edges: {
                app: { vertex: 'app', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        person_merger: {
            type: 'PersonMerger',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/person_mergers',
        },
        phone_number: {
            type: 'PhoneNumber',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/phone_numbers',
        },
        platform_notification: {
            type: 'PlatformNotification',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        report: {
            type: 'Report',
            edges: {
                created_by: { vertex: 'person', many: true, canCreate: false },
                updated_by: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/reports',
        },
        rule: {
            type: 'Rule',
            edges: {
                conditions: { vertex: 'condition', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        school_option: {
            type: 'SchoolOption',
            edges: {
                promotes_to_school: { vertex: 'school_option', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/school_options',
        },
        service_time: {
            type: 'ServiceTime',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        social_profile: {
            type: 'SocialProfile',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/social_profiles',
        },
        spam_email_address: {
            type: 'SpamEmailAddress',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/spam_email_addresses',
        },
        tab: {
            type: 'Tab',
            edges: {
                field_definitions: { vertex: 'field_definition', many: true, canCreate: true },
                field_options: { vertex: 'field_option', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/tabs',
        },
        workflow: {
            type: 'Workflow',
            edges: {
                cards: { vertex: 'workflow_card', many: true, canCreate: true },
                category: { vertex: 'workflow_category', many: true, canCreate: false },
                shared_people: { vertex: 'person', many: true, canCreate: false },
                shares: { vertex: 'workflow_share', many: true, canCreate: true },
                steps: { vertex: 'workflow_step', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/people/v2/workflows',
        },
        workflow_assignee_summary: {
            type: 'WorkflowAssigneeSummary',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/people/v2/workflow_assignee_summaries',
        },
        workflow_assignee_workflow_summary: {
            type: 'WorkflowAssigneeWorkflowSummary',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        workflow_card: {
            type: 'WorkflowCard',
            edges: {
                activities: { vertex: 'workflow_card_activity', many: true, canCreate: false },
                assignee: { vertex: 'person', many: true, canCreate: false },
                current_step: { vertex: 'workflow_step', many: true, canCreate: false },
                notes: { vertex: 'workflow_card_note', many: true, canCreate: true },
                person: { vertex: 'person', many: true, canCreate: false },
                workflow: { vertex: 'workflow', many: true, canCreate: false },
            },
            actions: ['go_back', 'promote', 'remove', 'restore', 'send_email', 'skip_step', 'snooze', 'unsnooze'],
            canUpdate: true,
            canDelete: true,
        },
        workflow_card_activity: {
            type: 'WorkflowCardActivity',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: true,
        },
        workflow_card_note: {
            type: 'WorkflowCardNote',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        workflow_category: {
            type: 'WorkflowCategory',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        workflow_share: {
            type: 'WorkflowShare',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        workflow_step: {
            type: 'WorkflowStep',
            edges: {
                assignee_summaries: { vertex: 'workflow_step_assignee_summary', many: true, canCreate: false },
                default_assignee: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        workflow_step_assignee_summary: {
            type: 'WorkflowStepAssigneeSummary',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Address}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/address
 */
export interface AddressSchema {
    type: 'Address';
    attributes: {
        city: string | null;
        country_code: string | null;
        country_name: string | null;
        created_at: string | null;
        location: string | null;
        primary: boolean | null;
        state: string | null;
        street_line_1: string | null;
        street_line_2: string | null;
        updated_at: string | null;
        zip: string | null;
    };
    relationships: 'person';
    includes: never;
    related: {
        person: 'person';
    };
    where: {
        city: string;
        country_code: string;
        location: string;
        primary: boolean;
        state: string;
        street_line_1: string;
        street_line_2: string;
        zip: string;
    };
    whereOps: {};
    order:
        | 'city'
        | 'country_code'
        | 'created_at'
        | 'location'
        | 'primary'
        | 'state'
        | 'street_line_1'
        | 'street_line_2'
        | 'updated_at'
        | 'zip';
    create: {
        city?: string | null;
        country_code?: string | null;
        location?: string | null;
        primary?: boolean | null;
        state?: string | null;
        street_line_1?: string | null;
        street_line_2?: string | null;
        zip?: string | null;
    };
    update: {
        city?: string | null;
        country_code?: string | null;
        location?: string | null;
        primary?: boolean | null;
        state?: string | null;
        street_line_1?: string | null;
        street_line_2?: string | null;
        zip?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link App}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/app
 */
export interface AppSchema {
    type: 'App';
    attributes: {
        name: string | null;
        url: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        name: string;
        url: string;
    };
    whereOps: {};
    order: 'name' | 'url';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link BackgroundCheck}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/background_check
 */
export interface BackgroundCheckSchema {
    type: 'BackgroundCheck';
    attributes: {
        /**
         * Returns `null` until background check reaches a completed status. When creating completed background checks, leave blank to use current date and time.
         */
        completed_at: string | null;
        current: boolean | null;
        /** Leave blank to use organization's expiration policy */
        expires_on: string | null;
        note: string | null;
        /**
         * Must be an absolute, percent-encoded `http` or `https` URL. This URL should require authentication
         */
        report_url: string | null;
        /**
         * Possible values: `awaiting_applicant`, `expired_invitation`, `report_processing`, `needs_review`, `complete_clear`, `complete_not_clear`, `canceled`
         */
        status: string | null;
        status_updated_at: string | null;
    };
    relationships: 'created_by' | 'person';
    includes: 'created_by' | 'person';
    related: {
        created_by: 'person';
        person: 'person';
    };
    where: {
        expires_on: string | Date;
        status_updated_at: string | Date;
    };
    whereOps: {
        expires_on: 'gt' | 'gte' | 'lt' | 'lte';
        status_updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'expires_on' | 'status_updated_at';
    create: {
        /**
         * Returns `null` until background check reaches a completed status. When creating completed background checks, leave blank to use current date and time.
         */
        completed_at?: string | null;
        /** Leave blank to use organization's expiration policy */
        expires_on?: string | null;
        note?: string | null;
        /**
         * Must be an absolute, percent-encoded `http` or `https` URL. This URL should require authentication
         */
        report_url?: string | null;
        /**
         * Possible values: `awaiting_applicant`, `expired_invitation`, `report_processing`, `needs_review`, `complete_clear`, `complete_not_clear`, `canceled`
         */
        status?: string | null;
    };
    update: {
        /** Leave blank to use organization's expiration policy */
        expires_on?: string | null;
        note?: string | null;
        /**
         * Must be an absolute, percent-encoded `http` or `https` URL. This URL should require authentication
         */
        report_url?: string | null;
        /**
         * Possible values: `awaiting_applicant`, `expired_invitation`, `report_processing`, `needs_review`, `complete_clear`, `complete_not_clear`, `canceled`
         */
        status?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link BirthdayPeople}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/birthday_people
 */
export interface BirthdayPeopleSchema {
    type: 'BirthdayPeople';
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
 * Type-level schema of {@link Campus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/campus
 */
export interface CampusSchema {
    type: 'Campus';
    attributes: {
        church_center_enabled: boolean | null;
        city: string | null;
        contact_email_address: string | null;
        country: string | null;
        created_at: string | null;
        date_format: number | null;
        description: string | null;
        geolocation_set_manually: boolean | null;
        latitude: number | null;
        longitude: number | null;
        name: string | null;
        phone_number: string | null;
        state: string | null;
        street: string | null;
        time_zone: string | null;
        /** Only available when requested with the `?fields` param */
        time_zone_raw: string | null;
        twenty_four_hour_time: boolean | null;
        updated_at: string | null;
        website: string | null;
        zip: string | null;
    };
    relationships: 'organization';
    includes: 'lists' | 'service_times';
    related: {
        lists: 'list';
        organization: 'organization';
        service_times: 'service_time';
    };
    where: {
        created_at: string | Date;
        id: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'name' | 'updated_at';
    create: {
        church_center_enabled?: boolean | null;
        city?: string | null;
        contact_email_address?: string | null;
        country?: string | null;
        date_format?: number | null;
        description?: string | null;
        geolocation_set_manually?: boolean | null;
        latitude?: number | null;
        longitude?: number | null;
        name?: string | null;
        phone_number?: string | null;
        state?: string | null;
        street?: string | null;
        time_zone?: string | null;
        twenty_four_hour_time?: boolean | null;
        website?: string | null;
        zip?: string | null;
    };
    update: {
        church_center_enabled?: boolean | null;
        city?: string | null;
        contact_email_address?: string | null;
        country?: string | null;
        date_format?: number | null;
        description?: string | null;
        geolocation_set_manually?: boolean | null;
        latitude?: number | null;
        longitude?: number | null;
        name?: string | null;
        phone_number?: string | null;
        state?: string | null;
        street?: string | null;
        time_zone?: string | null;
        twenty_four_hour_time?: boolean | null;
        website?: string | null;
        zip?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        lists: { vertex: 'list'; many: true; filters: never; create: false };
        service_times: { vertex: 'service_time'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link Carrier}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/carrier
 */
export interface CarrierSchema {
    type: 'Carrier';
    attributes: {
        international: boolean | null;
        name: string | null;
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'international' | 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Condition}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/condition
 */
export interface ConditionSchema {
    type: 'Condition';
    attributes: {
        application: string | null;
        comparison: string | null;
        created_at: string | null;
        definition_class: string | null;
        definition_identifier: string | null;
        description: string | null;
        settings: string | null;
        updated_at: string | null;
    };
    relationships: 'created_by';
    includes: 'created_by';
    related: {
        created_by: 'person';
    };
    where: {
        application: string;
        comparison: string;
        created_at: string | Date;
        definition_class: string;
        definition_identifier: string;
        description: string;
        settings: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'application'
        | 'comparison'
        | 'created_at'
        | 'definition_class'
        | 'definition_identifier'
        | 'description'
        | 'settings'
        | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ConnectedPerson}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/connected_person
 */
export interface ConnectedPersonSchema {
    type: 'ConnectedPerson';
    attributes: {
        first_name: string | null;
        gender: string | null;
        given_name: string | null;
        last_name: string | null;
        middle_name: string | null;
        nickname: string | null;
        organization_id: string | null;
        organization_name: string | null;
    };
    relationships: 'organization';
    includes: never;
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
    edges: {};
}

/**
 * Type-level schema of {@link CustomSender}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/custom_sender
 */
export interface CustomSenderSchema {
    type: 'CustomSender';
    attributes: {
        created_at: string | null;
        email_address: string | null;
        expired: boolean | null;
        name: string | null;
        updated_at: string | null;
        verification_requested_at: string | null;
        verification_status: string | null;
        verified: boolean | null;
        verified_at: string | null;
    };
    relationships: 'custom_sender_shares';
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'created_at' | 'name' | 'updated_at' | 'verification_requested_at' | 'verified_at';
    create: {};
    update: {};
    delete: false;
    actions: 'send_verification';
    edges: {};
}

/**
 * Type-level schema of {@link Email}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/email
 */
export interface EmailSchema {
    type: 'Email';
    attributes: {
        address: string | null;
        blocked: boolean | null;
        created_at: string | null;
        location: string | null;
        primary: boolean | null;
        updated_at: string | null;
        verified: boolean | null;
    };
    relationships: 'person';
    includes: never;
    related: {
        person: 'person';
    };
    where: {
        address: string;
        blocked: boolean;
        created_at: string | Date;
        location: string;
        primary: boolean;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'address' | 'created_at' | 'location' | 'primary' | 'updated_at';
    create: {
        address?: string | null;
        location?: string | null;
        primary?: boolean | null;
    };
    update: {
        address?: string | null;
        location?: string | null;
        primary?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link FieldDatum}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_datum
 */
export interface FieldDatumSchema {
    type: 'FieldDatum';
    attributes: {
        created_at: string | null;
        file: string | null;
        file_content_type: string | null;
        file_name: string | null;
        file_size: number | null;
        updated_at: string | null;
        value: string | null;
    };
    relationships: 'customizable' | 'field_definition';
    includes: 'field_definition' | 'field_option' | 'tab';
    related: {
        field_definition: 'field_definition';
        field_option: 'field_option';
        tab: 'tab';
    };
    where: {
        created_at: string | Date;
        field_definition_id: string | number;
        file: string;
        file_content_type: string;
        file_name: string;
        file_size: number;
        updated_at: string | Date;
        value: string;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'created_at'
        | 'file'
        | 'file_content_type'
        | 'file_name'
        | 'file_size'
        | 'updated_at'
        | 'value';
    create: {
        field_definition_id?: string;
        value?: string | null;
    };
    update: {
        field_definition_id?: string;
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        field_definition: { vertex: 'field_definition'; many: true; filters: never; create: false };
        field_option: { vertex: 'field_option'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
        tab: { vertex: 'tab'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link FieldDefinition}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_definition
 */
export interface FieldDefinitionSchema {
    type: 'FieldDefinition';
    attributes: {
        config: string | null;
        data_type: string | null;
        deleted_at: string | null;
        name: string | null;
        sequence: number | null;
        slug: string | null;
        tab_id: string | null;
    };
    relationships: 'tab';
    includes: 'field_options' | 'tab';
    related: {
        field_options: 'field_option';
        tab: 'tab';
    };
    where: {
        config: string;
        data_type: string;
        deleted_at: string | Date;
        name: string;
        sequence: number;
        slug: string;
        tab_id: string;
    };
    whereOps: {
        deleted_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'config' | 'data_type' | 'deleted_at' | 'name' | 'sequence' | 'slug' | 'tab_id';
    create: {
        config?: string | null;
        data_type?: string | null;
        deleted_at?: string | null;
        name?: string | null;
        sequence?: number | null;
        slug?: string | null;
    };
    update: {
        config?: string | null;
        data_type?: string | null;
        deleted_at?: string | null;
        name?: string | null;
        sequence?: number | null;
        slug?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        field_options: { vertex: 'field_option'; many: true; filters: never; create: true };
        tab: { vertex: 'tab'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link FieldOption}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_option
 */
export interface FieldOptionSchema {
    type: 'FieldOption';
    attributes: {
        sequence: number | null;
        value: string | null;
    };
    relationships: 'field_definition';
    includes: never;
    related: {
        field_definition: 'field_definition';
    };
    where: {
        sequence: number;
        value: string;
    };
    whereOps: {};
    order: 'sequence' | 'value';
    create: {
        sequence?: number | null;
        value?: string | null;
    };
    update: {
        sequence?: number | null;
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Form}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form
 */
export interface FormSchema {
    type: 'Form';
    attributes: {
        active: boolean | null;
        /** Only available if the 'Submit for household member' feature is enabled. */
        allow_submitting_for_household_members: boolean | null;
        archived: boolean | null;
        archived_at: string | null;
        can_manage: boolean | null;
        created_at: string | null;
        deleted_at: string | null;
        description: string | null;
        login_required: boolean | null;
        name: string | null;
        public_url: string | null;
        recently_viewed: boolean | null;
        send_submission_notification_to_submitter: boolean | null;
        submission_count: number | null;
        updated_at: string | null;
    };
    relationships: 'campus' | 'form_category';
    includes: 'campus' | 'category';
    related: {
        campus: 'campus';
        category: 'form_category';
        form_category: 'form_category';
    };
    where: {
        active: boolean;
        id: string;
    };
    whereOps: {};
    order:
        | 'active'
        | 'archived_at'
        | 'campus'
        | 'category'
        | 'created_at'
        | 'deleted_at'
        | 'description'
        | 'name'
        | 'recently_viewed'
        | 'submission_count'
        | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        campus: { vertex: 'campus'; many: true; filters: never; create: false };
        category: { vertex: 'form_category'; many: true; filters: never; create: false };
        fields: { vertex: 'form_field'; many: true; filters: never; create: false };
        form_submissions: { vertex: 'form_submission'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link FormCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_category
 */
export interface FormCategorySchema {
    type: 'FormCategory';
    attributes: {
        created_at: string | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
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
    create: {
        name?: string | null;
    };
    update: {
        name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link FormField}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field
 */
export interface FormFieldSchema {
    type: 'FormField';
    attributes: {
        created_at: string | null;
        description: string | null;
        /**
         * Possible values: `string`, `text`, `checkboxes`, `dropdown`, `date`, `phone_number`, `address`, `birthday`, `gender`, `custom_field`, `note`, `workflow`, `heading`, `number`, `boolean`, `file`, `medical`, `workflow_checkbox`, `workflow_checkboxes`, `workflow_dropdown`, `marital_status`, `anniversary`, `grade`, `primary_campus`, `school`, or `household`
         */
        field_type: string | null;
        label: string | null;
        required: boolean | null;
        sequence: number | null;
        settings: string | null;
        updated_at: string | null;
    };
    relationships: 'fieldable' | 'form' | 'form_field_conditions' | 'options';
    includes: 'form_field_conditions' | 'options';
    related: {
        form: 'form';
        form_field_conditions: 'form_field_condition';
        options: 'form_field_option';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'sequence' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        form_field_conditions: { vertex: 'form_field_condition'; many: true; filters: never; create: true };
        options: { vertex: 'form_field_option'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link FormFieldCondition}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field_condition
 */
export interface FormFieldConditionSchema {
    type: 'FormFieldCondition';
    attributes: {
        created_at: string | null;
        /**
         * Set when the condition is triggered by a specific text value (e.g. a boolean custom field) instead of a `trigger_form_field_option`.
         */
        trigger_form_field_option_value: string | null;
        updated_at: string | null;
    };
    relationships: 'form_field' | 'trigger_form_field' | 'trigger_form_field_option';
    includes: never;
    related: {
        form_field: 'form_field';
        trigger_form_field: 'form_field';
        trigger_form_field_option: 'form_field_option';
    };
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'updated_at';
    create: {
        form_field_id?: string;
        trigger_form_field_id?: string;
        trigger_form_field_option_id?: string;
        /**
         * Set when the condition is triggered by a specific text value (e.g. a boolean custom field) instead of a `trigger_form_field_option`.
         */
        trigger_form_field_option_value?: string | null;
    };
    update: {
        form_field_id?: string;
        trigger_form_field_id?: string;
        trigger_form_field_option_id?: string;
        /**
         * Set when the condition is triggered by a specific text value (e.g. a boolean custom field) instead of a `trigger_form_field_option`.
         */
        trigger_form_field_option_value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link FormFieldOption}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field_option
 */
export interface FormFieldOptionSchema {
    type: 'FormFieldOption';
    attributes: {
        created_at: string | null;
        label: string | null;
        sequence: number | null;
        updated_at: string | null;
    };
    relationships: 'form_field' | 'optionable';
    includes: never;
    related: {
        form_field: 'form_field';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'sequence' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link FormSubmission}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_submission
 */
export interface FormSubmissionSchema {
    type: 'FormSubmission';
    attributes: {
        created_at: string | null;
        /**
         * Only available when requested with the `?fields` param
         *
         * True if the form has fields requiring verification (contact info or household) and the submission is for an existing, untrusted person. Use `?fields[FormSubmission]=requires_verification` to opt into this attribute.
         */
        requires_verification: boolean | null;
        /** Only available when requested with the `?fields` param */
        selected_options_by_field: Record<string, unknown> | null;
        updated_at: string | null;
        /**
         * True once the submitter has confirmed any verification-required answers. Auto-set to true when the submission creates a brand-new person; otherwise false until the submitter clicks the verification email.
         */
        verified: boolean | null;
    };
    relationships: 'form' | 'person';
    includes: 'form' | 'form_fields' | 'form_submission_values' | 'person';
    related: {
        form: 'form';
        form_fields: 'form_field';
        form_submission_values: 'form_submission_value';
        person: 'person';
    };
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'person.first_name' | 'person.last_name' | 'updated_at';
    create: {
        person_id?: string;
    };
    update: {};
    delete: false;
    actions: never;
    edges: {
        form: { vertex: 'form'; many: true; filters: never; create: false };
        form_fields: { vertex: 'form_field'; many: true; filters: never; create: false };
        form_submission_values: { vertex: 'form_submission_value'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link FormSubmissionValue}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_submission_value
 */
export interface FormSubmissionValueSchema {
    type: 'FormSubmissionValue';
    attributes: {
        attachments: unknown[] | null;
        display_value: string | null;
        /**
         * Write-only. Accepted when creating a submission and never returned.
         *
         * The submitted answer. The shape depends on the parent `FormField`'s `field_type`:
         *
         * - **string, text, number, note, medical**: the literal value as a string
         * - **date, birthday, anniversary**: an ISO 8601 date as a string
         * - **boolean**: `"true"` or `"false"`
         * - **gender, marital_status, school, primary_campus**: the option's id as a string (look up via `/people/v2/genders`, `/people/v2/marital_statuses`, `/people/v2/school_options`, `/people/v2/campuses`)
         * - **grade**: the grade number as a string, such as `"3"`
         * - **checkboxes, dropdown, workflow_checkbox, workflow_checkboxes, workflow_dropdown**: the `FormFieldOption` id as a string, not the option's text. A `checkboxes` or `workflow_checkboxes` field takes one `included` `FormSubmissionValue` per selected option. To answer the field's Other option, send `{ "other": "…" }` instead. For the `workflow_*` types, submitting the answer creates a `WorkflowCard` in the linked workflow.
         * - **phone_number**: an object like `{ "number": "555-555-1234", "location": "Mobile" }`. `location` defaults to `"Mobile"` when omitted.
         * - **address**: an object like `{ "location": "Home", "street": "123 Main St", "city": "Carlsbad", "state": "CA", "zip": "92008", "country_code": "US" }`. `location` defaults to `"Home"` when omitted. `street` is a single string, not the `street_line_1`/`street_line_2` pair the `Address` resource uses; put `\n` before a second line. `country_code` is an uppercase ISO 3166-1 alpha-2 code. When the field is required, every property except `location` must be filled in.
         * - **file**: an array of `{ "fileID": "us4-…", "fileName": "waiver.pdf" }` objects. Each object must have exactly those two keys and no others. `fileID` is the full id returned by the upload service, including its datacenter prefix (see "Uploading files" above). Single-file fields accept one object; fields whose `settings.multiple_files` is true accept up to 5. Each file may be at most 10 MB, and common executable and script file types are rejected. The `fileName` key is required, but its value is ignored: the stored file keeps the name it was uploaded with.
         * - **custom_field**: follows the linked `FieldDefinition`'s `data_type` — usually a string, or the file array above when `data_type` is `file`.
         *
         * The example value shown here is a placeholder — the real shape depends on the field's `field_type`.
         */
        value: string | null;
    };
    relationships: 'form_field' | 'form_field_option' | 'form_submission';
    includes: never;
    related: {
        form_field: 'form_field';
        form_field_option: 'form_field_option';
        form_submission: 'form_submission';
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
 * Type-level schema of {@link Grade}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/grade
 */
export interface GradeSchema {
    type: 'Grade';
    attributes: {
        key: number | null;
        value: string | null;
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
 * Type-level schema of {@link Household}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/household
 */
export interface HouseholdSchema {
    type: 'Household';
    attributes: {
        /** File UUID (see [File Uploads](#file-uploads) section) */
        avatar: string | null;
        created_at: string | null;
        member_count: number | null;
        name: string | null;
        primary_contact_id: string | null;
        primary_contact_name: string | null;
        updated_at: string | null;
    };
    relationships: 'people' | 'primary_contact';
    includes: 'people';
    related: {
        people: 'person';
        primary_contact: 'person';
    };
    where: {
        created_at: string | Date;
        member_count: number;
        name: string;
        primary_contact_name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'member_count' | 'name' | 'primary_contact_name' | 'updated_at';
    create: {
        /** File UUID (see [File Uploads](#file-uploads) section) */
        avatar?: string | null;
        member_count?: number | null;
        name?: string | null;
        primary_contact_id?: string | null;
    };
    update: {
        /** File UUID (see [File Uploads](#file-uploads) section) */
        avatar?: string | null;
        member_count?: number | null;
        name?: string | null;
        primary_contact_id?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        household_memberships: { vertex: 'household_membership'; many: true; filters: never; create: true };
        people: { vertex: 'person'; many: true; filters: 'non_pending' | 'without_deceased'; create: false };
    };
}

/**
 * Type-level schema of {@link HouseholdMembership}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/household_membership
 */
export interface HouseholdMembershipSchema {
    type: 'HouseholdMembership';
    attributes: {
        /**
         * The role of the person within the household. Possible values are: `adult`, `child_or_dependent`, `other_adult`or`parent_guardian`.
         */
        household_role: string | null;
        /** False when a person's membership in a household is unverified. */
        pending: boolean | null;
        person_name: string | null;
    };
    relationships: 'person';
    includes: 'household' | 'person';
    related: {
        household: 'household';
        person: 'person';
    };
    where: {
        pending: boolean;
        person_name: string;
    };
    whereOps: {};
    order: 'pending' | 'person_name';
    create: {
        /**
         * The role of the person within the household. Possible values are: `adult`, `child_or_dependent`, `other_adult`or`parent_guardian`.
         */
        household_role?: string | null;
        /** False when a person's membership in a household is unverified. */
        pending?: boolean | null;
        person_id?: string;
    };
    update: {
        /**
         * The role of the person within the household. Possible values are: `adult`, `child_or_dependent`, `other_adult`or`parent_guardian`.
         */
        household_role?: string | null;
        /** False when a person's membership in a household is unverified. */
        pending?: boolean | null;
        person_id?: string;
    };
    delete: true;
    actions: never;
    edges: {
        household: { vertex: 'household'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link InactiveReason}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/inactive_reason
 */
export interface InactiveReasonSchema {
    type: 'InactiveReason';
    attributes: {
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        value: string;
    };
    whereOps: {};
    order: 'value';
    create: {
        value?: string | null;
    };
    update: {
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link List}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list
 */
export interface ListSchema {
    type: 'List';
    attributes: {
        active_automations_count: number | null;
        auto_generated_name: boolean | null;
        auto_refresh: boolean | null;
        auto_refresh_frequency: string | null;
        automations_active: boolean | null;
        automations_count: number | null;
        batch_completed_at: string | null;
        created_at: string | null;
        description: string | null;
        has_inactive_results: boolean | null;
        include_inactive: boolean | null;
        invalid: boolean | null;
        name: string | null;
        name_or_description: string | null;
        paused_automations_count: number | null;
        recently_viewed: boolean | null;
        refreshed_at: string | null;
        return_original_if_none: boolean | null;
        returns: string | null;
        starred: boolean | null;
        status: string | null;
        subset: string | null;
        total_people: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes:
        | 'campus'
        | 'category'
        | 'created_by'
        | 'mailchimp_sync_status'
        | 'people'
        | 'rules'
        | 'shares'
        | 'updated_by';
    related: {
        campus: 'campus';
        category: 'list_category';
        created_by: 'person';
        mailchimp_sync_status: 'mailchimp_sync_status';
        people: 'person';
        rules: 'rule';
        shares: 'list_share';
        updated_by: 'person';
    };
    where: {
        batch_completed_at: string | Date;
        created_at: string | Date;
        id: string;
        name: string;
        updated_at: string | Date;
    };
    whereOps: {
        batch_completed_at: 'gt' | 'gte' | 'lt' | 'lte';
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'active_automations_count'
        | 'auto_refresh_frequency'
        | 'automations_count'
        | 'batch_completed_at'
        | 'campus_id'
        | 'campuses.name'
        | 'created_at'
        | 'list_categories.name'
        | 'list_category_id'
        | 'name'
        | 'name_or_description'
        | 'refreshed_at'
        | 'starred'
        | 'total_people'
        | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: 'mailchimp_sync' | 'run';
    edges: {
        campus: { vertex: 'campus'; many: true; filters: never; create: false };
        category: { vertex: 'list_category'; many: true; filters: never; create: false };
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
        list_results: { vertex: 'list_result'; many: true; filters: never; create: false };
        mailchimp_sync_status: { vertex: 'mailchimp_sync_status'; many: true; filters: never; create: false };
        people: { vertex: 'person'; many: true; filters: never; create: false };
        rules: { vertex: 'rule'; many: true; filters: never; create: false };
        shares: { vertex: 'list_share'; many: true; filters: never; create: true };
        star: { vertex: 'list_star'; many: false; filters: never; create: true };
        updated_by: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ListCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_category
 */
export interface ListCategorySchema {
    type: 'ListCategory';
    attributes: {
        created_at: string | null;
        name: string | null;
        organization_id: string | null;
        updated_at: string | null;
    };
    relationships: 'organization';
    includes: 'lists';
    related: {
        lists: 'list';
        organization: 'organization';
    };
    where: {
        created_at: string | Date;
        name: string;
        organization_id: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'name' | 'organization_id' | 'updated_at';
    create: {
        name?: string | null;
    };
    update: {
        name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        lists: { vertex: 'list'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ListResult}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_result
 */
export interface ListResultSchema {
    type: 'ListResult';
    attributes: {
        created_at: string | null;
        updated_at: string | null;
    };
    relationships: 'list' | 'person';
    includes: 'person';
    related: {
        list: 'list';
        person: 'person';
    };
    where: {
        person_id: string | number;
    };
    whereOps: {};
    order: 'created_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ListShare}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_share
 */
export interface ListShareSchema {
    type: 'ListShare';
    attributes: {
        created_at: string | null;
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group: string | null;
        name: string | null;
        /** Possible values: `view` or `manage` */
        permission: string | null;
    };
    relationships: 'person';
    includes: 'person';
    related: {
        person: 'person';
    };
    where: {
        created_at: string | Date;
        group: string;
        name: string;
        permission: string;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'group';
    create: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group?: string | null;
        /** Possible values: `view` or `manage` */
        permission?: string | null;
        person_id?: string;
    };
    update: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group?: string | null;
        /** Possible values: `view` or `manage` */
        permission?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ListStar}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_star
 */
export interface ListStarSchema {
    type: 'ListStar';
    attributes: {
        created_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link MailchimpSyncStatus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/mailchimp_sync_status
 */
export interface MailchimpSyncStatusSchema {
    type: 'MailchimpSyncStatus';
    attributes: {
        completed_at: string | null;
        error: string | null;
        progress: number | null;
        segment_id: number | null;
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
 * Type-level schema of {@link MaritalStatus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/marital_status
 */
export interface MaritalStatusSchema {
    type: 'MaritalStatus';
    attributes: {
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        value: string;
    };
    whereOps: {};
    order: 'sequence' | 'value';
    create: {
        value?: string | null;
    };
    update: {
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link MembershipType}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/membership_type
 */
export interface MembershipTypeSchema {
    type: 'MembershipType';
    attributes: {
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        value: string;
    };
    whereOps: {};
    order: 'sequence' | 'value';
    create: {
        value?: string | null;
    };
    update: {
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Message}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/message
 */
export interface MessageSchema {
    type: 'Message';
    attributes: {
        app_name: string | null;
        bounced_at: string | null;
        created_at: string | null;
        delivery_status: string | null;
        file: string | null;
        from_address: string | null;
        from_name: string | null;
        /** Possible values: `email`, `sms`, or `church_center_message` */
        kind: string | null;
        message_type: string | null;
        read_at: string | null;
        reject_reason: string | null;
        rejection_notification_sent_at: string | null;
        sent_at: string | null;
        subject: string | null;
        to_addresses: string | null;
    };
    relationships: 'from' | 'message_group' | 'to';
    includes: 'message_group' | 'to';
    related: {
        from: 'person';
        message_group: 'message_group';
        to: 'person';
    };
    where: {
        app_name: string;
        bounced_at: string | Date;
        created_at: string | Date;
        delivery_status: string;
        file: string;
        from_address: string;
        kind: string;
        reject_reason: string;
        rejection_notification_sent_at: string | Date;
        sent_at: string | Date;
        subject: string;
        to_addresses: string;
    };
    whereOps: {
        bounced_at: 'gt' | 'gte' | 'lt' | 'lte';
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        rejection_notification_sent_at: 'gt' | 'gte' | 'lt' | 'lte';
        sent_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'app_name'
        | 'bounced_at'
        | 'created_at'
        | 'delivery_status'
        | 'file'
        | 'from_address'
        | 'from_name'
        | 'kind'
        | 'reject_reason'
        | 'rejection_notification_sent_at'
        | 'sent_at'
        | 'subject'
        | 'to_addresses';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        message_group: { vertex: 'message_group'; many: true; filters: never; create: false };
        to: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link MessageGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/message_group
 */
export interface MessageGroupSchema {
    type: 'MessageGroup';
    attributes: {
        contains_user_generated_content: boolean | null;
        created_at: string | null;
        from_address: string | null;
        message_count: number | null;
        message_type: string | null;
        reply_to_address: string | null;
        reply_to_name: string | null;
        subject: string | null;
        system_message: boolean | null;
        transactional_message: boolean | null;
        uuid: string | null;
    };
    relationships: never;
    includes: 'app' | 'from' | 'messages';
    related: {
        app: 'app';
        from: 'person';
        messages: 'message';
    };
    where: {
        contains_user_generated_content: boolean;
        created_at: string | Date;
        from_address: string;
        message_count: number;
        message_type: string;
        reply_to_address: string;
        reply_to_name: string;
        subject: string;
        system_message: boolean;
        transactional_message: boolean;
        uuid: string;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'contains_user_generated_content'
        | 'created_at'
        | 'from_address'
        | 'message_count'
        | 'message_type'
        | 'reply_to_address'
        | 'reply_to_name'
        | 'subject'
        | 'system_message'
        | 'transactional_message'
        | 'uuid';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        app: { vertex: 'app'; many: true; filters: never; create: false };
        from: { vertex: 'person'; many: true; filters: never; create: false };
        messages: { vertex: 'message'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link NamePrefix}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/name_prefix
 */
export interface NamePrefixSchema {
    type: 'NamePrefix';
    attributes: {
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        value: string;
    };
    whereOps: {};
    order: 'value';
    create: {
        value?: string | null;
    };
    update: {
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link NameSuffix}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/name_suffix
 */
export interface NameSuffixSchema {
    type: 'NameSuffix';
    attributes: {
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        value: string;
    };
    whereOps: {};
    order: 'value';
    create: {
        value?: string | null;
    };
    update: {
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Note}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note
 */
export interface NoteSchema {
    type: 'Note';
    attributes: {
        created_at: string | null;
        created_by_id: string | null;
        display_date: string | null;
        note: string | null;
        note_category_id: string | null;
        organization_id: string | null;
        person_id: string | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'note_category' | 'organization' | 'person';
    includes: 'category' | 'created_by' | 'person';
    related: {
        category: 'note_category';
        created_by: 'person';
        note_category: 'note_category';
        organization: 'organization';
        person: 'person';
    };
    where: {
        created_at: string | Date;
        note: string;
        note_category_id: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'display_date' | 'id' | 'note' | 'note_category_id' | 'updated_at';
    create: {
        created_at?: string | null;
        display_date?: string | null;
        note?: string | null;
        note_category_id?: string | null;
        updated_at?: string | null;
    };
    update: {
        created_at?: string | null;
        display_date?: string | null;
        note?: string | null;
        note_category_id?: string | null;
        updated_at?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        category: { vertex: 'note_category'; many: true; filters: never; create: false };
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link NoteCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category
 */
export interface NoteCategorySchema {
    type: 'NoteCategory';
    attributes: {
        created_at: string | null;
        locked: boolean | null;
        name: string | null;
        organization_id: string | null;
        updated_at: string | null;
    };
    relationships: 'organization';
    includes: 'shares' | 'subscribers' | 'subscriptions';
    related: {
        organization: 'organization';
        shares: 'note_category_share';
        subscribers: 'person';
        subscriptions: 'note_category_subscription';
    };
    where: {
        created_at: string | Date;
        locked: boolean;
        name: string;
        organization_id: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'locked' | 'name' | 'organization_id' | 'updated_at';
    create: {
        name?: string | null;
    };
    update: {
        name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        shares: { vertex: 'note_category_share'; many: true; filters: never; create: true };
        subscribers: { vertex: 'person'; many: true; filters: never; create: false };
        subscriptions: { vertex: 'note_category_subscription'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link NoteCategoryShare}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category_share
 */
export interface NoteCategoryShareSchema {
    type: 'NoteCategoryShare';
    attributes: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group: string | null;
        /** Possible values: `view`, `view_create`, or `manage` */
        permission: string | null;
        person_id: string | null;
    };
    relationships: 'note_category' | 'person';
    includes: 'person';
    related: {
        note_category: 'note_category';
        person: 'person';
    };
    where: {
        permission: string;
    };
    whereOps: {};
    order: never;
    create: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group?: string | null;
        /** Possible values: `view`, `view_create`, or `manage` */
        permission?: string | null;
        person_id?: string | null;
    };
    update: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group?: string | null;
        /** Possible values: `view`, `view_create`, or `manage` */
        permission?: string | null;
        person_id?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link NoteCategorySubscription}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category_subscription
 */
export interface NoteCategorySubscriptionSchema {
    type: 'NoteCategorySubscription';
    attributes: {
        created_at: string | null;
        updated_at: string | null;
    };
    relationships: 'note_category' | 'person';
    includes: 'person';
    related: {
        note_category: 'note_category';
        person: 'person';
    };
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        avatar_url: string | null;
        church_center_subdomain: string | null;
        contact_website: string | null;
        country_code: string | null;
        created_at: string | null;
        date_format: number | null;
        grades: unknown[] | null;
        name: string | null;
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
 * Type-level schema of {@link OrganizationStatistics}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/organization_statistics
 */
export interface OrganizationStatisticsSchema {
    type: 'OrganizationStatistics';
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
 * Type-level schema of {@link PeopleImport}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import
 */
export interface PeopleImportSchema {
    type: 'PeopleImport';
    attributes: {
        attribs: string | null;
        created_at: string | null;
        processed_at: string | null;
        /**
         * Possible values: `matching`, `processing_preview`, `previewing`, `processing_import`, `complete`, `undone`, or `undoing`
         */
        status: string | null;
        undone_at: string | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'undone_by';
    includes: never;
    related: {
        created_by: 'person';
        undone_by: 'person';
    };
    where: {
        status: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        conflicts: { vertex: 'people_import_conflict'; many: true; filters:
            | 'creates'
            | 'creates_and_updates'
            | 'errors'
            | 'household_creates'
            | 'household_updates'
            | 'identical'
            | 'ignored'
            | 'not_ignored'
            | 'updates'; create: false };
        histories: { vertex: 'people_import_history'; many: true; filters:
            | 'creates'
            | 'household_creates'
            | 'household_updates'
            | 'identical'
            | 'updates'; create: false };
    };
}

/**
 * Type-level schema of {@link PeopleImportConflict}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import_conflict
 */
export interface PeopleImportConflictSchema {
    type: 'PeopleImportConflict';
    attributes: {
        conflicting_changes: string | null;
        created_at: string | null;
        data: string | null;
        ignore: boolean | null;
        kind: string | null;
        message: string | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        kind: string;
        name: string;
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
 * Type-level schema of {@link PeopleImportHistory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import_history
 */
export interface PeopleImportHistorySchema {
    type: 'PeopleImportHistory';
    attributes: {
        conflicting_changes: Record<string, unknown> | null;
        created_at: string | null;
        kind: string | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'household' | 'person';
    related: {
        household: 'household';
        person: 'person';
    };
    where: {
        name: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        household: { vertex: 'household'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Person}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        accounting_administrator: boolean | null;
        anniversary: string | null;
        /** File UUID (see [File Uploads](#file-uploads) section) */
        avatar: string | null;
        birthdate: string | null;
        can_create_forms: boolean | null;
        can_email_lists: boolean | null;
        child: boolean | null;
        created_at: string | null;
        demographic_avatar_url: string | null;
        /** Only available when requested with the `?fields` param */
        directory_shared_info: Record<string, unknown> | null;
        directory_status: string | null;
        first_name: string | null;
        gender: string | null;
        given_name: string | null;
        grade: number | null;
        graduation_year: number | null;
        /**
         * Set to an ISO 8601 date or time to make the profile inactive. Set to "null" to reactivate the profile.
         */
        inactivated_at: string | null;
        last_name: string | null;
        login_identifier: string | null;
        medical_notes: string | null;
        membership: string | null;
        /**
         * Only available when requested with the `?fields` param
         *
         * Set to "true" or "false" to filter. Can only be viewed and queried by an Organization Administrator.
         */
        mfa_configured: boolean | null;
        middle_name: string | null;
        name: string | null;
        nickname: string | null;
        passed_background_check: boolean | null;
        people_permissions: string | null;
        remote_id: number | null;
        school_type: string | null;
        selective_access: boolean | null;
        site_administrator: boolean | null;
        /**
         * Set to "inactive" to set "inactivated_at" to the current time and make the profile inactive. Set to anything else to clear "inactivated_at" and reactivate the profile.
         */
        status: string | null;
        /** Only available when requested with the `?fields` param */
        stripe_account_identifier: string | null;
        /** Only available when requested with the `?fields` param */
        stripe_customer_identifier: string | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'primary_campus';
    includes:
        | 'addresses'
        | 'emails'
        | 'field_data'
        | 'households'
        | 'inactive_reason'
        | 'marital_status'
        | 'name_prefix'
        | 'name_suffix'
        | 'organization'
        | 'person_apps'
        | 'phone_numbers'
        | 'platform_notifications'
        | 'primary_campus'
        | 'school'
        | 'social_profiles';
    related: {
        addresses: 'address';
        created_by: 'person';
        emails: 'email';
        field_data: 'field_datum';
        households: 'household';
        inactive_reason: 'inactive_reason';
        marital_status: 'marital_status';
        name_prefix: 'name_prefix';
        name_suffix: 'name_suffix';
        organization: 'organization';
        person_apps: 'person_app';
        phone_numbers: 'phone_number';
        platform_notifications: 'platform_notification';
        primary_campus: 'campus';
        school: 'school_option';
        social_profiles: 'social_profile';
    };
    where: {
        accounting_administrator: boolean;
        anniversary: string | Date;
        birthdate: string | Date;
        child: boolean;
        created_at: string | Date;
        first_name: string;
        gender: string;
        given_name: string;
        grade: number;
        graduation_year: number;
        id: string;
        inactivated_at: string | Date;
        last_name: string;
        medical_notes: string;
        membership: string;
        mfa_configured: boolean;
        middle_name: string;
        nickname: string;
        people_permissions: string;
        primary_campus_id: string | number;
        remote_id: string | number;
        search_name: string;
        search_name_or_email: string;
        search_name_or_email_or_phone_number: string;
        search_phone_number: string;
        search_phone_number_e164: string;
        site_administrator: boolean;
        status: string;
        updated_at: string | Date;
    };
    whereOps: {
        anniversary: 'gt' | 'gte' | 'lt' | 'lte';
        birthdate: 'gt' | 'gte' | 'lt' | 'lte';
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        inactivated_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'accounting_administrator'
        | 'anniversary'
        | 'birthdate'
        | 'child'
        | 'created_at'
        | 'first_name'
        | 'gender'
        | 'given_name'
        | 'grade'
        | 'graduation_year'
        | 'inactivated_at'
        | 'last_name'
        | 'membership'
        | 'middle_name'
        | 'nickname'
        | 'people_permissions'
        | 'remote_id'
        | 'site_administrator'
        | 'status'
        | 'updated_at';
    create: {
        accounting_administrator?: boolean | null;
        anniversary?: string | null;
        /** File UUID (see [File Uploads](#file-uploads) section) */
        avatar?: string | null;
        birthdate?: string | null;
        child?: boolean | null;
        created_by_id?: string;
        first_name?: string | null;
        gender?: string | null;
        given_name?: string | null;
        grade?: number | null;
        graduation_year?: number | null;
        /**
         * Set to an ISO 8601 date or time to make the profile inactive. Set to "null" to reactivate the profile.
         */
        inactivated_at?: string | null;
        last_name?: string | null;
        medical_notes?: string | null;
        membership?: string | null;
        middle_name?: string | null;
        nickname?: string | null;
        people_permissions?: string | null;
        primary_campus_id?: string;
        remote_id?: number | null;
        site_administrator?: boolean | null;
        /**
         * Set to "inactive" to set "inactivated_at" to the current time and make the profile inactive. Set to anything else to clear "inactivated_at" and reactivate the profile.
         */
        status?: string | null;
        /** Only available when requested with the `?fields` param */
        stripe_account_identifier?: string | null;
        /** Only available when requested with the `?fields` param */
        stripe_customer_identifier?: string | null;
    };
    update: {
        accounting_administrator?: boolean | null;
        anniversary?: string | null;
        /** File UUID (see [File Uploads](#file-uploads) section) */
        avatar?: string | null;
        birthdate?: string | null;
        child?: boolean | null;
        first_name?: string | null;
        gender?: string | null;
        given_name?: string | null;
        grade?: number | null;
        graduation_year?: number | null;
        /**
         * Set to an ISO 8601 date or time to make the profile inactive. Set to "null" to reactivate the profile.
         */
        inactivated_at?: string | null;
        last_name?: string | null;
        medical_notes?: string | null;
        membership?: string | null;
        middle_name?: string | null;
        nickname?: string | null;
        people_permissions?: string | null;
        primary_campus_id?: string;
        remote_id?: number | null;
        site_administrator?: boolean | null;
        /**
         * Set to "inactive" to set "inactivated_at" to the current time and make the profile inactive. Set to anything else to clear "inactivated_at" and reactivate the profile.
         */
        status?: string | null;
        /** Only available when requested with the `?fields` param */
        stripe_account_identifier?: string | null;
        /** Only available when requested with the `?fields` param */
        stripe_customer_identifier?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        addresses: { vertex: 'address'; many: true; filters: never; create: true };
        apps: { vertex: 'app'; many: true; filters: never; create: false };
        background_checks: { vertex: 'background_check'; many: true; filters:
            | 'awaiting_applicant'
            | 'canceled'
            | 'complete_clear'
            | 'complete_not_clear'
            | 'current'
            | 'expired'
            | 'expired_invitation'
            | 'needs_review'
            | 'not_expired'
            | 'report_processing'; create: true };
        connected_people: { vertex: 'connected_person'; many: true; filters: never; create: false };
        emails: { vertex: 'email'; many: true; filters: never; create: true };
        field_data: { vertex: 'field_datum'; many: true; filters: never; create: true };
        household_memberships: { vertex: 'household_membership'; many: true; filters: never; create: false };
        households: { vertex: 'household'; many: true; filters: never; create: false };
        inactive_reason: { vertex: 'inactive_reason'; many: true; filters: never; create: false };
        marital_status: { vertex: 'marital_status'; many: true; filters: never; create: false };
        message_groups: { vertex: 'message_group'; many: true; filters: never; create: false };
        /**
         * The Person's received messages. Can also receive a filter
         * to return `sent` or `unread`
         * e.g. `?filter=sent`
         */
        messages: { vertex: 'message'; many: true; filters: 'created_after' | 'received' | 'sent' | 'unread'; create: false };
        name_prefix: { vertex: 'name_prefix'; many: true; filters: never; create: false };
        name_suffix: { vertex: 'name_suffix'; many: true; filters: never; create: false };
        notes: { vertex: 'note'; many: true; filters: never; create: true };
        organization: { vertex: 'organization'; many: true; filters: never; create: false };
        person_apps: { vertex: 'person_app'; many: true; filters: never; create: true };
        phone_numbers: { vertex: 'phone_number'; many: true; filters: never; create: true };
        platform_notifications: { vertex: 'platform_notification'; many: true; filters: never; create: false };
        primary_campus: { vertex: 'campus'; many: true; filters: never; create: false };
        school: { vertex: 'school_option'; many: true; filters: never; create: false };
        social_profiles: { vertex: 'social_profile'; many: true; filters: never; create: true };
        workflow_assignee_workflow_summaries: { vertex: 'workflow_assignee_workflow_summary'; many: true; filters: never; create: false };
        workflow_cards: { vertex: 'workflow_card'; many: true; filters: 'assigned'; create: false };
        workflow_shares: { vertex: 'workflow_share'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PersonApp}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person_app
 */
export interface PersonAppSchema {
    type: 'PersonApp';
    attributes: {
        allow_pco_login: boolean | null;
        /** Possible values: `no_access`, `viewer`, or `editor` */
        people_permissions: string | null;
    };
    relationships: 'app' | 'person';
    includes: 'app';
    related: {
        app: 'app';
        person: 'person';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        app_id?: string;
    };
    update: {};
    delete: false;
    actions: never;
    edges: {
        app: { vertex: 'app'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PersonMerger}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person_merger
 */
export interface PersonMergerSchema {
    type: 'PersonMerger';
    attributes: {
        created_at: string | null;
        person_to_keep_id: string | null;
        person_to_remove_id: string | null;
    };
    relationships: 'person_to_keep' | 'person_to_remove';
    includes: never;
    related: {
        person_to_keep: 'person';
        person_to_remove: 'person';
    };
    where: {
        created_at: string | Date;
        person_to_keep_id: string;
        person_to_remove_id: string;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link PhoneNumber}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/phone_number
 */
export interface PhoneNumberSchema {
    type: 'PhoneNumber';
    attributes: {
        carrier: string | null;
        country_code: string | null;
        created_at: string | null;
        e164: string | null;
        /** Only available when requested with the `?fields` param */
        formatted_number: string | null;
        international: string | null;
        location: string | null;
        national: string | null;
        number: string | null;
        primary: boolean | null;
        updated_at: string | null;
        verified: boolean | null;
    };
    relationships: 'person';
    includes: never;
    related: {
        person: 'person';
    };
    where: {
        carrier: string;
        created_at: string | Date;
        location: string;
        number: string;
        primary: boolean;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'carrier' | 'created_at' | 'location' | 'number' | 'primary' | 'updated_at';
    create: {
        carrier?: string | null;
        location?: string | null;
        number?: string | null;
        primary?: boolean | null;
    };
    update: {
        carrier?: string | null;
        location?: string | null;
        number?: string | null;
        primary?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link PlatformNotification}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/platform_notification
 */
export interface PlatformNotificationSchema {
    type: 'PlatformNotification';
    attributes: {
        html: string | null;
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
 * Type-level schema of {@link Report}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/report
 */
export interface ReportSchema {
    type: 'Report';
    attributes: {
        body: string | null;
        created_at: string | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'created_by' | 'updated_by';
    related: {
        created_by: 'person';
        updated_by: 'person';
    };
    where: {
        body: string;
        created_at: string | Date;
        name: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'body' | 'created_at' | 'name' | 'updated_at';
    create: {
        body?: string | null;
        name?: string | null;
    };
    update: {
        body?: string | null;
        name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
        updated_by: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Rule}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/rule
 */
export interface RuleSchema {
    type: 'Rule';
    attributes: {
        created_at: string | null;
        subset: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'conditions';
    related: {
        conditions: 'condition';
    };
    where: {
        created_at: string | Date;
        subset: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'subset' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        conditions: { vertex: 'condition'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link SchoolOption}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/school_option
 */
export interface SchoolOptionSchema {
    type: 'SchoolOption';
    attributes: {
        beginning_grade: string | null;
        ending_grade: string | null;
        school_types: unknown[] | null;
        sequence: number | null;
        value: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        beginning_grade: string;
        ending_grade: string;
        school_types: string;
        sequence: number;
        value: string;
    };
    whereOps: {};
    order: 'beginning_grade' | 'ending_grade' | 'sequence' | 'value';
    create: {
        beginning_grade?: string | null;
        ending_grade?: string | null;
        school_types?: unknown[] | null;
        sequence?: number | null;
        value?: string | null;
    };
    update: {
        beginning_grade?: string | null;
        ending_grade?: string | null;
        school_types?: unknown[] | null;
        sequence?: number | null;
        value?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        promotes_to_school: { vertex: 'school_option'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ServiceTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/service_time
 */
export interface ServiceTimeSchema {
    type: 'ServiceTime';
    attributes: {
        /**
         * Possible values: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, or `saturday`
         */
        day: string | null;
        description: string | null;
        start_time: number | null;
    };
    relationships: 'campus' | 'organization';
    includes: never;
    related: {
        campus: 'campus';
        organization: 'organization';
    };
    where: {};
    whereOps: {};
    order: 'time';
    create: {
        /**
         * Possible values: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, or `saturday`
         */
        day?: string | null;
        description?: string | null;
        start_time?: number | null;
    };
    update: {
        /**
         * Possible values: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, or `saturday`
         */
        day?: string | null;
        description?: string | null;
        start_time?: number | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link SocialProfile}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/social_profile
 */
export interface SocialProfileSchema {
    type: 'SocialProfile';
    attributes: {
        created_at: string | null;
        site: string | null;
        updated_at: string | null;
        url: string | null;
        verified: boolean | null;
    };
    relationships: never;
    includes: 'person';
    related: {
        person: 'person';
    };
    where: {
        created_at: string | Date;
        site: string;
        updated_at: string | Date;
        url: string;
        verified: boolean;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'site' | 'updated_at' | 'url' | 'verified';
    create: {
        site?: string | null;
        url?: string | null;
        verified?: boolean | null;
    };
    update: {
        site?: string | null;
        url?: string | null;
        verified?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link SpamEmailAddress}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/spam_email_address
 */
export interface SpamEmailAddressSchema {
    type: 'SpamEmailAddress';
    attributes: {
        address: string | null;
        created_at: string | null;
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
 * Type-level schema of {@link Tab}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/tab
 */
export interface TabSchema {
    type: 'Tab';
    attributes: {
        name: string | null;
        sequence: number | null;
        slug: string | null;
    };
    relationships: never;
    includes: 'field_definitions' | 'field_options';
    related: {
        field_definitions: 'field_definition';
        field_options: 'field_option';
    };
    where: {
        name: string;
        sequence: number;
        slug: string;
    };
    whereOps: {};
    order: 'name' | 'sequence' | 'slug';
    create: {
        name?: string | null;
        sequence?: number | null;
    };
    update: {
        name?: string | null;
        sequence?: number | null;
    };
    delete: true;
    actions: never;
    edges: {
        field_definitions: { vertex: 'field_definition'; many: true; filters: 'with_deleted'; create: true };
        field_options: { vertex: 'field_option'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Workflow}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow
 */
export interface WorkflowSchema {
    type: 'Workflow';
    attributes: {
        archived_at: string | null;
        campus_id: string | null;
        completed_card_count: number | null;
        created_at: string | null;
        deleted_at: string | null;
        /** Only available when requested with the `?fields` param */
        my_due_soon_card_count: number | null;
        /** Only available when requested with the `?fields` param */
        my_overdue_card_count: number | null;
        my_ready_card_count: number | null;
        name: string | null;
        recently_viewed: boolean | null;
        total_cards_count: number | null;
        total_overdue_card_count: number | null;
        total_ready_and_snoozed_card_count: number | null;
        total_ready_card_count: number | null;
        total_steps_count: number | null;
        total_unassigned_card_count: number | null;
        total_unassigned_steps_count: number | null;
        updated_at: string | null;
        workflow_category_id: string | null;
    };
    relationships: 'campus' | 'workflow_category';
    includes: 'category' | 'shares' | 'steps';
    related: {
        campus: 'campus';
        category: 'workflow_category';
        shares: 'workflow_share';
        steps: 'workflow_step';
        workflow_category: 'workflow_category';
    };
    where: {
        archived_at: string | Date;
        campus_id: string;
        created_at: string | Date;
        deleted_at: string | Date;
        id: string;
        name: string;
        updated_at: string | Date;
        workflow_category_id: string;
    };
    whereOps: {
        archived_at: 'gt' | 'gte' | 'lt' | 'lte';
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        deleted_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order:
        | 'archived_at'
        | 'campus_id'
        | 'campus_name'
        | 'created_at'
        | 'deleted_at'
        | 'my_ready_card_count'
        | 'name'
        | 'recently_viewed'
        | 'total_overdue_card_count'
        | 'total_ready_card_count'
        | 'total_unassigned_card_count'
        | 'updated_at'
        | 'workflow_category_id'
        | 'workflow_category_name';
    create: {
        campus_id?: string | null;
        name?: string | null;
        workflow_category_id?: string | null;
    };
    update: {
        campus_id?: string | null;
        name?: string | null;
        workflow_category_id?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        cards: { vertex: 'workflow_card'; many: true; filters: never; create: true };
        category: { vertex: 'workflow_category'; many: true; filters: never; create: false };
        shared_people: { vertex: 'person'; many: true; filters: never; create: false };
        shares: { vertex: 'workflow_share'; many: true; filters: never; create: true };
        steps: { vertex: 'workflow_step'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link WorkflowAssigneeSummary}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_assignee_summary
 */
export interface WorkflowAssigneeSummarySchema {
    type: 'WorkflowAssigneeSummary';
    attributes: {
        overdue_count: number | null;
        ready_count: number | null;
        snoozed_count: number | null;
    };
    relationships: 'person';
    includes: never;
    related: {
        person: 'person';
    };
    where: {};
    whereOps: {};
    order:
        | 'first_name'
        | 'last_name'
        | 'name'
        | 'overdue_count'
        | 'ready_count'
        | 'snoozed_count';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link WorkflowAssigneeWorkflowSummary}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_assignee_workflow_summary
 */
export interface WorkflowAssigneeWorkflowSummarySchema {
    type: 'WorkflowAssigneeWorkflowSummary';
    attributes: {
        overdue_count: number | null;
        ready_count: number | null;
        snoozed_count: number | null;
        workflow_name: string | null;
    };
    relationships: 'person' | 'workflow';
    includes: never;
    related: {
        person: 'person';
        workflow: 'workflow';
    };
    where: {};
    whereOps: {};
    order: 'overdue_count' | 'ready_count' | 'snoozed_count' | 'workflow_name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link WorkflowCard}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card
 */
export interface WorkflowCardSchema {
    type: 'WorkflowCard';
    attributes: {
        awaiting_automation: boolean | null;
        calculated_due_at: string | null;
        calculated_due_at_in_days_ago: number | null;
        completed_at: string | null;
        created_at: string | null;
        flagged_for_notification_at: string | null;
        moved_to_step_at: string | null;
        overdue: boolean | null;
        pending_skip_evaluation: boolean | null;
        removed_at: string | null;
        snooze_until: string | null;
        stage: string | null;
        sticky_assignment: boolean | null;
        updated_at: string | null;
    };
    relationships: 'assignee' | 'current_step' | 'person' | 'workflow';
    includes: 'assignee' | 'current_step' | 'person' | 'workflow';
    related: {
        assignee: 'person';
        current_step: 'workflow_step';
        person: 'person';
        workflow: 'workflow';
    };
    where: {
        assignee_id: string | number;
        overdue: boolean;
        stage: string;
    };
    whereOps: {};
    order:
        | 'completed_at'
        | 'created_at'
        | 'first_name'
        | 'flagged_for_notification_at'
        | 'last_name'
        | 'moved_to_step_at'
        | 'removed_at'
        | 'stage'
        | 'updated_at';
    create: {
        assignee_id?: string;
        person_id?: string;
        sticky_assignment?: boolean | null;
    };
    update: {
        assignee_id?: string;
        person_id?: string;
        sticky_assignment?: boolean | null;
    };
    delete: true;
    actions:
        | 'go_back'
        | 'promote'
        | 'remove'
        | 'restore'
        | 'send_email'
        | 'skip_step'
        | 'snooze'
        | 'unsnooze';
    edges: {
        activities: { vertex: 'workflow_card_activity'; many: true; filters: never; create: false };
        assignee: { vertex: 'person'; many: true; filters: never; create: false };
        current_step: { vertex: 'workflow_step'; many: true; filters: never; create: false };
        notes: { vertex: 'workflow_card_note'; many: true; filters: never; create: true };
        person: { vertex: 'person'; many: true; filters: never; create: false };
        workflow: { vertex: 'workflow'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link WorkflowCardActivity}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card_activity
 */
export interface WorkflowCardActivitySchema {
    type: 'WorkflowCardActivity';
    attributes: {
        attachments_meta: unknown[] | null;
        attachments_urls: unknown[] | null;
        automation_url: string | null;
        comment: string | null;
        content: string | null;
        content_is_html: boolean | null;
        created_at: string | null;
        form_submission_url: string | null;
        person_avatar_url: string | null;
        person_name: string | null;
        reassigned_to_avatar_url: string | null;
        reassigned_to_name: string | null;
        subject: string | null;
        type: string | null;
        updated_at: string | null;
    };
    relationships: 'person' | 'reassigned_to' | 'workflow_card' | 'workflow_step';
    includes: never;
    related: {
        person: 'person';
        reassigned_to: 'person';
        workflow_card: 'workflow_card';
        workflow_step: 'workflow_step';
    };
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'id' | 'updated_at';
    create: {};
    update: {};
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link WorkflowCardNote}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card_note
 */
export interface WorkflowCardNoteSchema {
    type: 'WorkflowCardNote';
    attributes: {
        created_at: string | null;
        note: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        created_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'updated_at';
    create: {
        note?: string | null;
    };
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link WorkflowCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_category
 */
export interface WorkflowCategorySchema {
    type: 'WorkflowCategory';
    attributes: {
        created_at: string | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
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
    create: {
        name?: string | null;
    };
    update: {
        name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link WorkflowShare}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_share
 */
export interface WorkflowShareSchema {
    type: 'WorkflowShare';
    attributes: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group: string | null;
        /** Possible values: `view`, `manage_cards`, or `manage` */
        permission: string | null;
        person_id: string | null;
    };
    relationships: 'person' | 'workflow';
    includes: 'person';
    related: {
        person: 'person';
        workflow: 'workflow';
    };
    where: {
        permission: string;
    };
    whereOps: {};
    order: never;
    create: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group?: string | null;
        /** Possible values: `view`, `manage_cards`, or `manage` */
        permission?: string | null;
        person_id?: string | null;
    };
    update: {
        /** Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` */
        group?: string | null;
        /** Possible values: `view`, `manage_cards`, or `manage` */
        permission?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link WorkflowStep}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_step
 */
export interface WorkflowStepSchema {
    type: 'WorkflowStep';
    attributes: {
        /** Possible values: `assign` or `automate` */
        action_type: string | null;
        auto_snooze_days: number | null;
        /**
         * Valid values are 17-23. When set, only cards arriving after this hour are snoozed. Requires `auto_snooze_value`, `auto_snooze_interval`, and `auto_snooze_wake_hour` (which must be before it).
         */
        auto_snooze_entry_hour: number | null;
        /**
         * Valid values are `day`, `week`, or `month`. When auto_snooze_entry_hour is set, this is not the snooze length. The card wakes at auto_snooze_wake_hour, and this duration adds only whole days beyond that.
         *
         * Possible values: `day`, `week`, or `month`
         */
        auto_snooze_interval: string | null;
        /**
         * Must be a positive number. When auto_snooze_entry_hour is set, this is not the snooze length. The card wakes at auto_snooze_wake_hour, and this duration adds only whole days beyond that.
         */
        auto_snooze_value: number | null;
        /**
         * Valid values are 7-19, defaulting to 7 when not set. The hour of day cards snooze until. Only present when auto-snooze is enabled (`auto_snooze_value` and `auto_snooze_interval` are set).
         */
        auto_snooze_wake_hour: number | null;
        created_at: string | null;
        default_assignee_id: string | null;
        description: string | null;
        expected_response_time_in_days: number | null;
        my_ready_card_count: number | null;
        name: string | null;
        sequence: number | null;
        skip_conditions_enabled: boolean | null;
        total_ready_card_count: number | null;
        updated_at: string | null;
    };
    relationships: 'default_assignee' | 'workflow';
    includes: 'default_assignee';
    related: {
        default_assignee: 'person';
        workflow: 'workflow';
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
    order: 'created_at' | 'name' | 'sequence' | 'updated_at';
    create: {
        /** Possible values: `assign` or `automate` */
        action_type?: string | null;
        /**
         * Valid values are 17-23. When set, only cards arriving after this hour are snoozed. Requires `auto_snooze_value`, `auto_snooze_interval`, and `auto_snooze_wake_hour` (which must be before it).
         */
        auto_snooze_entry_hour?: number | null;
        /**
         * Valid values are `day`, `week`, or `month`. When auto_snooze_entry_hour is set, this is not the snooze length. The card wakes at auto_snooze_wake_hour, and this duration adds only whole days beyond that.
         *
         * Possible values: `day`, `week`, or `month`
         */
        auto_snooze_interval?: string | null;
        /**
         * Must be a positive number. When auto_snooze_entry_hour is set, this is not the snooze length. The card wakes at auto_snooze_wake_hour, and this duration adds only whole days beyond that.
         */
        auto_snooze_value?: number | null;
        /**
         * Valid values are 7-19, defaulting to 7 when not set. The hour of day cards snooze until. Only present when auto-snooze is enabled (`auto_snooze_value` and `auto_snooze_interval` are set).
         */
        auto_snooze_wake_hour?: number | null;
        default_assignee_id?: string | null;
        description?: string | null;
        expected_response_time_in_days?: number | null;
        name?: string | null;
        sequence?: number | null;
        skip_conditions_enabled?: boolean | null;
    };
    update: {
        /** Possible values: `assign` or `automate` */
        action_type?: string | null;
        /**
         * Valid values are 17-23. When set, only cards arriving after this hour are snoozed. Requires `auto_snooze_value`, `auto_snooze_interval`, and `auto_snooze_wake_hour` (which must be before it).
         */
        auto_snooze_entry_hour?: number | null;
        /**
         * Valid values are `day`, `week`, or `month`. When auto_snooze_entry_hour is set, this is not the snooze length. The card wakes at auto_snooze_wake_hour, and this duration adds only whole days beyond that.
         *
         * Possible values: `day`, `week`, or `month`
         */
        auto_snooze_interval?: string | null;
        /**
         * Must be a positive number. When auto_snooze_entry_hour is set, this is not the snooze length. The card wakes at auto_snooze_wake_hour, and this duration adds only whole days beyond that.
         */
        auto_snooze_value?: number | null;
        /**
         * Valid values are 7-19, defaulting to 7 when not set. The hour of day cards snooze until. Only present when auto-snooze is enabled (`auto_snooze_value` and `auto_snooze_interval` are set).
         */
        auto_snooze_wake_hour?: number | null;
        default_assignee_id?: string | null;
        description?: string | null;
        expected_response_time_in_days?: number | null;
        name?: string | null;
        sequence?: number | null;
        skip_conditions_enabled?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {
        assignee_summaries: { vertex: 'workflow_step_assignee_summary'; many: true; filters: never; create: false };
        default_assignee: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link WorkflowStepAssigneeSummary}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_step_assignee_summary
 */
export interface WorkflowStepAssigneeSummarySchema {
    type: 'WorkflowStepAssigneeSummary';
    attributes: {
        ready_count: number | null;
        snoozed_count: number | null;
    };
    relationships: 'person' | 'step';
    includes: 'person';
    related: {
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
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Planning Center People resource, keyed by vertex id. */
export type PeopleSchema = {
    address: AddressSchema;
    app: AppSchema;
    background_check: BackgroundCheckSchema;
    birthday_people: BirthdayPeopleSchema;
    campus: CampusSchema;
    carrier: CarrierSchema;
    condition: ConditionSchema;
    connected_person: ConnectedPersonSchema;
    custom_sender: CustomSenderSchema;
    email: EmailSchema;
    field_datum: FieldDatumSchema;
    field_definition: FieldDefinitionSchema;
    field_option: FieldOptionSchema;
    form: FormSchema;
    form_category: FormCategorySchema;
    form_field: FormFieldSchema;
    form_field_condition: FormFieldConditionSchema;
    form_field_option: FormFieldOptionSchema;
    form_submission: FormSubmissionSchema;
    form_submission_value: FormSubmissionValueSchema;
    grade: GradeSchema;
    household: HouseholdSchema;
    household_membership: HouseholdMembershipSchema;
    inactive_reason: InactiveReasonSchema;
    list: ListSchema;
    list_category: ListCategorySchema;
    list_result: ListResultSchema;
    list_share: ListShareSchema;
    list_star: ListStarSchema;
    mailchimp_sync_status: MailchimpSyncStatusSchema;
    marital_status: MaritalStatusSchema;
    membership_type: MembershipTypeSchema;
    message: MessageSchema;
    message_group: MessageGroupSchema;
    name_prefix: NamePrefixSchema;
    name_suffix: NameSuffixSchema;
    note: NoteSchema;
    note_category: NoteCategorySchema;
    note_category_share: NoteCategoryShareSchema;
    note_category_subscription: NoteCategorySubscriptionSchema;
    organization: OrganizationSchema;
    organization_statistics: OrganizationStatisticsSchema;
    people_import: PeopleImportSchema;
    people_import_conflict: PeopleImportConflictSchema;
    people_import_history: PeopleImportHistorySchema;
    person: PersonSchema;
    person_app: PersonAppSchema;
    person_merger: PersonMergerSchema;
    phone_number: PhoneNumberSchema;
    platform_notification: PlatformNotificationSchema;
    report: ReportSchema;
    rule: RuleSchema;
    school_option: SchoolOptionSchema;
    service_time: ServiceTimeSchema;
    social_profile: SocialProfileSchema;
    spam_email_address: SpamEmailAddressSchema;
    tab: TabSchema;
    workflow: WorkflowSchema;
    workflow_assignee_summary: WorkflowAssigneeSummarySchema;
    workflow_assignee_workflow_summary: WorkflowAssigneeWorkflowSummarySchema;
    workflow_card: WorkflowCardSchema;
    workflow_card_activity: WorkflowCardActivitySchema;
    workflow_card_note: WorkflowCardNoteSchema;
    workflow_category: WorkflowCategorySchema;
    workflow_share: WorkflowShareSchema;
    workflow_step: WorkflowStepSchema;
    workflow_step_assignee_summary: WorkflowStepAssigneeSummarySchema;
};

/** Edges available from the product root (`/people/v2`). */
export type PeopleRoot = {
    addresses: { vertex: 'address'; many: true; filters: never; create: false };
    apps: { vertex: 'app'; many: true; filters: never; create: false };
    background_checks: { vertex: 'background_check'; many: true; filters:
        | 'awaiting_applicant'
        | 'canceled'
        | 'complete_clear'
        | 'complete_not_clear'
        | 'current'
        | 'expired'
        | 'expired_invitation'
        | 'needs_review'
        | 'not_expired'
        | 'report_processing'; create: false };
    birthday_people: { vertex: 'birthday_people'; many: true; filters: never; create: false };
    campuses: { vertex: 'campus'; many: true; filters: never; create: true };
    carriers: { vertex: 'carrier'; many: true; filters: never; create: false };
    emails: { vertex: 'email'; many: true; filters: never; create: false };
    field_data: { vertex: 'field_datum'; many: true; filters: never; create: false };
    field_definitions: { vertex: 'field_definition'; many: true; filters: 'include_deleted'; create: false };
    form_categories: { vertex: 'form_category'; many: true; filters: never; create: true };
    forms: { vertex: 'form'; many: true; filters:
        | 'archived'
        | 'closed'
        | 'not_archived'
        | 'open'
        | 'recently_deleted'
        | 'recently_viewed'
        | 'unassigned'
        | 'with_recoverable'; create: false };
    households: { vertex: 'household'; many: true; filters: never; create: true };
    inactive_reasons: { vertex: 'inactive_reason'; many: true; filters: never; create: true };
    list_categories: { vertex: 'list_category'; many: true; filters: never; create: true };
    lists: { vertex: 'list'; many: true; filters:
        | 'auto_refresh_enabled'
        | 'can_manage'
        | 'has_active_automations'
        | 'mailchimp_connected'
        | 'needs_attention'
        | 'recently_viewed'
        | 'starred'
        | 'unassigned'; create: false };
    marital_statuses: { vertex: 'marital_status'; many: true; filters: never; create: true };
    /** The person you are authenticated as (`GET /people/v2/me`). */
    me: { vertex: 'person'; many: false; filters: never; create: false };
    membership_types: { vertex: 'membership_type'; many: true; filters: never; create: true };
    message_groups: { vertex: 'message_group'; many: true; filters: never; create: false };
    messages: { vertex: 'message'; many: true; filters: 'created_after'; create: false };
    name_prefixes: { vertex: 'name_prefix'; many: true; filters: never; create: true };
    name_suffixes: { vertex: 'name_suffix'; many: true; filters: never; create: true };
    note_categories: { vertex: 'note_category'; many: true; filters: 'view_creatable'; create: true };
    note_category_subscriptions: { vertex: 'note_category_subscription'; many: true; filters: never; create: false };
    notes: { vertex: 'note'; many: true; filters: never; create: false };
    people: { vertex: 'person'; many: true; filters: 'admins' | 'created_since' | 'organization_admins'; create: true };
    people_imports: { vertex: 'people_import'; many: true; filters: never; create: false };
    person_mergers: { vertex: 'person_merger'; many: true; filters: never; create: false };
    phone_numbers: { vertex: 'phone_number'; many: true; filters: never; create: false };
    reports: { vertex: 'report'; many: true; filters: never; create: true };
    school_options: { vertex: 'school_option'; many: true; filters: never; create: true };
    social_profiles: { vertex: 'social_profile'; many: true; filters: never; create: false };
    spam_email_addresses: { vertex: 'spam_email_address'; many: true; filters: never; create: false };
    stats: { vertex: 'organization_statistics'; many: true; filters: never; create: false };
    tabs: { vertex: 'tab'; many: true; filters: 'with_field_definitions'; create: true };
    workflow_assignee_summaries: { vertex: 'workflow_assignee_summary'; many: true; filters: never; create: false };
    workflows: { vertex: 'workflow'; many: true; filters:
        | 'archived'
        | 'has_my_cards'
        | 'manage_cards_allowed'
        | 'needs_attention'
        | 'not_archived'
        | 'only_deleted'
        | 'recently_deleted'
        | 'recently_viewed'
        | 'unassigned'
        | 'with_deleted'
        | 'with_recoverable'
        | 'with_steps'; create: true };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<PeopleSchema>, AssertRoot<PeopleRoot>];

/**
 * An address represents a physical and/or mailing address for a person.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/address
 */
export type Address = PcoResource<AddressSchema>;
/**
 * Attributes of {@link Address}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/address
 */
export type AddressAttributes = AddressSchema['attributes'];

/**
 * An app is one of the handful of apps that Planning Center offers that organizations can subscribe to, e.g. Services, Registrations, etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/app
 */
export type App = PcoResource<AppSchema>;
/**
 * Attributes of {@link App}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/app
 */
export type AppAttributes = AppSchema['attributes'];

/**
 * Background Checks for a Person
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/background_check
 */
export type BackgroundCheck = PcoResource<BackgroundCheckSchema>;
/**
 * Attributes of {@link BackgroundCheck}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/background_check
 */
export type BackgroundCheckAttributes = BackgroundCheckSchema['attributes'];

/**
 * Returns upcoming birthdays for the organization.
 *
 * Note: This endpoint will always only return the first 15 people having a birthday in the next 30 days, ordered by birthday, ascending.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/birthday_people
 */
export type BirthdayPeople = PcoResource<BirthdayPeopleSchema>;
/**
 * Attributes of {@link BirthdayPeople}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/birthday_people
 */
export type BirthdayPeopleAttributes = BirthdayPeopleSchema['attributes'];

/**
 * A Campus is a location belonging to an Organization
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/campus
 */
export type Campus = PcoResource<CampusSchema>;
/**
 * Attributes of {@link Campus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/campus
 */
export type CampusAttributes = CampusSchema['attributes'];

/**
 * A Carrier resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/carrier
 */
export type Carrier = PcoResource<CarrierSchema>;
/**
 * Attributes of {@link Carrier}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/carrier
 */
export type CarrierAttributes = CarrierSchema['attributes'];

/**
 * A condition is an individual criterion used by a List Rule.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/condition
 */
export type Condition = PcoResource<ConditionSchema>;
/**
 * Attributes of {@link Condition}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/condition
 */
export type ConditionAttributes = ConditionSchema['attributes'];

/**
 * A Connected Person is an account from a different organization linked to an account in this organization.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/connected_person
 */
export type ConnectedPerson = PcoResource<ConnectedPersonSchema>;
/**
 * Attributes of {@link ConnectedPerson}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/connected_person
 */
export type ConnectedPersonAttributes = ConnectedPersonSchema['attributes'];

/**
 * A custom sender that can be used when sending emails.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/custom_sender
 */
export type CustomSender = PcoResource<CustomSenderSchema>;
/**
 * Attributes of {@link CustomSender}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/custom_sender
 */
export type CustomSenderAttributes = CustomSenderSchema['attributes'];

/**
 * An email represents an email address and location.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/email
 */
export type Email = PcoResource<EmailSchema>;
/**
 * Attributes of {@link Email}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/email
 */
export type EmailAttributes = EmailSchema['attributes'];

/**
 * A field datum is an individual piece of data for a custom field.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_datum
 */
export type FieldDatum = PcoResource<FieldDatumSchema>;
/**
 * Attributes of {@link FieldDatum}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_datum
 */
export type FieldDatumAttributes = FieldDatumSchema['attributes'];

/**
 * A field definition represents a custom field -- its name, data type, etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_definition
 */
export type FieldDefinition = PcoResource<FieldDefinitionSchema>;
/**
 * Attributes of {@link FieldDefinition}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_definition
 */
export type FieldDefinitionAttributes = FieldDefinitionSchema['attributes'];

/**
 * A field option represents an individual option for a custom field of type "select" or "checkboxes".
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_option
 */
export type FieldOption = PcoResource<FieldOptionSchema>;
/**
 * Attributes of {@link FieldOption}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/field_option
 */
export type FieldOptionAttributes = FieldOptionSchema['attributes'];

/**
 * A custom form for people to fill out.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form
 */
export type Form = PcoResource<FormSchema>;
/**
 * Attributes of {@link Form}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form
 */
export type FormAttributes = FormSchema['attributes'];

/**
 * A Form Category
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_category
 */
export type FormCategory = PcoResource<FormCategorySchema>;
/**
 * Attributes of {@link FormCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_category
 */
export type FormCategoryAttributes = FormCategorySchema['attributes'];

/**
 * A field in a custom form.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field
 */
export type FormField = PcoResource<FormFieldSchema>;
/**
 * Attributes of {@link FormField}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field
 */
export type FormFieldAttributes = FormFieldSchema['attributes'];

/**
 * A rule that conditionally shows a form field based on the answer given to another (trigger) field.
 *
 * A condition belongs to the `form_field` it shows, and points at a `trigger_form_field` whose answer determines whether that field is displayed. A form field can have at most one condition. The trigger is matched in one of two ways:
 *
 * - `trigger_form_field_option` — the condition is met when the answer to the trigger field is this option (used for option-based fields such as dropdowns, gender, campus, etc.).
 * - `trigger_form_field_option_value` — the condition is met when the answer to the trigger field equals this string (used for boolean custom fields).
 *
 * When neither is set, the condition is met whenever the trigger field has any answer.
 *
 * Conditions are created, updated, and destroyed under the form field they belong to (`POST`/`PATCH`/`DELETE .../fields/{id}/form_field_conditions`). The `form_field` and `trigger_form_field` must both belong to the same form, and the `trigger_form_field_option` must belong to the `trigger_form_field`. Writing requires permission to manage the form.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field_condition
 */
export type FormFieldCondition = PcoResource<FormFieldConditionSchema>;
/**
 * Attributes of {@link FormFieldCondition}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field_condition
 */
export type FormFieldConditionAttributes = FormFieldConditionSchema['attributes'];

/**
 * A field option on a custom form field.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field_option
 */
export type FormFieldOption = PcoResource<FormFieldOptionSchema>;
/**
 * Attributes of {@link FormFieldOption}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_field_option
 */
export type FormFieldOptionAttributes = FormFieldOptionSchema['attributes'];

/**
 * A form submission represents a single completed entry submitted through a Planning Center form.
 *
 * ### Creating submissions
 *
 * `POST` is supported so external integrations can record submissions captured outside of Church Center — for example, paper forms run through OCR. Creating a submission requires the access token to belong to a user who (1) has overall People permissions of Editor or above and (2) can manage the target form (a Manager, or a user with a `manage` `FormShare`).
 *
 * ### Identifying the submitter
 *
 * Provide either `person_id` (an existing person in your organization) or `person_attributes`. When `person_attributes` is supplied, the API matches against existing profiles by first name (or given name or nickname) + last name + email address. If no match is found, a new person is created automatically.
 *
 * `person_attributes` accepts `first_name`, `last_name`, and `emails_attributes` (an array with at least one `{ "location": "...", "address": "..." }` hash).
 *
 * ### Form values
 *
 * Pass each answer as an `included` resource of type `FormSubmissionValue`, with `form_field_id` referencing a field on the form. The shape of `value` depends on the field's `field_type`: plain fields take a string, phone and address fields take an object, and file fields take an array of uploaded file references. See the `FormSubmissionValue` vertex for the full list of shapes and for how to upload files.
 *
 * ```
 * {
 *   "data": { "attributes": { "person_id": "1" } },
 *   "included": [
 *     { "type": "FormSubmissionValue", "attributes": { "form_field_id": "10", "value": "Blue" } },
 *     { "type": "FormSubmissionValue", "attributes": { "form_field_id": "11", "value": { "number": "555-555-1234", "location": "Mobile" } } },
 *     { "type": "FormSubmissionValue", "attributes": { "form_field_id": "12", "value": { "location": "Home", "street": "123 Main St", "city": "Carlsbad", "state": "CA", "zip": "92008", "country_code": "US" } } },
 *     { "type": "FormSubmissionValue", "attributes": { "form_field_id": "13", "value": [{ "fileID": "us4-2b1f6c0e-5d3a-4f7e-9c21-8a6d0e4b7f10", "fileName": "waiver.pdf" }] } }
 *   ]
 * }
 * ```
 *
 * One important note: if the form field has options (for example, a checkboxes or dropdown field), the submitted `value` should be the ID of the selected option, not the option's text.
 *
 * ### Side effects
 *
 * A submission triggers the same side effects as a Church Center submission: notification emails to the form's subscribers, a confirmation email to the submitter (if the form is configured to send one), workflow card creation for workflow answer fields, and profile updates for contact info, birthdate, gender, household, custom fields, and other profile data.
 *
 * The access token's user is recorded as the submitter, unless they are the person the submission is for. Profile updates from the submission are attributed to that user in the person's history.
 *
 * When the resolved person is brand new (created by this submission), profile updates happen immediately and the submission is auto-verified. When the resolved person already exists and the form contains verification-required fields, a verification email is sent first; profile updates apply only after the submitter clicks the verification link — matching the behavior of an unauthenticated Church Center submission.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_submission
 */
export type FormSubmission = PcoResource<FormSubmissionSchema>;
/**
 * Attributes of {@link FormSubmission}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_submission
 */
export type FormSubmissionAttributes = FormSubmissionSchema['attributes'];

/**
 * A single answer to a single field within a form submission.
 *
 * When creating a `FormSubmission`, supply one `FormSubmissionValue` per answered field as a JSON:API `included` resource. Each must reference a `form_field_id` belonging to the parent form; values referencing fields on other forms are silently discarded. Blank values are also discarded.
 *
 * `value` is write-only. It is accepted when creating a submission but is never returned when reading one. Read answers back through `display_value` and, for file fields, `attachments`.
 *
 * ### Uploading files
 *
 * File answers reference files that have already been uploaded to the Planning Center upload service. Upload each file first with a multipart `POST` to `https://upload.planningcenteronline.com/v2/files`, one file per request. The request authenticates like any other Planning Center API request: a personal access token as HTTP Basic, or an OAuth access token as a `Bearer` token. It does not have to be the same credential that later creates the submission.
 *
 * ```
 * curl -X POST https://upload.planningcenteronline.com/v2/files   -u <application id>:<secret>   -F "file=@waiver.pdf"
 * ```
 *
 * The response lists the uploaded file under `data`. Use `data[0].id` as `fileID` and `data[0].attributes.name` as `fileName`. `fileID` must be sent exactly as returned, including its datacenter prefix (such as `us4-`).
 *
 * Uploads are temporary. `data[0].attributes.expires_at` is 60 minutes after the upload, so create the submission soon after uploading. People copies the file into its own storage when the submission is created, and that copy is unaffected by the upload expiring.
 *
 * A file answer that is malformed, lacks the prefix, or points at an expired or unknown upload fails the request with a `422` validation error on `value` that says which.
 *
 * ```
 * {
 *   "data": { "attributes": { "person_id": "1" } },
 *   "included": [
 *     {
 *       "type": "FormSubmissionValue",
 *       "attributes": {
 *         "form_field_id": "42",
 *         "value": [{ "fileID": "us4-2b1f6c0e-5d3a-4f7e-9c21-8a6d0e4b7f10", "fileName": "waiver.pdf" }]
 *       }
 *     }
 *   ]
 * }
 * ```
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_submission_value
 */
export type FormSubmissionValue = PcoResource<FormSubmissionValueSchema>;
/**
 * Attributes of {@link FormSubmissionValue}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/form_submission_value
 */
export type FormSubmissionValueAttributes = FormSubmissionValueSchema['attributes'];

/**
 * A Grade resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/grade
 */
export type Grade = PcoResource<GradeSchema>;
/**
 * Attributes of {@link Grade}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/grade
 */
export type GradeAttributes = GradeSchema['attributes'];

/**
 * A household links people together and can have a primary contact. To add a person to an existing household, use the HouseholdMemberships endpoint.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/household
 */
export type Household = PcoResource<HouseholdSchema>;
/**
 * Attributes of {@link Household}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/household
 */
export type HouseholdAttributes = HouseholdSchema['attributes'];

/**
 * A household membership is the linking record between a household and a person.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/household_membership
 */
export type HouseholdMembership = PcoResource<HouseholdMembershipSchema>;
/**
 * Attributes of {@link HouseholdMembership}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/household_membership
 */
export type HouseholdMembershipAttributes = HouseholdMembershipSchema['attributes'];

/**
 * An inactive reason is a small bit of text indicating why a member is no longer active.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/inactive_reason
 */
export type InactiveReason = PcoResource<InactiveReasonSchema>;
/**
 * Attributes of {@link InactiveReason}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/inactive_reason
 */
export type InactiveReasonAttributes = InactiveReasonSchema['attributes'];

/**
 * A list is a powerful tool for finding and grouping people together using any criteria imaginable.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list
 */
export type List = PcoResource<ListSchema>;
/**
 * Attributes of {@link List}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list
 */
export type ListAttributes = ListSchema['attributes'];

/**
 * A List Category
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_category
 */
export type ListCategory = PcoResource<ListCategorySchema>;
/**
 * Attributes of {@link ListCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_category
 */
export type ListCategoryAttributes = ListCategorySchema['attributes'];

/**
 * A list result
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_result
 */
export type ListResult = PcoResource<ListResultSchema>;
/**
 * Attributes of {@link ListResult}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_result
 */
export type ListResultAttributes = ListResultSchema['attributes'];

/**
 * A list share indicates who has access to edit a list.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_share
 */
export type ListShare = PcoResource<ListShareSchema>;
/**
 * Attributes of {@link ListShare}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_share
 */
export type ListShareAttributes = ListShareSchema['attributes'];

/**
 * A starred list for a person indicates it is special in some way
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_star
 */
export type ListStar = PcoResource<ListStarSchema>;
/**
 * Attributes of {@link ListStar}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/list_star
 */
export type ListStarAttributes = ListStarSchema['attributes'];

/**
 * The status of syncing a List with Mailchimp.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/mailchimp_sync_status
 */
export type MailchimpSyncStatus = PcoResource<MailchimpSyncStatusSchema>;
/**
 * Attributes of {@link MailchimpSyncStatus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/mailchimp_sync_status
 */
export type MailchimpSyncStatusAttributes = MailchimpSyncStatusSchema['attributes'];

/**
 * A martial status represents a member's current status, e.g. married, single, etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/marital_status
 */
export type MaritalStatus = PcoResource<MaritalStatusSchema>;
/**
 * Attributes of {@link MaritalStatus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/marital_status
 */
export type MaritalStatusAttributes = MaritalStatusSchema['attributes'];

/**
 * A profile's membership type, e.g. Visitor, Regular Attender, Member, etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/membership_type
 */
export type MembershipType = PcoResource<MembershipTypeSchema>;
/**
 * Attributes of {@link MembershipType}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/membership_type
 */
export type MembershipTypeAttributes = MembershipTypeSchema['attributes'];

/**
 * A message is an individual email or sms text sent to a member. Every message has a parent message group.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/message
 */
export type Message = PcoResource<MessageSchema>;
/**
 * Attributes of {@link Message}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/message
 */
export type MessageAttributes = MessageSchema['attributes'];

/**
 * A message group represents one or more emails or text messages sent from one of the Planning Center apps. The message group indicates the from person, app, etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/message_group
 */
export type MessageGroup = PcoResource<MessageGroupSchema>;
/**
 * Attributes of {@link MessageGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/message_group
 */
export type MessageGroupAttributes = MessageGroupSchema['attributes'];

/**
 * A name prefix is one of Mr., Mrs., etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/name_prefix
 */
export type NamePrefix = PcoResource<NamePrefixSchema>;
/**
 * Attributes of {@link NamePrefix}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/name_prefix
 */
export type NamePrefixAttributes = NamePrefixSchema['attributes'];

/**
 * A name suffix is one of Sr., Jr., etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/name_suffix
 */
export type NameSuffix = PcoResource<NameSuffixSchema>;
/**
 * Attributes of {@link NameSuffix}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/name_suffix
 */
export type NameSuffixAttributes = NameSuffixSchema['attributes'];

/**
 * A note is text with a category connected to a person’s profile.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note
 */
export type Note = PcoResource<NoteSchema>;
/**
 * Attributes of {@link Note}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note
 */
export type NoteAttributes = NoteSchema['attributes'];

/**
 * A Note Category
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category
 */
export type NoteCategory = PcoResource<NoteCategorySchema>;
/**
 * Attributes of {@link NoteCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category
 */
export type NoteCategoryAttributes = NoteCategorySchema['attributes'];

/**
 * A note category share defines who can view notes in a category.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category_share
 */
export type NoteCategoryShare = PcoResource<NoteCategoryShareSchema>;
/**
 * Attributes of {@link NoteCategoryShare}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category_share
 */
export type NoteCategoryShareAttributes = NoteCategoryShareSchema['attributes'];

/**
 * A subscription for note categories
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category_subscription
 */
export type NoteCategorySubscription = PcoResource<NoteCategorySubscriptionSchema>;
/**
 * Attributes of {@link NoteCategorySubscription}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/note_category_subscription
 */
export type NoteCategorySubscriptionAttributes = NoteCategorySubscriptionSchema['attributes'];

/**
 * The organization represents a single church. Every other resource is scoped to this record.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * Returns statistics for the organization.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/organization_statistics
 */
export type OrganizationStatistics = PcoResource<OrganizationStatisticsSchema>;
/**
 * Attributes of {@link OrganizationStatistics}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/organization_statistics
 */
export type OrganizationStatisticsAttributes = OrganizationStatisticsSchema['attributes'];

/**
 * A PeopleImport is a record of an ongoing or previous import from a CSV file.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import
 */
export type PeopleImport = PcoResource<PeopleImportSchema>;
/**
 * Attributes of {@link PeopleImport}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import
 */
export type PeopleImportAttributes = PeopleImportSchema['attributes'];

/**
 * A PeopleImportConflict is a record of change that will occur if the parent PeopleImport is completed.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import_conflict
 */
export type PeopleImportConflict = PcoResource<PeopleImportConflictSchema>;
/**
 * Attributes of {@link PeopleImportConflict}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import_conflict
 */
export type PeopleImportConflictAttributes = PeopleImportConflictSchema['attributes'];

/**
 * A PeopleImportHistory is a record of change that occurred when the parent PeopleImport was completed.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import_history
 */
export type PeopleImportHistory = PcoResource<PeopleImportHistorySchema>;
/**
 * Attributes of {@link PeopleImportHistory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/people_import_history
 */
export type PeopleImportHistoryAttributes = PeopleImportHistorySchema['attributes'];

/**
 * A person record represents a single member/user of the application. Each person has different permissions that determine how the user can use this app (if at all).
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A Person App is the relationship between a Person and an App.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person_app
 */
export type PersonApp = PcoResource<PersonAppSchema>;
/**
 * Attributes of {@link PersonApp}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person_app
 */
export type PersonAppAttributes = PersonAppSchema['attributes'];

/**
 * A Person Merger is the history of profiles that were merged into other profiles.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person_merger
 */
export type PersonMerger = PcoResource<PersonMergerSchema>;
/**
 * Attributes of {@link PersonMerger}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/person_merger
 */
export type PersonMergerAttributes = PersonMergerSchema['attributes'];

/**
 * A phone number represents a single telephone number and location.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/phone_number
 */
export type PhoneNumber = PcoResource<PhoneNumberSchema>;
/**
 * Attributes of {@link PhoneNumber}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/phone_number
 */
export type PhoneNumberAttributes = PhoneNumberSchema['attributes'];

/**
 * A Platform Notification is a suite-wide notification that shows at the top of each application's screen until dismissed by the user.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/platform_notification
 */
export type PlatformNotification = PcoResource<PlatformNotificationSchema>;
/**
 * Attributes of {@link PlatformNotification}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/platform_notification
 */
export type PlatformNotificationAttributes = PlatformNotificationSchema['attributes'];

/**
 * A report is editable liquid syntax that provides a powerful tool for presenting your Lists however you want.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/report
 */
export type Report = PcoResource<ReportSchema>;
/**
 * Attributes of {@link Report}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/report
 */
export type ReportAttributes = ReportSchema['attributes'];

/**
 * A rule belongs to a List and groups conditions together.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/rule
 */
export type Rule = PcoResource<RuleSchema>;
/**
 * Attributes of {@link Rule}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/rule
 */
export type RuleAttributes = RuleSchema['attributes'];

/**
 * A school option represents a school name, school type, grades, etc. and can be selected for a person.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/school_option
 */
export type SchoolOption = PcoResource<SchoolOptionSchema>;
/**
 * Attributes of {@link SchoolOption}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/school_option
 */
export type SchoolOptionAttributes = SchoolOptionSchema['attributes'];

/**
 * A ServiceTime Resource
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/service_time
 */
export type ServiceTime = PcoResource<ServiceTimeSchema>;
/**
 * Attributes of {@link ServiceTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/service_time
 */
export type ServiceTimeAttributes = ServiceTimeSchema['attributes'];

/**
 * A social profile represents a members's Twitter, Facebook, or other social media account.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/social_profile
 */
export type SocialProfile = PcoResource<SocialProfileSchema>;
/**
 * Attributes of {@link SocialProfile}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/social_profile
 */
export type SocialProfileAttributes = SocialProfileSchema['attributes'];

/**
 * An email address that is marked as spam
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/spam_email_address
 */
export type SpamEmailAddress = PcoResource<SpamEmailAddressSchema>;
/**
 * Attributes of {@link SpamEmailAddress}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/spam_email_address
 */
export type SpamEmailAddressAttributes = SpamEmailAddressSchema['attributes'];

/**
 * A tab is a custom tab and groups like field definitions.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/tab
 */
export type Tab = PcoResource<TabSchema>;
/**
 * Attributes of {@link Tab}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/tab
 */
export type TabAttributes = TabSchema['attributes'];

/**
 * A Workflow
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow
 */
export type Workflow = PcoResource<WorkflowSchema>;
/**
 * Attributes of {@link Workflow}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow
 */
export type WorkflowAttributes = WorkflowSchema['attributes'];

/**
 * Aggregated card counts for an assignee across all visible workflows
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_assignee_summary
 */
export type WorkflowAssigneeSummary = PcoResource<WorkflowAssigneeSummarySchema>;
/**
 * Attributes of {@link WorkflowAssigneeSummary}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_assignee_summary
 */
export type WorkflowAssigneeSummaryAttributes = WorkflowAssigneeSummarySchema['attributes'];

/**
 * Per-workflow card counts for a specific assignee
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_assignee_workflow_summary
 */
export type WorkflowAssigneeWorkflowSummary = PcoResource<WorkflowAssigneeWorkflowSummarySchema>;
/**
 * Attributes of {@link WorkflowAssigneeWorkflowSummary}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_assignee_workflow_summary
 */
export type WorkflowAssigneeWorkflowSummaryAttributes = WorkflowAssigneeWorkflowSummarySchema['attributes'];

/**
 * A Card
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card
 */
export type WorkflowCard = PcoResource<WorkflowCardSchema>;
/**
 * Attributes of {@link WorkflowCard}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card
 */
export type WorkflowCardAttributes = WorkflowCardSchema['attributes'];

/**
 * Workflow Card Activity is a record of an action performed on a card
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card_activity
 */
export type WorkflowCardActivity = PcoResource<WorkflowCardActivitySchema>;
/**
 * Attributes of {@link WorkflowCardActivity}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card_activity
 */
export type WorkflowCardActivityAttributes = WorkflowCardActivitySchema['attributes'];

/**
 * Workflow Note is a note that has been made on a Workflow Card
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card_note
 */
export type WorkflowCardNote = PcoResource<WorkflowCardNoteSchema>;
/**
 * Attributes of {@link WorkflowCardNote}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_card_note
 */
export type WorkflowCardNoteAttributes = WorkflowCardNoteSchema['attributes'];

/**
 * A Workflow Category
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_category
 */
export type WorkflowCategory = PcoResource<WorkflowCategorySchema>;
/**
 * Attributes of {@link WorkflowCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_category
 */
export type WorkflowCategoryAttributes = WorkflowCategorySchema['attributes'];

/**
 * A workflow share defines who can access a workflow.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_share
 */
export type WorkflowShare = PcoResource<WorkflowShareSchema>;
/**
 * Attributes of {@link WorkflowShare}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_share
 */
export type WorkflowShareAttributes = WorkflowShareSchema['attributes'];

/**
 * A Step
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_step
 */
export type WorkflowStep = PcoResource<WorkflowStepSchema>;
/**
 * Attributes of {@link WorkflowStep}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_step
 */
export type WorkflowStepAttributes = WorkflowStepSchema['attributes'];

/**
 * The ready and snoozed count for an assignee & step
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_step_assignee_summary
 */
export type WorkflowStepAssigneeSummary = PcoResource<WorkflowStepAssigneeSummarySchema>;
/**
 * Attributes of {@link WorkflowStepAssigneeSummary}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/people/versions/2026-10-05/vertices/workflow_step_assignee_summary
 */
export type WorkflowStepAssigneeSummaryAttributes = WorkflowStepAssigneeSummarySchema['attributes'];
