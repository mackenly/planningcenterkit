/**
 * Planning Center Services API (`/services/v2`).
 *
 * Generated from the Planning Center API documentation, version 2018-11-01, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Services: paths and capabilities only. */
export const servicesGraph = {
    product: 'services',
    slug: 'services',
    basePath: '/services/v2',
    version: '2018-11-01',
    rootVertex: 'organization',
    root: {
        attachment_types: { vertex: 'attachment_type', many: true, canCreate: false },
        chat: { vertex: 'chat', many: true, canCreate: false },
        email_templates: { vertex: 'email_template', many: true, canCreate: true },
        folders: { vertex: 'folder', many: true, canCreate: true },
        media: { vertex: 'media', many: true, canCreate: true },
        people: { vertex: 'person', many: true, canCreate: false },
        plans: { vertex: 'organization', many: true, canCreate: false },
        report_templates: { vertex: 'report_template', many: true, canCreate: false },
        series: { vertex: 'series', many: true, canCreate: false },
        service_types: { vertex: 'service_type', many: true, canCreate: true },
        songs: { vertex: 'song', many: true, canCreate: true },
        tag_groups: { vertex: 'tag_group', many: true, canCreate: false },
        teams: { vertex: 'team', many: true, canCreate: true },
    },
    vertices: {
        arrangement: {
            type: 'Arrangement',
            edges: {
                attachments: { vertex: 'attachment', many: true, canCreate: true },
                keys: { vertex: 'key', many: true, canCreate: true },
                sections: { vertex: 'arrangement_sections', many: false, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: ['archive', 'assign_tags', 'unarchive'],
            canUpdate: true,
            canDelete: true,
        },
        arrangement_sections: {
            type: 'ArrangementSections',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        attachment: {
            type: 'Attachment',
            edges: {
                zooms: { vertex: 'zoom', many: true, canCreate: true },
            },
            actions: ['open', 'preview'],
            canUpdate: true,
            canDelete: true,
        },
        attachment_activity: {
            type: 'AttachmentActivity',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        attachment_type: {
            type: 'AttachmentType',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/services/v2/attachment_types',
        },
        attachment_type_group: {
            type: 'AttachmentTypeGroup',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        attendance: {
            type: 'Attendance',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        available_signup: {
            type: 'AvailableSignup',
            edges: {
                signup_sheets: { vertex: 'signup_sheet', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        blockout: {
            type: 'Blockout',
            edges: {
                blockout_dates: { vertex: 'blockout_date', many: true, canCreate: false },
                blockout_exceptions: { vertex: 'blockout_exception', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        blockout_date: {
            type: 'BlockoutDate',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        blockout_exception: {
            type: 'BlockoutException',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        blockout_schedule_conflict: {
            type: 'BlockoutScheduleConflict',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        chat: {
            type: 'Chat',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/services/v2/chats',
        },
        contributor: {
            type: 'Contributor',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        custom_slide: {
            type: 'CustomSlide',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        email: {
            type: 'Email',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        email_template: {
            type: 'EmailTemplate',
            edges: {},
            actions: ['render'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/services/v2/email_templates',
        },
        email_template_rendered_response: {
            type: 'EmailTemplateRenderedResponse',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        folder: {
            type: 'Folder',
            edges: {
                folders: { vertex: 'folder', many: true, canCreate: false },
                service_types: { vertex: 'service_type', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/services/v2/folders',
        },
        folder_path: {
            type: 'FolderPath',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        item: {
            type: 'Item',
            edges: {
                arrangement: { vertex: 'arrangement', many: true, canCreate: false },
                attachments: { vertex: 'attachment', many: true, canCreate: true },
                custom_slides: { vertex: 'custom_slide', many: true, canCreate: true },
                item_assignments: { vertex: 'item_assignment', many: true, canCreate: true },
                item_notes: { vertex: 'item_note', many: true, canCreate: true },
                item_times: { vertex: 'item_time', many: true, canCreate: false },
                key: { vertex: 'key', many: true, canCreate: false },
                media: { vertex: 'media', many: true, canCreate: false },
                selected_attachment: { vertex: 'attachment', many: true, canCreate: false },
                selected_background: { vertex: 'attachment', many: true, canCreate: false },
                song: { vertex: 'song', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        item_assignment: {
            type: 'ItemAssignment',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: true,
        },
        item_note: {
            type: 'ItemNote',
            edges: {
                item_note_category: { vertex: 'item_note_category', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        item_note_category: {
            type: 'ItemNoteCategory',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        item_time: {
            type: 'ItemTime',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        key: {
            type: 'Key',
            edges: {
                attachments: { vertex: 'attachment', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        live: {
            type: 'Live',
            edges: {
                controller: { vertex: 'person', many: true, canCreate: false },
                current_item_time: { vertex: 'item_time', many: true, canCreate: false },
                items: { vertex: 'item', many: true, canCreate: false },
                next_item_time: { vertex: 'item_time', many: true, canCreate: false },
                service_type: { vertex: 'service_type', many: true, canCreate: false },
                watchable_plans: { vertex: 'plan', many: true, canCreate: false },
            },
            actions: ['go_to_next_item', 'go_to_previous_item', 'toggle_control'],
            canUpdate: true,
            canDelete: true,
        },
        live_controller: {
            type: 'LiveController',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        media: {
            type: 'Media',
            edges: {
                attachments: { vertex: 'attachment', many: true, canCreate: true },
                media_schedules: { vertex: 'media_schedule', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: ['archive', 'assign_tags', 'unarchive'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/services/v2/media',
        },
        media_schedule: {
            type: 'MediaSchedule',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        needed_position: {
            type: 'NeededPosition',
            edges: {
                team: { vertex: 'team', many: true, canCreate: false },
                time: { vertex: 'plan_time', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
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
                available_signups: { vertex: 'available_signup', many: true, canCreate: false },
                blockouts: { vertex: 'blockout', many: true, canCreate: true },
                emails: { vertex: 'email', many: true, canCreate: false },
                person_team_position_assignments: { vertex: 'person_team_position_assignment', many: true, canCreate: false },
                plan_people: { vertex: 'plan_person', many: true, canCreate: false },
                schedules: { vertex: 'schedule', many: true, canCreate: false },
                scheduling_preferences: { vertex: 'scheduling_preference', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
                team_leaders: { vertex: 'team_leader', many: true, canCreate: false },
                text_settings: { vertex: 'text_setting', many: true, canCreate: false },
            },
            actions: ['assign_tags', 'collapse_service_types', 'expand_service_types'],
            canUpdate: true,
            canDelete: false,
            canonicalPath: '/services/v2/people',
        },
        person_team_position_assignment: {
            type: 'PersonTeamPositionAssignment',
            edges: {
                person: { vertex: 'person', many: true, canCreate: false },
                team_position: { vertex: 'team_position', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        plan: {
            type: 'Plan',
            edges: {
                all_attachments: { vertex: 'attachment', many: true, canCreate: false },
                attachments: { vertex: 'attachment', many: true, canCreate: true },
                attendances: { vertex: 'attendance', many: true, canCreate: false },
                contributors: { vertex: 'contributor', many: true, canCreate: false },
                items: { vertex: 'item', many: true, canCreate: true },
                live: { vertex: 'live', many: true, canCreate: false },
                my_schedules: { vertex: 'schedule', many: true, canCreate: false },
                needed_positions: { vertex: 'needed_position', many: true, canCreate: true },
                next_plan: { vertex: 'plan', many: true, canCreate: false },
                notes: { vertex: 'plan_note', many: true, canCreate: true },
                plan_times: { vertex: 'plan_time', many: true, canCreate: true },
                previous_plan: { vertex: 'plan', many: true, canCreate: false },
                series: { vertex: 'series', many: true, canCreate: false },
                signup_teams: { vertex: 'team', many: true, canCreate: false },
                team_members: { vertex: 'plan_person', many: true, canCreate: true },
            },
            actions: ['autoschedule', 'import', 'item_reorder'],
            canUpdate: true,
            canDelete: true,
        },
        plan_import_metadata: {
            type: 'PlanImportMetadata',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        plan_note: {
            type: 'PlanNote',
            edges: {
                plan_note_category: { vertex: 'plan_note_category', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        plan_note_category: {
            type: 'PlanNoteCategory',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        plan_person: {
            type: 'PlanPerson',
            edges: {
                declined_plan_times: { vertex: 'plan_time', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
                plan: { vertex: 'plan', many: true, canCreate: false },
                plan_person_times: { vertex: 'plan_person_time', many: true, canCreate: false },
                plan_times: { vertex: 'plan_time', many: true, canCreate: false },
                team: { vertex: 'team', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        plan_person_time: {
            type: 'PlanPersonTime',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        plan_template: {
            type: 'PlanTemplate',
            edges: {
                items: { vertex: 'item', many: true, canCreate: true },
                notes: { vertex: 'plan_note', many: true, canCreate: true },
                team_members: { vertex: 'plan_person', many: true, canCreate: true },
            },
            actions: ['import', 'item_reorder'],
            canUpdate: true,
            canDelete: true,
        },
        plan_time: {
            type: 'PlanTime',
            edges: {
                split_team_rehearsal_assignments: { vertex: 'split_team_rehearsal_assignment', many: true, canCreate: true },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        public_view: {
            type: 'PublicView',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        report_template: {
            type: 'ReportTemplate',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/services/v2/report_templates',
        },
        schedule: {
            type: 'Schedule',
            edges: {
                declined_plan_times: { vertex: 'plan_time', many: true, canCreate: false },
                plan_times: { vertex: 'plan_time', many: true, canCreate: false },
                respond_to: { vertex: 'person', many: true, canCreate: false },
                team: { vertex: 'team', many: true, canCreate: false },
            },
            actions: ['accept', 'decline'],
            canUpdate: false,
            canDelete: false,
        },
        scheduled_person: {
            type: 'ScheduledPerson',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        scheduling_preference: {
            type: 'SchedulingPreference',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        series: {
            type: 'Series',
            edges: {
                plans: { vertex: 'plan', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/services/v2/series',
        },
        service_type: {
            type: 'ServiceType',
            edges: {
                attachments: { vertex: 'attachment', many: true, canCreate: true },
                item_note_categories: { vertex: 'item_note_category', many: true, canCreate: false },
                live_controllers: { vertex: 'live_controller', many: true, canCreate: false },
                plan_note_categories: { vertex: 'plan_note_category', many: true, canCreate: false },
                plan_person_times: { vertex: 'plan_person_time', many: true, canCreate: false },
                plan_templates: { vertex: 'plan_template', many: true, canCreate: true },
                plan_times: { vertex: 'plan_time', many: true, canCreate: false },
                plans: { vertex: 'plan', many: true, canCreate: true },
                public_view: { vertex: 'public_view', many: true, canCreate: false },
                team_positions: { vertex: 'team_position', many: true, canCreate: false },
                teams: { vertex: 'team', many: true, canCreate: true },
                time_preference_options: { vertex: 'time_preference_option', many: true, canCreate: false },
                unscoped_plans: { vertex: 'plan', many: true, canCreate: false },
            },
            actions: ['create_plans'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/services/v2/service_types',
        },
        service_type_path: {
            type: 'ServiceTypePath',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        signup_sheet: {
            type: 'SignupSheet',
            edges: {
                scheduled_people: { vertex: 'scheduled_person', many: true, canCreate: false },
                signup_sheet_metadata: { vertex: 'signup_sheet_metadata', many: true, canCreate: false },
            },
            actions: ['accept'],
            canUpdate: false,
            canDelete: false,
        },
        signup_sheet_metadata: {
            type: 'SignupSheetMetadata',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        skipped_attachment: {
            type: 'SkippedAttachment',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        song: {
            type: 'Song',
            edges: {
                arrangements: { vertex: 'arrangement', many: true, canCreate: true },
                attachments: { vertex: 'attachment', many: true, canCreate: true },
                last_scheduled_item: { vertex: 'item', many: true, canCreate: false },
                song_schedules: { vertex: 'song_schedule', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
                unscoped_arrangements: { vertex: 'arrangement', many: true, canCreate: false },
            },
            actions: ['assign_tags'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/services/v2/songs',
        },
        song_schedule: {
            type: 'SongSchedule',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        songbook_status: {
            type: 'SongbookStatus',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        split_team_rehearsal_assignment: {
            type: 'SplitTeamRehearsalAssignment',
            edges: {
                team: { vertex: 'team', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        tag: {
            type: 'Tag',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        tag_group: {
            type: 'TagGroup',
            edges: {
                folder: { vertex: 'folder', many: true, canCreate: false },
                tags: { vertex: 'tag', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/services/v2/tag_groups',
        },
        team: {
            type: 'Team',
            edges: {
                people: { vertex: 'person', many: true, canCreate: false },
                person_team_position_assignments: { vertex: 'person_team_position_assignment', many: true, canCreate: false },
                service_types: { vertex: 'service_type', many: true, canCreate: false },
                team_leaders: { vertex: 'team_leader', many: true, canCreate: false },
                team_positions: { vertex: 'team_position', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/services/v2/teams',
        },
        team_leader: {
            type: 'TeamLeader',
            edges: {
                people: { vertex: 'person', many: true, canCreate: false },
                team: { vertex: 'team', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        team_position: {
            type: 'TeamPosition',
            edges: {
                person_team_position_assignments: { vertex: 'person_team_position_assignment', many: true, canCreate: true },
                tags: { vertex: 'tag', many: true, canCreate: false },
                team: { vertex: 'team', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        text_setting: {
            type: 'TextSetting',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: false,
        },
        time_preference_option: {
            type: 'TimePreferenceOption',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        zoom: {
            type: 'Zoom',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Arrangement}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/arrangement
 */
export interface ArrangementSchema {
    type: 'Arrangement';
    attributes: {
        archived_at: string | null;
        bpm: number | null;
        /** A string of lyrics and chords. Supports standard and ChordPro formats. */
        chord_chart: string | null;
        chord_chart_chord_color: number | null;
        chord_chart_columns: number | null;
        chord_chart_font: string | null;
        /**
         * Possible Values:
         *
         * `10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `20`, `22`, `24`, `26`, `28`, `32`, `36`, `42`, `48`
         */
        chord_chart_font_size: number | null;
        chord_chart_key: string | null;
        created_at: string | null;
        has_chord_chart: boolean | null;
        has_chords: boolean | null;
        length: number | null;
        lyrics: string | null;
        lyrics_enabled: boolean | null;
        /**
         * Possible Values:
         *
         * - `2/2`
         *
         * - `2/4`
         *
         * - `3/2`
         *
         * - `3/4`
         *
         * - `4/2`
         *
         * - `4/4`
         *
         * - `5/4`
         *
         * - `6/4`
         *
         * - `3/8`
         *
         * - `6/8`
         *
         * - `7/4`
         *
         * - `7/8`
         *
         * - `9/8`
         *
         * - `12/4`
         *
         * - `12/8`
         */
        meter: string | null;
        name: string | null;
        notes: string | null;
        number_chart_enabled: boolean | null;
        numeral_chart_enabled: boolean | null;
        /**
         * Possible Values:
         *
         * - `0.0in`
         *
         * - `0.25in`
         *
         * - `0.5in`
         *
         * - `0.75in`
         *
         * - `1.0in`
         */
        print_margin: string | null;
        /**
         * Possible Values:
         *
         * - `Portrait`
         *
         * - `Landscape`
         */
        print_orientation: string | null;
        /**
         * Possible Values:
         *
         * - `Widescreen (16x9)`
         *
         * - `Fullscreen (4x3)`
         *
         * - `A4`
         *
         * - `Letter`
         *
         * - `Legal`
         *
         * - `11x17`
         */
        print_page_size: string | null;
        /**
         * An array of strings containing a label and a number describing the section:
         *
         * ['Verse 1', 'Chorus 1', 'Verse 2']
         */
        sequence: unknown[] | null;
        sequence_full: unknown[] | null;
        sequence_short: unknown[] | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'song' | 'updated_by';
    includes: 'keys' | 'sections';
    related: {
        created_by: 'person';
        keys: 'key';
        sections: 'arrangement_sections';
        song: 'song';
        updated_by: 'person';
    };
    where: {};
    whereOps: {};
    order: 'name';
    create: {
        bpm?: number | null;
        /** A string of lyrics and chords. Supports standard and ChordPro formats. */
        chord_chart?: string | null;
        chord_chart_chord_color?: number | null;
        chord_chart_columns?: number | null;
        chord_chart_font?: string | null;
        /**
         * Possible Values:
         *
         * `10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `20`, `22`, `24`, `26`, `28`, `32`, `36`, `42`, `48`
         */
        chord_chart_font_size?: number | null;
        chord_chart_key?: string | null;
        length?: number | null;
        lyrics_enabled?: boolean | null;
        /**
         * Possible Values:
         *
         * - `2/2`
         *
         * - `2/4`
         *
         * - `3/2`
         *
         * - `3/4`
         *
         * - `4/2`
         *
         * - `4/4`
         *
         * - `5/4`
         *
         * - `6/4`
         *
         * - `3/8`
         *
         * - `6/8`
         *
         * - `7/4`
         *
         * - `7/8`
         *
         * - `9/8`
         *
         * - `12/4`
         *
         * - `12/8`
         */
        meter?: string | null;
        name?: string | null;
        notes?: string | null;
        number_chart_enabled?: boolean | null;
        numeral_chart_enabled?: boolean | null;
        /**
         * Possible Values:
         *
         * - `0.0in`
         *
         * - `0.25in`
         *
         * - `0.5in`
         *
         * - `0.75in`
         *
         * - `1.0in`
         */
        print_margin?: string | null;
        /**
         * Possible Values:
         *
         * - `Portrait`
         *
         * - `Landscape`
         */
        print_orientation?: string | null;
        /**
         * Possible Values:
         *
         * - `Widescreen (16x9)`
         *
         * - `Fullscreen (4x3)`
         *
         * - `A4`
         *
         * - `Letter`
         *
         * - `Legal`
         *
         * - `11x17`
         */
        print_page_size?: string | null;
        /**
         * An array of strings containing a label and a number describing the section:
         *
         * ['Verse 1', 'Chorus 1', 'Verse 2']
         */
        sequence?: unknown[] | null;
    };
    update: {
        bpm?: number | null;
        /** A string of lyrics and chords. Supports standard and ChordPro formats. */
        chord_chart?: string | null;
        chord_chart_chord_color?: number | null;
        chord_chart_columns?: number | null;
        chord_chart_font?: string | null;
        /**
         * Possible Values:
         *
         * `10`, `11`, `12`, `13`, `14`, `15`, `16`, `18`, `20`, `22`, `24`, `26`, `28`, `32`, `36`, `42`, `48`
         */
        chord_chart_font_size?: number | null;
        chord_chart_key?: string | null;
        length?: number | null;
        lyrics_enabled?: boolean | null;
        /**
         * Possible Values:
         *
         * - `2/2`
         *
         * - `2/4`
         *
         * - `3/2`
         *
         * - `3/4`
         *
         * - `4/2`
         *
         * - `4/4`
         *
         * - `5/4`
         *
         * - `6/4`
         *
         * - `3/8`
         *
         * - `6/8`
         *
         * - `7/4`
         *
         * - `7/8`
         *
         * - `9/8`
         *
         * - `12/4`
         *
         * - `12/8`
         */
        meter?: string | null;
        name?: string | null;
        notes?: string | null;
        number_chart_enabled?: boolean | null;
        numeral_chart_enabled?: boolean | null;
        /**
         * Possible Values:
         *
         * - `0.0in`
         *
         * - `0.25in`
         *
         * - `0.5in`
         *
         * - `0.75in`
         *
         * - `1.0in`
         */
        print_margin?: string | null;
        /**
         * Possible Values:
         *
         * - `Portrait`
         *
         * - `Landscape`
         */
        print_orientation?: string | null;
        /**
         * Possible Values:
         *
         * - `Widescreen (16x9)`
         *
         * - `Fullscreen (4x3)`
         *
         * - `A4`
         *
         * - `Letter`
         *
         * - `Legal`
         *
         * - `11x17`
         */
        print_page_size?: string | null;
        /**
         * An array of strings containing a label and a number describing the section:
         *
         * ['Verse 1', 'Chorus 1', 'Verse 2']
         */
        sequence?: unknown[] | null;
    };
    delete: true;
    actions: 'archive' | 'assign_tags' | 'unarchive';
    edges: {
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
        keys: { vertex: 'key'; many: true; filters: never; create: true };
        sections: { vertex: 'arrangement_sections'; many: false; filters: never; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ArrangementSections}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/arrangement_sections
 */
export interface ArrangementSectionsSchema {
    type: 'ArrangementSections';
    attributes: {
        /**
         * Given an arrangement with the folowing `chord_chart`:
         *
         * ```
         * VERSE 1
         * D          Bm       G          D
         * Be thou my vision O Lord of my heart
         * A             Bm         G              A
         * naught be all else to me save that Thou art
         * ```
         *
         * The value will be:
         *
         * ```json
         * [
         *   {
         *     "label": "Verse",
         *     "lyrics": "Be thou my vision O Lord of my heart
         *
         * naught be all else to me save that Thou art",
         *     "breaks_at": null
         *   }
         * ]
         * ```
         */
        sections: unknown[] | null;
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
 * Type-level schema of {@link Attachment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment
 */
export interface AttachmentSchema {
    type: 'Attachment';
    attributes: {
        allow_mp3_download: boolean | null;
        attachable_type: string | null;
        content: string | null;
        content_type: string | null;
        created_at: string | null;
        deleted_at: string | null;
        display_name: string | null;
        downloadable: boolean | null;
        file_size: number | null;
        /**
         * Planning Center File UUID. Required only when creating a file attachment. See the "File Uploads" section of the API documentation for more information.
         *
         * Only available when requested with the `?fields` param
         */
        file_upload_identifier: string | null;
        filename: string | null;
        filetype: string | null;
        has_preview: boolean | null;
        import_to_item_details: boolean | null;
        licenses_purchased: number | null;
        licenses_remaining: number | null;
        licenses_used: number | null;
        linked_url: string | null;
        page_order: string | null;
        pco_type: string | null;
        remote_link: string | null;
        streamable: boolean | null;
        thumbnail_url: string | null;
        transposable: boolean | null;
        updated_at: string | null;
        url: string | null;
        web_streamable: boolean | null;
    };
    relationships:
        | 'administrator'
        | 'attachable'
        | 'attachment_types'
        | 'created_by'
        | 'updated_by';
    includes: 'zooms';
    related: {
        administrator: 'person';
        attachable: 'plan';
        attachment_types: 'attachment_type';
        created_by: 'person';
        updated_by: 'person';
        zooms: 'zoom';
    };
    where: {
        administrator_id: string | number;
        attachable_type: string;
        licenses_purchased: number;
    };
    whereOps: {};
    order: 'attachable_type' | 'created_at' | 'deleted_at' | 'filename' | 'filetype' | 'size';
    create: {
        attachment_type_ids?: string[];
        content?: string | null;
        /**
         * Planning Center File UUID. Required only when creating a file attachment. See the "File Uploads" section of the API documentation for more information.
         *
         * Only available when requested with the `?fields` param
         */
        file_upload_identifier?: string | null;
        filename?: string | null;
        import_to_item_details?: boolean | null;
        page_order?: string | null;
        remote_link?: string | null;
    };
    update: {
        attachment_type_ids?: string[];
        content?: string | null;
        /**
         * Planning Center File UUID. Required only when creating a file attachment. See the "File Uploads" section of the API documentation for more information.
         *
         * Only available when requested with the `?fields` param
         */
        file_upload_identifier?: string | null;
        filename?: string | null;
        import_to_item_details?: boolean | null;
        page_order?: string | null;
        remote_link?: string | null;
    };
    delete: true;
    actions: 'open' | 'preview';
    edges: {
        zooms: { vertex: 'zoom'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link AttachmentActivity}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_activity
 */
export interface AttachmentActivitySchema {
    type: 'AttachmentActivity';
    attributes: {
        activity_type: string | null;
        attachment_url: string | null;
        date: string | null;
    };
    relationships: 'attachment';
    includes: never;
    related: {
        attachment: 'attachment';
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
 * Type-level schema of {@link AttachmentType}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_type
 */
export interface AttachmentTypeSchema {
    type: 'AttachmentType';
    attributes: {
        aliases: string | null;
        built_in: boolean | null;
        capoed_chord_charts: boolean | null;
        chord_charts: boolean | null;
        exclusions: string | null;
        lyrics: boolean | null;
        name: string | null;
        number_charts: boolean | null;
        numeral_charts: boolean | null;
    };
    relationships: 'attachment_type_group';
    includes: never;
    related: {
        attachment_type_group: 'attachment_type_group';
    };
    where: {};
    whereOps: {};
    order: 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link AttachmentTypeGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_type_group
 */
export interface AttachmentTypeGroupSchema {
    type: 'AttachmentTypeGroup';
    attributes: {
        name: string | null;
        readonly: boolean | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Attendance}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attendance
 */
export interface AttendanceSchema {
    type: 'Attendance';
    attributes: {
        check_ins_event_id: string | null;
        check_ins_event_period_id: string | null;
        checked_in_at: string | null;
    };
    relationships: 'plan_person' | 'plan_time';
    includes: never;
    related: {
        plan_person: 'plan_person';
        plan_time: 'plan_time';
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
 * Type-level schema of {@link AvailableSignup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/available_signup
 */
export interface AvailableSignupSchema {
    type: 'AvailableSignup';
    attributes: {
        organization_name: string | null;
        planning_center_url: string | null;
        service_type_name: string | null;
        signups_available: boolean | null;
    };
    relationships: 'organization' | 'person' | 'service_type';
    includes: 'signup_sheets';
    related: {
        organization: 'organization';
        person: 'person';
        service_type: 'service_type';
        signup_sheets: 'signup_sheet';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        signup_sheets: { vertex: 'signup_sheet'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Blockout}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout
 */
export interface BlockoutSchema {
    type: 'Blockout';
    attributes: {
        created_at: string | null;
        description: string | null;
        ends_at: string | null;
        group_identifier: string | null;
        organization_name: string | null;
        reason: string | null;
        /**
         * Possible values:
         *
         * - no_repeat
         *
         * - every_1
         *
         * - every_2
         *
         * - every_3
         *
         * - every_4
         *
         * - every_5
         *
         * - every_6
         *
         * - every_7
         *
         * - every_8
         */
        repeat_frequency: string | null;
        /**
         * Possible values:
         *
         * - exact_day_of_month
         *
         * - week_of_month_1
         *
         * - week_of_month_2
         *
         * - week_of_month_3
         *
         * - week_of_month_4
         *
         * - week_of_month_last
         */
        repeat_interval: string | null;
        /**
         * Possible values:
         *
         * - daily
         *
         * - weekly
         *
         * - monthly
         *
         * - yearly
         */
        repeat_period: string | null;
        repeat_until: string | null;
        settings: string | null;
        share: boolean | null;
        starts_at: string | null;
        time_zone: string | null;
        updated_at: string | null;
    };
    relationships: 'organization' | 'person';
    includes: never;
    related: {
        organization: 'organization';
        person: 'person';
    };
    where: {
        group_identifier: string;
    };
    whereOps: {};
    order: never;
    create: {
        ends_at?: string | null;
        reason?: string | null;
        /**
         * Possible values:
         *
         * - no_repeat
         *
         * - every_1
         *
         * - every_2
         *
         * - every_3
         *
         * - every_4
         *
         * - every_5
         *
         * - every_6
         *
         * - every_7
         *
         * - every_8
         */
        repeat_frequency?: string | null;
        /**
         * Possible values:
         *
         * - exact_day_of_month
         *
         * - week_of_month_1
         *
         * - week_of_month_2
         *
         * - week_of_month_3
         *
         * - week_of_month_4
         *
         * - week_of_month_last
         */
        repeat_interval?: string | null;
        /**
         * Possible values:
         *
         * - daily
         *
         * - weekly
         *
         * - monthly
         *
         * - yearly
         */
        repeat_period?: string | null;
        repeat_until?: string | null;
        share?: boolean | null;
        starts_at?: string | null;
    };
    update: {
        ends_at?: string | null;
        reason?: string | null;
        /**
         * Possible values:
         *
         * - no_repeat
         *
         * - every_1
         *
         * - every_2
         *
         * - every_3
         *
         * - every_4
         *
         * - every_5
         *
         * - every_6
         *
         * - every_7
         *
         * - every_8
         */
        repeat_frequency?: string | null;
        /**
         * Possible values:
         *
         * - exact_day_of_month
         *
         * - week_of_month_1
         *
         * - week_of_month_2
         *
         * - week_of_month_3
         *
         * - week_of_month_4
         *
         * - week_of_month_last
         */
        repeat_interval?: string | null;
        /**
         * Possible values:
         *
         * - daily
         *
         * - weekly
         *
         * - monthly
         *
         * - yearly
         */
        repeat_period?: string | null;
        repeat_until?: string | null;
        share?: boolean | null;
        starts_at?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        blockout_dates: { vertex: 'blockout_date'; many: true; filters: never; create: false };
        blockout_exceptions: { vertex: 'blockout_exception'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link BlockoutDate}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_date
 */
export interface BlockoutDateSchema {
    type: 'BlockoutDate';
    attributes: {
        /** End time as a 'wall-clock' timestamp */
        ends_at: string | null;
        ends_at_utc: string | null;
        group_identifier: string | null;
        reason: string | null;
        share: boolean | null;
        /** Start time as a 'wall-clock' timestamp */
        starts_at: string | null;
        starts_at_utc: string | null;
        time_zone: string | null;
    };
    relationships: 'blockout' | 'person';
    includes: never;
    related: {
        blockout: 'blockout';
        person: 'person';
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
 * Type-level schema of {@link BlockoutException}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_exception
 */
export interface BlockoutExceptionSchema {
    type: 'BlockoutException';
    attributes: {
        created_at: string | null;
        date: string | null;
        updated_at: string | null;
    };
    relationships: 'blockout';
    includes: never;
    related: {
        blockout: 'blockout';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        date?: string | null;
    };
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link BlockoutScheduleConflict}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_schedule_conflict
 */
export interface BlockoutScheduleConflictSchema {
    type: 'BlockoutScheduleConflict';
    attributes: {
        can_accept_partial: boolean | null;
        dates: string | null;
        organization_name: string | null;
        person_avatar: string | null;
        person_name: string | null;
        position_display_times: string | null;
        service_type_name: string | null;
        short_dates: string | null;
        sort_date: string | null;
        status: string | null;
        team_name: string | null;
        team_position_name: string | null;
    };
    relationships: 'organization' | 'person' | 'plan' | 'plan_person' | 'service_type';
    includes: never;
    related: {
        organization: 'organization';
        person: 'person';
        plan: 'plan';
        plan_person: 'plan_person';
        service_type: 'service_type';
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
 * Type-level schema of {@link Chat}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/chat
 */
export interface ChatSchema {
    type: 'Chat';
    attributes: {
        /** Only available when requested with the `?fields` param */
        group_identifiers: unknown[] | null;
        /** Only available when requested with the `?fields` param */
        my_teams: unknown[] | null;
        /** Only available when requested with the `?fields` param */
        payload: string | null;
        /** Only available when requested with the `?fields` param */
        people: unknown[] | null;
        /** Only available when requested with the `?fields` param */
        plans: unknown[] | null;
        /** Only available when requested with the `?fields` param */
        teams: unknown[] | null;
        /** Only available when requested with the `?fields` param */
        teams_i_lead: unknown[] | null;
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
 * Type-level schema of {@link Contributor}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/contributor
 */
export interface ContributorSchema {
    type: 'Contributor';
    attributes: {
        contributable_action: string | null;
        contributable_category: string | null;
        contributable_type: string | null;
        created_at: string | null;
        full_name: string | null;
        photo_thumbnail_url: string | null;
        updated_at: string | null;
    };
    relationships: 'person' | 'plan';
    includes: never;
    related: {
        person: 'person';
        plan: 'plan';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link CustomSlide}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/custom_slide
 */
export interface CustomSlideSchema {
    type: 'CustomSlide';
    attributes: {
        body: string | null;
        enabled: boolean | null;
        label: string | null;
        order: number | null;
    };
    relationships: 'attachment' | 'item';
    includes: never;
    related: {
        attachment: 'attachment';
        item: 'item';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        body?: string | null;
        enabled?: boolean | null;
        label?: string | null;
        order?: number | null;
    };
    update: {
        body?: string | null;
        enabled?: boolean | null;
        label?: string | null;
        order?: number | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Email}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email
 */
export interface EmailSchema {
    type: 'Email';
    attributes: {
        address: string | null;
        primary: boolean | null;
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
 * Type-level schema of {@link EmailTemplate}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email_template
 */
export interface EmailTemplateSchema {
    type: 'EmailTemplate';
    attributes: {
        created_at: string | null;
        html_body: string | null;
        kind: string | null;
        subject: string | null;
        updated_at: string | null;
    };
    relationships: 'template_owner';
    includes: never;
    related: {
        template_owner: 'organization';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        html_body?: string | null;
        kind?: string | null;
        subject?: string | null;
    };
    update: {
        html_body?: string | null;
        subject?: string | null;
    };
    delete: true;
    actions: 'render';
    edges: {};
}

/**
 * Type-level schema of {@link EmailTemplateRenderedResponse}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email_template_rendered_response
 */
export interface EmailTemplateRenderedResponseSchema {
    type: 'EmailTemplateRenderedResponse';
    attributes: {
        body: string | null;
        subject: string | null;
    };
    relationships: 'email_template' | 'person';
    includes: never;
    related: {
        email_template: 'email_template';
        person: 'person';
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
 * Type-level schema of {@link Folder}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/folder
 */
export interface FolderSchema {
    type: 'Folder';
    attributes: {
        container: string | null;
        created_at: string | null;
        name: string | null;
        updated_at: string | null;
    };
    relationships: 'ancestors' | 'campus' | 'parent';
    includes: 'service_types';
    related: {
        ancestors: 'folder';
        parent: 'folder';
        service_types: 'service_type';
    };
    where: {
        parent_id: string | number;
    };
    whereOps: {};
    order: 'name';
    create: {
        campus_id?: string;
        name?: string | null;
        parent_id?: string;
    };
    update: {
        campus_id?: string;
        name?: string | null;
        parent_id?: string;
    };
    delete: true;
    actions: never;
    edges: {
        folders: { vertex: 'folder'; many: true; filters: never; create: false };
        service_types: { vertex: 'service_type'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link FolderPath}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/folder_path
 */
export interface FolderPathSchema {
    type: 'FolderPath';
    attributes: {
        path: unknown[] | null;
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
 * Type-level schema of {@link Item}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item
 */
export interface ItemSchema {
    type: 'Item';
    attributes: {
        created_at: string | null;
        /**
         * An array of strings containing a label and a number describing the section:
         *
         * ['Verse 1', 'Chorus 1', 'Verse 2']
         */
        custom_arrangement_sequence: unknown[] | null;
        custom_arrangement_sequence_full: unknown[] | null;
        custom_arrangement_sequence_short: unknown[] | null;
        description: string | null;
        html_details: string | null;
        /**
         * There are 4 possible values:
         *
         * - `song`: The item is a song
         *
         * - `header`: The item is a header
         *
         * - `media`: The item is a piece of media
         *
         * - `item`: The default item type
         *
         * This value can only be set when an item is created. The only value that you can pass is `header`. If no value is passed then `item` will be used. To create a media item you'll attach a video media to the item, and to create a song item, you'll attach a song.
         */
        item_type: string | null;
        key_name: string | null;
        length: number | null;
        sequence: number | null;
        /**
         * There are 3 possible values:
         *
         * - `pre`: the item happens before the service starts
         *
         * - `post`: the item happens after the service ends
         *
         * - `during`: the item happens during the service
         */
        service_position: string | null;
        title: string | null;
        updated_at: string | null;
    };
    relationships:
        | 'arrangement'
        | 'key'
        | 'plan'
        | 'selected_background'
        | 'selected_layout'
        | 'song';
    includes:
        | 'arrangement'
        | 'item_assignments'
        | 'item_notes'
        | 'item_times'
        | 'key'
        | 'media'
        | 'selected_attachment'
        | 'song';
    related: {
        arrangement: 'arrangement';
        item_assignments: 'item_assignment';
        item_notes: 'item_note';
        item_times: 'item_time';
        key: 'key';
        media: 'media';
        plan: 'plan';
        selected_attachment: 'attachment';
        selected_background: 'attachment';
        song: 'song';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        arrangement_id?: string;
        /**
         * An array of strings containing a label and a number describing the section:
         *
         * ['Verse 1', 'Chorus 1', 'Verse 2']
         */
        custom_arrangement_sequence?: unknown[] | null;
        description?: string | null;
        html_details?: string | null;
        /**
         * There are 4 possible values:
         *
         * - `song`: The item is a song
         *
         * - `header`: The item is a header
         *
         * - `media`: The item is a piece of media
         *
         * - `item`: The default item type
         *
         * This value can only be set when an item is created. The only value that you can pass is `header`. If no value is passed then `item` will be used. To create a media item you'll attach a video media to the item, and to create a song item, you'll attach a song.
         */
        item_type?: string | null;
        key_id?: string;
        length?: number | null;
        selected_layout_id?: string;
        sequence?: number | null;
        /**
         * There are 3 possible values:
         *
         * - `pre`: the item happens before the service starts
         *
         * - `post`: the item happens after the service ends
         *
         * - `during`: the item happens during the service
         */
        service_position?: string | null;
        song_id?: string;
        title?: string | null;
    };
    update: {
        arrangement_id?: string;
        /**
         * An array of strings containing a label and a number describing the section:
         *
         * ['Verse 1', 'Chorus 1', 'Verse 2']
         */
        custom_arrangement_sequence?: unknown[] | null;
        description?: string | null;
        html_details?: string | null;
        key_id?: string;
        length?: number | null;
        selected_layout_id?: string;
        /**
         * There are 3 possible values:
         *
         * - `pre`: the item happens before the service starts
         *
         * - `post`: the item happens after the service ends
         *
         * - `during`: the item happens during the service
         */
        service_position?: string | null;
        song_id?: string;
        title?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        arrangement: { vertex: 'arrangement'; many: true; filters: never; create: false };
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
        custom_slides: { vertex: 'custom_slide'; many: true; filters: never; create: true };
        item_assignments: { vertex: 'item_assignment'; many: true; filters: never; create: true };
        item_notes: { vertex: 'item_note'; many: true; filters: never; create: true };
        item_times: { vertex: 'item_time'; many: true; filters: never; create: false };
        key: { vertex: 'key'; many: true; filters: never; create: false };
        media: { vertex: 'media'; many: true; filters: never; create: false };
        selected_attachment: { vertex: 'attachment'; many: true; filters: never; create: false };
        selected_background: { vertex: 'attachment'; many: true; filters: never; create: false };
        song: { vertex: 'song'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ItemAssignment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_assignment
 */
export interface ItemAssignmentSchema {
    type: 'ItemAssignment';
    attributes: {
        /** Possible values: `Person` or `TeamPosition`. */
        assignable_type: string | null;
    };
    relationships: 'assignable' | 'item' | 'plan';
    includes: never;
    related: {
        assignable: 'person';
        item: 'item';
        plan: 'plan';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        assignable_id?: string;
        /** Possible values: `Person` or `TeamPosition`. */
        assignable_type?: string | null;
    };
    update: {};
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link ItemNote}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_note
 */
export interface ItemNoteSchema {
    type: 'ItemNote';
    attributes: {
        category_name: string | null;
        content: string | null;
        created_at: string | null;
        updated_at: string | null;
    };
    relationships: 'item' | 'item_note_category';
    includes: 'item_note_category';
    related: {
        item: 'item';
        item_note_category: 'item_note_category';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        content?: string | null;
    };
    update: {
        content?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        item_note_category: { vertex: 'item_note_category'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ItemNoteCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_note_category
 */
export interface ItemNoteCategorySchema {
    type: 'ItemNoteCategory';
    attributes: {
        created_at: string | null;
        deleted_at: string | null;
        frequently_used: boolean | null;
        name: string | null;
        sequence: number | null;
        updated_at: string | null;
    };
    relationships: 'service_type';
    includes: never;
    related: {
        service_type: 'service_type';
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
 * Type-level schema of {@link ItemTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_time
 */
export interface ItemTimeSchema {
    type: 'ItemTime';
    attributes: {
        exclude: boolean | null;
        length: number | null;
        length_offset: number | null;
        live_end_at: string | null;
        live_start_at: string | null;
    };
    relationships: 'item' | 'plan' | 'plan_time';
    includes: never;
    related: {
        item: 'item';
        plan: 'plan';
        plan_time: 'plan_time';
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
 * Type-level schema of {@link Key}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/key
 */
export interface KeySchema {
    type: 'Key';
    attributes: {
        /**
         * An array of objects.
         *
         * `
         * {
         *   "name": "My Alternate Key",
         *   "key": "B"
         * }
         * `
         */
        alternate_keys: string | null;
        created_at: string | null;
        /**
         * Possible Values:
         *
         * `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`
         *
         * To set the key to minor append `m` to the key. e.g. `Cm`
         */
        ending_key: string | null;
        ending_minor: boolean | null;
        name: string | null;
        /**
         * Possible Values:
         *
         * `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`
         *
         * To set the key to minor append `m` to the key. e.g. `Cm`
         */
        starting_key: string | null;
        starting_minor: boolean | null;
        updated_at: string | null;
    };
    relationships: 'arrangement';
    includes: never;
    related: {
        arrangement: 'arrangement';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'updated_at';
    create: {
        /**
         * An array of objects.
         *
         * `
         * {
         *   "name": "My Alternate Key",
         *   "key": "B"
         * }
         * `
         */
        alternate_keys?: string | null;
        /**
         * Possible Values:
         *
         * `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`
         *
         * To set the key to minor append `m` to the key. e.g. `Cm`
         */
        ending_key?: string | null;
        name?: string | null;
        /**
         * Possible Values:
         *
         * `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`
         *
         * To set the key to minor append `m` to the key. e.g. `Cm`
         */
        starting_key?: string | null;
    };
    update: {
        /**
         * An array of objects.
         *
         * `
         * {
         *   "name": "My Alternate Key",
         *   "key": "B"
         * }
         * `
         */
        alternate_keys?: string | null;
        /**
         * Possible Values:
         *
         * `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`
         *
         * To set the key to minor append `m` to the key. e.g. `Cm`
         */
        ending_key?: string | null;
        name?: string | null;
        /**
         * Possible Values:
         *
         * `Ab`, `A`, `A#`, `Bb`, `B`, `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Abm`, `Am`, `A#m`, `Bbm`, `Bm`, `Cm`, `C#m`, `Dbm`, `Dm`, `D#m`, `Ebm`, `Em`, `Fm`, `F#m`, `Gbm`, `Gm`, `G#m`
         *
         * To set the key to minor append `m` to the key. e.g. `Cm`
         */
        starting_key?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link Live}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/live
 */
export interface LiveSchema {
    type: 'Live';
    attributes: {
        can_chat: boolean | null;
        can_control: boolean | null;
        can_control_video_feed: boolean | null;
        can_take_control: boolean | null;
        chat_room_channel: string | null;
        dates: string | null;
        live_channel: string | null;
        series_title: string | null;
        title: string | null;
    };
    relationships: never;
    includes: 'controller' | 'current_item_time' | 'items' | 'next_item_time' | 'service_type';
    related: {
        controller: 'person';
        current_item_time: 'item_time';
        items: 'item';
        next_item_time: 'item_time';
        service_type: 'service_type';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: true;
    actions: 'go_to_next_item' | 'go_to_previous_item' | 'toggle_control';
    edges: {
        controller: { vertex: 'person'; many: true; filters: never; create: false };
        current_item_time: { vertex: 'item_time'; many: true; filters: never; create: false };
        items: { vertex: 'item'; many: true; filters: never; create: false };
        next_item_time: { vertex: 'item_time'; many: true; filters: never; create: false };
        service_type: { vertex: 'service_type'; many: true; filters: never; create: false };
        watchable_plans: { vertex: 'plan'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link LiveController}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/live_controller
 */
export interface LiveControllerSchema {
    type: 'LiveController';
    attributes: {
        created_at: string | null;
        full_name: string | null;
        photo_thumbnail_url: string | null;
        updated_at: string | null;
    };
    relationships: 'person';
    includes: never;
    related: {
        person: 'person';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Media}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/media
 */
export interface MediaSchema {
    type: 'Media';
    attributes: {
        created_at: string | null;
        creator_name: string | null;
        image_url: string | null;
        length: number | null;
        /**
         * Possible Values:
         *
         * - `audio`
         *
         * - `background_audio`
         *
         * - `background_image`
         *
         * - `background_video`
         *
         * - `countdown`
         *
         * - `curriculum`
         *
         * - `document`
         *
         * - `drama`
         *
         * - `image`
         *
         * - `powerpoint`
         *
         * - `song_video`
         *
         * - `video`
         */
        media_type: string | null;
        media_type_name: string | null;
        preview_content_type: string | null;
        preview_file_name: string | null;
        preview_file_size: number | null;
        preview_updated_at: string | null;
        preview_url: string | null;
        themes: string | null;
        thumbnail_content_type: string | null;
        thumbnail_file_name: string | null;
        thumbnail_file_size: number | null;
        thumbnail_updated_at: string | null;
        thumbnail_url: string | null;
        title: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'attachments';
    related: {
        attachments: 'attachment';
    };
    where: {
        creator_name: string;
        id: string;
        themes: string;
        title: string;
    };
    whereOps: {};
    order: 'created_at' | 'title' | 'updated_at';
    create: {
        creator_name?: string | null;
        /**
         * Possible Values:
         *
         * - `audio`
         *
         * - `background_audio`
         *
         * - `background_image`
         *
         * - `background_video`
         *
         * - `countdown`
         *
         * - `curriculum`
         *
         * - `document`
         *
         * - `drama`
         *
         * - `image`
         *
         * - `powerpoint`
         *
         * - `song_video`
         *
         * - `video`
         */
        media_type?: string | null;
        themes?: string | null;
        title?: string | null;
    };
    update: {
        creator_name?: string | null;
        /**
         * Possible Values:
         *
         * - `audio`
         *
         * - `background_audio`
         *
         * - `background_image`
         *
         * - `background_video`
         *
         * - `countdown`
         *
         * - `curriculum`
         *
         * - `document`
         *
         * - `drama`
         *
         * - `image`
         *
         * - `powerpoint`
         *
         * - `song_video`
         *
         * - `video`
         */
        media_type?: string | null;
        themes?: string | null;
        title?: string | null;
    };
    delete: true;
    actions: 'archive' | 'assign_tags' | 'unarchive';
    edges: {
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
        media_schedules: { vertex: 'media_schedule'; many: true; filters: never; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link MediaSchedule}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/media_schedule
 */
export interface MediaScheduleSchema {
    type: 'MediaSchedule';
    attributes: {
        plan_dates: string | null;
        plan_short_dates: string | null;
        plan_sort_date: string | null;
        service_type_name: string | null;
    };
    relationships: 'plan' | 'service_type';
    includes: never;
    related: {
        plan: 'plan';
        service_type: 'service_type';
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
 * Type-level schema of {@link NeededPosition}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/needed_position
 */
export interface NeededPositionSchema {
    type: 'NeededPosition';
    attributes: {
        quantity: number | null;
        scheduled_to: string | null;
        team_position_name: string | null;
    };
    relationships: 'plan' | 'team' | 'time' | 'time_preference_option';
    includes: 'team' | 'time';
    related: {
        plan: 'plan';
        team: 'team';
        time: 'plan_time';
        time_preference_option: 'time_preference_option';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        quantity?: number | null;
        time_id?: string;
        time_preference_option_id?: string;
    };
    update: {
        quantity?: number | null;
    };
    delete: true;
    actions: never;
    edges: {
        team: { vertex: 'team'; many: true; filters: never; create: false };
        time: { vertex: 'plan_time'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        allow_mp3_download: boolean | null;
        beta: boolean | null;
        calendar_starts_on_sunday: boolean | null;
        ccli: string | null;
        ccli_auto_reporting_enabled: boolean | null;
        ccli_connected: boolean | null;
        ccli_reporting_enabled: boolean | null;
        created_at: string | null;
        /** Two possible values, `US` `EU` */
        date_format: number | null;
        extra_file_storage_allowed: boolean | null;
        file_storage_exceeded: boolean | null;
        file_storage_extra_charges: number | null;
        file_storage_extra_enabled: boolean | null;
        file_storage_size: boolean | null;
        file_storage_size_used: boolean | null;
        legacy_id: string | null;
        music_stand_enabled: boolean | null;
        name: string | null;
        owner_name: string | null;
        people_allowed: number | null;
        people_remaining: number | null;
        projector_enabled: boolean | null;
        rehearsal_mix_enabled: boolean | null;
        rehearsal_pack_connected: boolean | null;
        /** Possible values: `editor`, `administrator`, `site_administrator` */
        required_to_set_download_permission: string | null;
        secret: string | null;
        time_zone: string | null;
        twenty_four_hour_time: boolean | null;
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
 * Type-level schema of {@link Person}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        access_media_attachments: boolean | null;
        access_plan_attachments: boolean | null;
        access_song_attachments: boolean | null;
        anniversary: string | null;
        archived: boolean | null;
        archived_at: string | null;
        assigned_to_rehearsal_team: boolean | null;
        birthdate: string | null;
        can_edit_all_people: boolean | null;
        can_search: boolean | null;
        can_view_all_people: boolean | null;
        created_at: string | null;
        /**
         * DEPRECATED: this attribute will be removed in the next release and will return the string "DEPRECATED" in this version
         */
        facebook_id: string | null;
        first_name: string | null;
        full_name: string | null;
        given_name: string | null;
        ical_code: string | null;
        last_name: string | null;
        /**
         * If you've used Person.id from API v1 this attribute can be used to map from those old IDs to the new IDs used in API v2
         */
        legacy_id: string | null;
        logged_in_at: string | null;
        max_permissions: string | null;
        max_plan_permissions: string | null;
        me_tab: string | null;
        /**
         * The person's access to media, as a label: Scheduled Viewer, Viewer, Editor, or Administrator.
         */
        media_permissions: string | null;
        media_tab: string | null;
        middle_name: string | null;
        name_prefix: string | null;
        name_suffix: string | null;
        nickname: string | null;
        notes: string | null;
        onboardings: unknown[] | null;
        passed_background_check: boolean | null;
        people_tab: string | null;
        /**
         * DEPRECATED: use `plan_permissions` instead. Both name the same value; this one is ambiguous about which permission scale it refers to.
         */
        permissions: string | null;
        /**
         * Reserved for future use.
         *
         * Only available when requested with the `?fields` param
         */
        person_permissions: string | null;
        photo_thumbnail_url: string | null;
        photo_url: string | null;
        /**
         * The person's organization-wide plan permission, as a label: Archived, Scheduled Viewer, Viewer, Scheduler, Editor, or Administrator.
         */
        plan_permissions: string | null;
        plans_tab: string | null;
        praise_charts_enabled: boolean | null;
        preferred_app: string | null;
        preferred_max_plans_per_day: number | null;
        preferred_max_plans_per_month: number | null;
        /** Only available when requested with the `?fields` param */
        profile_name: string | null;
        /** Only available when requested with the `?fields` param */
        signature: string | null;
        site_administrator: boolean | null;
        /**
         * The person's access to songs and arrangements, as a label: Scheduled Viewer, Viewer, Editor, or Administrator.
         */
        song_permissions: string | null;
        songs_tab: string | null;
        status: string | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'current_folder' | 'updated_by';
    includes: 'emails' | 'tags' | 'team_leaders';
    related: {
        created_by: 'person';
        current_folder: 'folder';
        emails: 'email';
        tags: 'tag';
        team_leaders: 'team_leader';
        updated_by: 'person';
    };
    where: {
        assigned_to_rehearsal_team: boolean;
        legacy_id: string;
    };
    whereOps: {};
    order: 'created_at' | 'first_name' | 'last_name' | 'updated_at';
    create: {};
    update: {
        access_media_attachments?: boolean | null;
        access_plan_attachments?: boolean | null;
        access_song_attachments?: boolean | null;
        current_folder_id?: string;
        /**
         * The person's access to media, as a label: Scheduled Viewer, Viewer, Editor, or Administrator.
         */
        media_permissions?: string | null;
        onboardings?: unknown[] | null;
        /**
         * DEPRECATED: use `plan_permissions` instead. Both name the same value; this one is ambiguous about which permission scale it refers to.
         */
        permissions?: string | null;
        /**
         * Reserved for future use.
         *
         * Only available when requested with the `?fields` param
         */
        person_permissions?: string | null;
        /**
         * The person's organization-wide plan permission, as a label: Archived, Scheduled Viewer, Viewer, Scheduler, Editor, or Administrator.
         */
        plan_permissions?: string | null;
        preferred_app?: string | null;
        /**
         * The person's access to songs and arrangements, as a label: Scheduled Viewer, Viewer, Editor, or Administrator.
         */
        song_permissions?: string | null;
    };
    delete: false;
    actions: 'assign_tags' | 'collapse_service_types' | 'expand_service_types';
    edges: {
        available_signups: { vertex: 'available_signup'; many: true; filters: 'current_organization'; create: false };
        blockouts: { vertex: 'blockout'; many: true; filters: 'future' | 'past'; create: true };
        emails: { vertex: 'email'; many: true; filters: never; create: false };
        person_team_position_assignments: { vertex: 'person_team_position_assignment'; many: true; filters: 'not_archived' | 'not_deleted'; create: false };
        plan_people: { vertex: 'plan_person'; many: true; filters: never; create: false };
        schedules: { vertex: 'schedule'; many: true; filters:
            | 'after'
            | 'all'
            | 'before'
            | 'future'
            | 'not_across_organizations'
            | 'past'
            | 'with_declined'; create: false };
        scheduling_preferences: { vertex: 'scheduling_preference'; many: true; filters: never; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
        team_leaders: { vertex: 'team_leader'; many: true; filters: 'not_archived' | 'not_deleted'; create: false };
        text_settings: { vertex: 'text_setting'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PersonTeamPositionAssignment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/person_team_position_assignment
 */
export interface PersonTeamPositionAssignmentSchema {
    type: 'PersonTeamPositionAssignment';
    attributes: {
        created_at: string | null;
        /**
         * When `schedule_preference` is set to "Choose Weeks" then this
         * indicates which weeks are preferred (checked).
         *
         * e.g. ['1', '3', '5'] to prefer odd numbered weeks.
         */
        preferred_weeks: unknown[] | null;
        /**
         * Possible Values:
         *   "Unavailable"
         *   "Every week"
         *   "Every other week"
         *   "Every 3rd week"
         *   "Every 4th week"
         *   "Every 5th week"
         *   "Every 6th week"
         *   "Once a quarter"
         *   "Once a month"
         *   "Twice a month"
         *   "Three times a month"
         *   "Choose Weeks"
         */
        schedule_preference: string | null;
        updated_at: string | null;
    };
    relationships: 'person' | 'team_position' | 'time_preference_options';
    includes: 'person' | 'team_position';
    related: {
        person: 'person';
        team_position: 'team_position';
        time_preference_options: 'time_preference_option';
    };
    where: {};
    whereOps: {};
    order: 'first_name' | 'last_name';
    create: {
        person_id?: string;
        /**
         * When `schedule_preference` is set to "Choose Weeks" then this
         * indicates which weeks are preferred (checked).
         *
         * e.g. ['1', '3', '5'] to prefer odd numbered weeks.
         */
        preferred_weeks?: unknown[] | null;
        /**
         * Possible Values:
         *   "Unavailable"
         *   "Every week"
         *   "Every other week"
         *   "Every 3rd week"
         *   "Every 4th week"
         *   "Every 5th week"
         *   "Every 6th week"
         *   "Once a quarter"
         *   "Once a month"
         *   "Twice a month"
         *   "Three times a month"
         *   "Choose Weeks"
         */
        schedule_preference?: string | null;
        time_preference_option_ids?: string[];
    };
    update: {
        /**
         * When `schedule_preference` is set to "Choose Weeks" then this
         * indicates which weeks are preferred (checked).
         *
         * e.g. ['1', '3', '5'] to prefer odd numbered weeks.
         */
        preferred_weeks?: unknown[] | null;
        /**
         * Possible Values:
         *   "Unavailable"
         *   "Every week"
         *   "Every other week"
         *   "Every 3rd week"
         *   "Every 4th week"
         *   "Every 5th week"
         *   "Every 6th week"
         *   "Once a quarter"
         *   "Once a month"
         *   "Twice a month"
         *   "Three times a month"
         *   "Choose Weeks"
         */
        schedule_preference?: string | null;
        time_preference_option_ids?: string[];
    };
    delete: true;
    actions: never;
    edges: {
        person: { vertex: 'person'; many: true; filters: never; create: false };
        team_position: { vertex: 'team_position'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Plan}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan
 */
export interface PlanSchema {
    type: 'Plan';
    attributes: {
        can_view_order: boolean | null;
        created_at: string | null;
        /** The full date string representing all Service Time dates. */
        dates: string | null;
        /**
         * A date 15 days after the last service time. ___Returns in the time zone specified in your organization's localization settings___
         */
        files_expire_at: string | null;
        /**
         * The total number of items, including regular items, songs, media, and headers, that the current user can see in the plan.
         */
        items_count: number | null;
        /**
         * ___Returns in the time zone specified in your organization's localization settings___
         */
        last_time_at: string | null;
        multi_day: boolean | null;
        needed_positions_count: number | null;
        other_time_count: number | null;
        /** The current user's permissions for this plan's Service Type. */
        permissions: string | null;
        plan_notes_count: number | null;
        plan_people_count: number | null;
        planning_center_url: string | null;
        prefers_order_view: boolean | null;
        /** True if Public Access has been enabled. */
        public: boolean | null;
        /**
         * True if the plan is currently auto-published because the Service Type has scheduled publish enabled and the plan's service date has arrived in the organization's timezone.
         */
        public_by_schedule: boolean | null;
        rehearsable: boolean | null;
        rehearsal_time_count: number | null;
        reminders_disabled: boolean | null;
        series_title: string | null;
        service_time_count: number | null;
        /**
         * The shortened date string representing all Service Time dates. Months are abbreviated, and the year is omitted.
         */
        short_dates: string | null;
        /**
         * A time representing the chronological first Service Time, used to sort plan chronologically. If no Service Times exist, it uses Rehearsal Times, then Other Times, then NOW. ___Returns in the time zone specified in your organization's localization settings___
         */
        sort_date: string | null;
        title: string | null;
        /**
         * The total of length of all items, excluding pre-service and post-service items.
         */
        total_length: number | null;
        updated_at: string | null;
    };
    relationships:
        | 'attachment_types'
        | 'created_by'
        | 'linked_publishing_episode'
        | 'next_plan'
        | 'previous_plan'
        | 'series'
        | 'service_type'
        | 'updated_by';
    includes: 'contributors' | 'my_schedules' | 'plan_times' | 'series';
    related: {
        attachment_types: 'attachment_type';
        contributors: 'contributor';
        created_by: 'person';
        my_schedules: 'schedule';
        next_plan: 'plan';
        plan_times: 'plan_time';
        previous_plan: 'plan';
        series: 'series';
        service_type: 'service_type';
        updated_by: 'person';
    };
    where: {
        created_at: string | Date;
        id: string;
        series_title: string;
        title: string;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'sort_date' | 'title' | 'updated_at';
    create: {
        /** True if Public Access has been enabled. */
        public?: boolean | null;
        series_id?: string;
        series_title?: string | null;
        title?: string | null;
    };
    update: {
        /** True if Public Access has been enabled. */
        public?: boolean | null;
        reminders_disabled?: boolean | null;
        series_id?: string;
        series_title?: string | null;
        title?: string | null;
    };
    delete: true;
    actions: 'autoschedule' | 'import' | 'item_reorder';
    edges: {
        all_attachments: { vertex: 'attachment'; many: true; filters: 'attachable_type' | 'extensions'; create: false };
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
        attendances: { vertex: 'attendance'; many: true; filters: never; create: false };
        contributors: { vertex: 'contributor'; many: true; filters: never; create: false };
        items: { vertex: 'item'; many: true; filters: never; create: true };
        live: { vertex: 'live'; many: true; filters: never; create: false };
        my_schedules: { vertex: 'schedule'; many: true; filters: never; create: false };
        needed_positions: { vertex: 'needed_position'; many: true; filters: never; create: true };
        next_plan: { vertex: 'plan'; many: true; filters: never; create: false };
        notes: { vertex: 'plan_note'; many: true; filters: 'team'; create: true };
        plan_times: { vertex: 'plan_time'; many: true; filters: never; create: true };
        previous_plan: { vertex: 'plan'; many: true; filters: never; create: false };
        series: { vertex: 'series'; many: true; filters: never; create: false };
        signup_teams: { vertex: 'team'; many: true; filters: never; create: false };
        team_members: { vertex: 'plan_person'; many: true; filters:
            | 'confirmed'
            | 'not_archived'
            | 'not_declined'
            | 'not_deleted'; create: true };
    };
}

/**
 * Type-level schema of {@link PlanImportMetadata}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_import_metadata
 */
export interface PlanImportMetadataSchema {
    type: 'PlanImportMetadata';
    attributes: {
        any_plan_people_missing_background_check: boolean | null;
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
 * Type-level schema of {@link PlanNote}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_note
 */
export interface PlanNoteSchema {
    type: 'PlanNote';
    attributes: {
        category_name: string | null;
        content: string | null;
        created_at: string | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'plan_note_category' | 'teams';
    includes: 'plan_note_category';
    related: {
        created_by: 'person';
        plan_note_category: 'plan_note_category';
        teams: 'team';
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
        content?: string | null;
    };
    update: {
        content?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        plan_note_category: { vertex: 'plan_note_category'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PlanNoteCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_note_category
 */
export interface PlanNoteCategorySchema {
    type: 'PlanNoteCategory';
    attributes: {
        created_at: string | null;
        deleted_at: string | null;
        name: string | null;
        sequence: number | null;
        updated_at: string | null;
    };
    relationships: 'service_type' | 'teams';
    includes: never;
    related: {
        service_type: 'service_type';
        teams: 'team';
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
 * Type-level schema of {@link PlanPerson}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_person
 */
export interface PlanPersonSchema {
    type: 'PlanPerson';
    attributes: {
        /**
         * If the person is scheduled to a split team where they could potentially accept 1 time and decline another.
         */
        can_accept_partial: boolean | null;
        created_at: string | null;
        decline_reason: string | null;
        name: string | null;
        notes: string | null;
        notification_changed_at: string | null;
        notification_changed_by_name: string | null;
        notification_prepared_at: string | null;
        notification_read_at: string | null;
        notification_sender_name: string | null;
        notification_sent_at: string | null;
        photo_thumbnail: string | null;
        prepare_notification: boolean | null;
        /** Only available when requested with the `?fields` param */
        scheduled_by_is_eligible_for_responds_to: boolean | null;
        /** Only available when requested with the `?fields` param */
        scheduled_by_name: string | null;
        /** Accepts one of 'C', 'U', 'D', or 'Confirmed', 'Unconfirmed', or 'Declined' */
        status: string | null;
        status_updated_at: string | null;
        team_position_name: string | null;
        updated_at: string | null;
    };
    relationships:
        | 'person'
        | 'plan'
        | 'responds_to'
        | 'scheduled_by'
        | 'service_times'
        | 'service_type'
        | 'team'
        | 'time_preference_options'
        | 'times';
    includes: 'declined_plan_times' | 'person' | 'plan' | 'team';
    related: {
        declined_plan_times: 'plan_time';
        person: 'person';
        plan: 'plan';
        responds_to: 'person';
        scheduled_by: 'person';
        service_times: 'plan_time';
        service_type: 'service_type';
        team: 'team';
        time_preference_options: 'time_preference_option';
        times: 'plan_time';
    };
    where: {
        team_id: string | number;
    };
    whereOps: {};
    order: never;
    create: {
        decline_reason?: string | null;
        notes?: string | null;
        notification_prepared_at?: string | null;
        person_id?: string;
        prepare_notification?: boolean | null;
        responds_to_id?: string;
        /** Accepts one of 'C', 'U', 'D', or 'Confirmed', 'Unconfirmed', or 'Declined' */
        status?: string | null;
        team_id?: string;
        team_position_name?: string | null;
    };
    update: {
        decline_reason?: string | null;
        notes?: string | null;
        notification_prepared_at?: string | null;
        person_id?: string;
        prepare_notification?: boolean | null;
        responds_to_id?: string;
        /** Accepts one of 'C', 'U', 'D', or 'Confirmed', 'Unconfirmed', or 'Declined' */
        status?: string | null;
        team_id?: string;
        team_position_name?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        declined_plan_times: { vertex: 'plan_time'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
        plan: { vertex: 'plan'; many: true; filters: never; create: false };
        plan_person_times: { vertex: 'plan_person_time'; many: true; filters: never; create: false };
        plan_times: { vertex: 'plan_time'; many: true; filters: never; create: false };
        team: { vertex: 'team'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PlanPersonTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_person_time
 */
export interface PlanPersonTimeSchema {
    type: 'PlanPersonTime';
    attributes: {
        created_at: string | null;
        status: string | null;
        updated_at: string | null;
    };
    relationships: 'plan' | 'plan_person' | 'plan_time';
    includes: never;
    related: {
        plan: 'plan';
        plan_person: 'plan_person';
        plan_time: 'plan_time';
    };
    where: {};
    whereOps: {};
    order: 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link PlanTemplate}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_template
 */
export interface PlanTemplateSchema {
    type: 'PlanTemplate';
    attributes: {
        can_view_order: boolean | null;
        created_at: string | null;
        item_count: number | null;
        multi_day: boolean | null;
        name: string | null;
        note_count: number | null;
        prefers_order_view: boolean | null;
        rehearsable: boolean | null;
        team_count: number | null;
        updated_at: string | null;
    };
    relationships: 'created_by' | 'service_type' | 'updated_by';
    includes: never;
    related: {
        created_by: 'person';
        service_type: 'service_type';
        updated_by: 'person';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'item_count' | 'name' | 'note_count' | 'team_count' | 'updated_at';
    create: {
        name?: string | null;
    };
    update: {
        name?: string | null;
    };
    delete: true;
    actions: 'import' | 'item_reorder';
    edges: {
        items: { vertex: 'item'; many: true; filters: never; create: true };
        notes: { vertex: 'plan_note'; many: true; filters: never; create: true };
        team_members: { vertex: 'plan_person'; many: true; filters:
            | 'confirmed'
            | 'not_archived'
            | 'not_declined'
            | 'not_deleted'; create: true };
    };
}

/**
 * Type-level schema of {@link PlanTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_time
 */
export interface PlanTimeSchema {
    type: 'PlanTime';
    attributes: {
        created_at: string | null;
        /** Planned end time. */
        ends_at: string | null;
        /** End time as recorded by Services LIVE. */
        live_ends_at: string | null;
        /** Start time as recorded by Services LIVE. */
        live_starts_at: string | null;
        name: string | null;
        recorded: boolean | null;
        /** Only available when requested with the `?fields` param */
        scheduled_team_ids: unknown[] | null;
        /** Planned start time. */
        starts_at: string | null;
        /**
         * A Hash that maps a Team ID to a reminder value. If nothing is specified, no reminder is set for that team. A reminder value is an integer (0-7) equal to the number of days before the selected time a reminder should be sent.
         */
        team_reminders: unknown[] | null;
        /**
         * Possible values are:
         *
         * - rehearsal
         *
         * - service
         *
         * - other
         */
        time_type: string | null;
        updated_at: string | null;
    };
    relationships: 'assigned_positions' | 'assigned_teams';
    includes: 'split_team_rehearsal_assignments';
    related: {
        assigned_positions: 'team_position';
        assigned_teams: 'team';
        split_team_rehearsal_assignments: 'split_team_rehearsal_assignment';
    };
    where: {
        time_type: string;
    };
    whereOps: {};
    order: 'starts_at';
    create: {
        /** Planned end time. */
        ends_at?: string | null;
        name?: string | null;
        /** Planned start time. */
        starts_at?: string | null;
        /**
         * A Hash that maps a Team ID to a reminder value. If nothing is specified, no reminder is set for that team. A reminder value is an integer (0-7) equal to the number of days before the selected time a reminder should be sent.
         */
        team_reminders?: unknown[] | null;
        /**
         * Possible values are:
         *
         * - rehearsal
         *
         * - service
         *
         * - other
         */
        time_type?: string | null;
    };
    update: {
        /** Planned end time. */
        ends_at?: string | null;
        name?: string | null;
        /** Planned start time. */
        starts_at?: string | null;
        /**
         * A Hash that maps a Team ID to a reminder value. If nothing is specified, no reminder is set for that team. A reminder value is an integer (0-7) equal to the number of days before the selected time a reminder should be sent.
         */
        team_reminders?: unknown[] | null;
        /**
         * Possible values are:
         *
         * - rehearsal
         *
         * - service
         *
         * - other
         */
        time_type?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        split_team_rehearsal_assignments: { vertex: 'split_team_rehearsal_assignment'; many: true; filters: never; create: true };
    };
}

/**
 * Type-level schema of {@link PublicView}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/public_view
 */
export interface PublicViewSchema {
    type: 'PublicView';
    attributes: {
        amazon: boolean | null;
        headers: boolean | null;
        item_descriptions: boolean | null;
        item_lengths: boolean | null;
        itunes: boolean | null;
        media_items: boolean | null;
        regular_items: boolean | null;
        series_and_plan_titles: boolean | null;
        series_artwork: boolean | null;
        service_times: boolean | null;
        song_items: boolean | null;
        spotify: boolean | null;
        vimeo: boolean | null;
        youtube: boolean | null;
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
 * Type-level schema of {@link ReportTemplate}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/report_template
 */
export interface ReportTemplateSchema {
    type: 'ReportTemplate';
    attributes: {
        body: string | null;
        /** A template provided by Planning Center */
        default: boolean | null;
        title: string | null;
        /** Possible values: `ReportMatrix`, `ReportPeople`, `ReportPlan` */
        type: string | null;
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
 * Type-level schema of {@link Schedule}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/schedule
 */
export interface ScheduleSchema {
    type: 'Schedule';
    attributes: {
        can_accept_partial: boolean | null;
        can_accept_partial_one_time: boolean | null;
        can_rehearse: boolean | null;
        dates: string | null;
        decline_reason: string | null;
        organization_name: string | null;
        organization_time_zone: string | null;
        organization_twenty_four_hour_time: string | null;
        person_name: string | null;
        /** True if the scheduled Plan is visible to the scheduled Person */
        plan_visible: boolean | null;
        /** True if the scheduled Plan is visible to the current Person */
        plan_visible_to_me: boolean | null;
        position_display_times: string | null;
        reschedule_declines: string | null;
        responds_to_name: string | null;
        service_type_name: string | null;
        short_dates: string | null;
        sort_date: string | null;
        status: string | null;
        team_name: string | null;
        team_position_name: string | null;
    };
    relationships:
        | 'organization'
        | 'person'
        | 'plan'
        | 'plan_person'
        | 'responds_to_person'
        | 'service_type'
        | 'team'
        | 'times';
    includes: 'plan_times';
    related: {
        organization: 'organization';
        person: 'person';
        plan: 'plan';
        plan_person: 'plan_person';
        plan_times: 'plan_time';
        responds_to_person: 'person';
        service_type: 'service_type';
        team: 'team';
        times: 'plan_time';
    };
    where: {
        plan_id: string | number;
    };
    whereOps: {};
    order: 'starts_at';
    create: {};
    update: {};
    delete: false;
    actions: 'accept' | 'decline';
    edges: {
        declined_plan_times: { vertex: 'plan_time'; many: true; filters: never; create: false };
        plan_times: { vertex: 'plan_time'; many: true; filters: never; create: false };
        respond_to: { vertex: 'person'; many: true; filters: never; create: false };
        team: { vertex: 'team'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ScheduledPerson}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/scheduled_person
 */
export interface ScheduledPersonSchema {
    type: 'ScheduledPerson';
    attributes: {
        full_name: string | null;
        status: string | null;
        thumbnail: string | null;
    };
    relationships: 'person' | 'signup_sheet';
    includes: never;
    related: {
        person: 'person';
        signup_sheet: 'signup_sheet';
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
 * Type-level schema of {@link SchedulingPreference}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/scheduling_preference
 */
export interface SchedulingPreferenceSchema {
    type: 'SchedulingPreference';
    attributes: {
        preference: string | null;
    };
    relationships: 'household_member';
    includes: never;
    related: {
        household_member: 'person';
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
 * Type-level schema of {@link Series}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/series
 */
export interface SeriesSchema {
    type: 'Series';
    attributes: {
        artwork_content_type: string | null;
        artwork_file_name: string | null;
        artwork_file_size: number | null;
        artwork_for_dashboard: string | null;
        artwork_for_mobile: string | null;
        artwork_for_plan: string | null;
        artwork_original: string | null;
        created_at: string | null;
        has_artwork: boolean | null;
        title: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        title: string;
    };
    whereOps: {};
    order: 'created_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        plans: { vertex: 'plan'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ServiceType}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/service_type
 */
export interface ServiceTypeSchema {
    type: 'ServiceType';
    attributes: {
        archived_at: string | null;
        attachment_types_enabled: boolean | null;
        background_check_permissions: string | null;
        /**
         * DEPRECATED: this attribute will be removed in the next release and will return the string "DEPRECATED" in this version
         */
        comment_permissions: string | null;
        created_at: string | null;
        /**
         * A array of hashes that maps an item title substring matcher to a color:
         *
         * [{ name: "Announcements", color: "#FFFFFF" }]
         *
         * Valid substring matchers are any string that could be used as an item title.
         *
         * A color is the hexadecimal value of a valid color e.g. #FFFFFF
         * Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff
         */
        custom_item_types: unknown[] | null;
        deleted_at: string | null;
        frequency: string | null;
        last_plan_from: string | null;
        name: string | null;
        permissions: string | null;
        scheduled_publish: boolean | null;
        sequence: number | null;
        /**
         * An array of hashes that maps an item type to a color:
         *
         * [{ name: "Header", color: "#FFFFFF" }]
         *
         * Valid names are Header, Song, and Media.
         *
         * A color is the hexadecimal value of a valid color e.g. #FFFFFF
         * Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff
         */
        standard_item_types: unknown[] | null;
        updated_at: string | null;
    };
    relationships: 'parent';
    includes: 'time_preference_options';
    related: {
        parent: 'folder';
        time_preference_options: 'time_preference_option';
    };
    where: {
        id: string;
        name: string;
        parent_id: string | number;
    };
    whereOps: {};
    order: 'name' | 'sequence';
    create: {
        attachment_types_enabled?: boolean | null;
        background_check_permissions?: string | null;
        /**
         * A array of hashes that maps an item title substring matcher to a color:
         *
         * [{ name: "Announcements", color: "#FFFFFF" }]
         *
         * Valid substring matchers are any string that could be used as an item title.
         *
         * A color is the hexadecimal value of a valid color e.g. #FFFFFF
         * Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff
         */
        custom_item_types?: unknown[] | null;
        frequency?: string | null;
        last_plan_from?: string | null;
        name?: string | null;
        parent_id?: string;
        scheduled_publish?: boolean | null;
        sequence?: number | null;
        /**
         * An array of hashes that maps an item type to a color:
         *
         * [{ name: "Header", color: "#FFFFFF" }]
         *
         * Valid names are Header, Song, and Media.
         *
         * A color is the hexadecimal value of a valid color e.g. #FFFFFF
         * Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff
         */
        standard_item_types?: unknown[] | null;
    };
    update: {
        attachment_types_enabled?: boolean | null;
        background_check_permissions?: string | null;
        /**
         * A array of hashes that maps an item title substring matcher to a color:
         *
         * [{ name: "Announcements", color: "#FFFFFF" }]
         *
         * Valid substring matchers are any string that could be used as an item title.
         *
         * A color is the hexadecimal value of a valid color e.g. #FFFFFF
         * Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff
         */
        custom_item_types?: unknown[] | null;
        frequency?: string | null;
        last_plan_from?: string | null;
        name?: string | null;
        parent_id?: string;
        scheduled_publish?: boolean | null;
        sequence?: number | null;
        /**
         * An array of hashes that maps an item type to a color:
         *
         * [{ name: "Header", color: "#FFFFFF" }]
         *
         * Valid names are Header, Song, and Media.
         *
         * A color is the hexadecimal value of a valid color e.g. #FFFFFF
         * Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff
         */
        standard_item_types?: unknown[] | null;
    };
    delete: true;
    actions: 'create_plans';
    edges: {
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
        item_note_categories: { vertex: 'item_note_category'; many: true; filters: never; create: false };
        live_controllers: { vertex: 'live_controller'; many: true; filters: never; create: false };
        plan_note_categories: { vertex: 'plan_note_category'; many: true; filters: never; create: false };
        plan_person_times: { vertex: 'plan_person_time'; many: true; filters: never; create: false };
        plan_templates: { vertex: 'plan_template'; many: true; filters: never; create: true };
        plan_times: { vertex: 'plan_time'; many: true; filters: 'future' | 'named' | 'not_deleted' | 'past'; create: false };
        plans: { vertex: 'plan'; many: true; filters:
            | 'after'
            | 'before'
            | 'future'
            | 'no_dates'
            | 'past'; create: true };
        public_view: { vertex: 'public_view'; many: true; filters: never; create: false };
        team_positions: { vertex: 'team_position'; many: true; filters: never; create: false };
        teams: { vertex: 'team'; many: true; filters: never; create: true };
        time_preference_options: { vertex: 'time_preference_option'; many: true; filters: never; create: false };
        unscoped_plans: { vertex: 'plan'; many: true; filters: 'deleted'; create: false };
    };
}

/**
 * Type-level schema of {@link ServiceTypePath}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/service_type_path
 */
export interface ServiceTypePathSchema {
    type: 'ServiceTypePath';
    attributes: {
        path: unknown[] | null;
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
 * Type-level schema of {@link SignupSheet}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/signup_sheet
 */
export interface SignupSheetSchema {
    type: 'SignupSheet';
    attributes: {
        display_times: string | null;
        group_key: string | null;
        plan_title: string | null;
        position_name: string | null;
        sort_date: string | null;
        sort_index: number | null;
        team_name: string | null;
        title: string | null;
    };
    relationships: 'plan' | 'team' | 'team_position';
    includes: 'scheduled_people' | 'signup_sheet_metadata';
    related: {
        plan: 'plan';
        scheduled_people: 'scheduled_person';
        signup_sheet_metadata: 'signup_sheet_metadata';
        team: 'team';
        team_position: 'team_position';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: 'accept';
    edges: {
        scheduled_people: { vertex: 'scheduled_person'; many: true; filters: never; create: false };
        signup_sheet_metadata: { vertex: 'signup_sheet_metadata'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link SignupSheetMetadata}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/signup_sheet_metadata
 */
export interface SignupSheetMetadataSchema {
    type: 'SignupSheetMetadata';
    attributes: {
        conflicts: Record<string, unknown> | null;
        ends_at: string | null;
        starts_at: string | null;
        time_name: string | null;
        time_type: string | null;
    };
    relationships: 'plan_time';
    includes: never;
    related: {
        plan_time: 'plan_time';
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
 * Type-level schema of {@link SkippedAttachment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/skipped_attachment
 */
export interface SkippedAttachmentSchema {
    type: 'SkippedAttachment';
    attributes: {
        skipped: boolean | null;
    };
    relationships: 'attachment' | 'person';
    includes: never;
    related: {
        attachment: 'attachment';
        person: 'person';
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
 * Type-level schema of {@link Song}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/song
 */
export interface SongSchema {
    type: 'Song';
    attributes: {
        admin: string | null;
        author: string | null;
        ccli_number: number | null;
        copyright: string | null;
        created_at: string | null;
        hidden: boolean | null;
        last_scheduled_at: string | null;
        last_scheduled_short_dates: string | null;
        notes: string | null;
        themes: string | null;
        /**
         * The name of the song.
         *
         * When setting this value on a create you can pass a CCLI number and Services will fetch the song metadata for you.
         */
        title: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        author: string;
        ccli_number: number;
        hidden: boolean;
        themes: string;
        title: string;
    };
    whereOps: {};
    order: 'created_at' | 'last_scheduled_at' | 'title' | 'updated_at';
    create: {
        admin?: string | null;
        author?: string | null;
        ccli_number?: number | null;
        copyright?: string | null;
        hidden?: boolean | null;
        themes?: string | null;
        /**
         * The name of the song.
         *
         * When setting this value on a create you can pass a CCLI number and Services will fetch the song metadata for you.
         */
        title?: string | null;
    };
    update: {
        admin?: string | null;
        author?: string | null;
        ccli_number?: number | null;
        copyright?: string | null;
        hidden?: boolean | null;
        themes?: string | null;
        /**
         * The name of the song.
         *
         * When setting this value on a create you can pass a CCLI number and Services will fetch the song metadata for you.
         */
        title?: string | null;
    };
    delete: true;
    actions: 'assign_tags';
    edges: {
        arrangements: { vertex: 'arrangement'; many: true; filters: never; create: true };
        attachments: { vertex: 'attachment'; many: true; filters: never; create: true };
        /**
         * The Song's most recently scheduled Item in a given Service Type.
         * Requires a `service_type` query parameter.
         * e.g. `?service_type=789`
         */
        last_scheduled_item: { vertex: 'item'; many: true; filters: never; create: false };
        song_schedules: { vertex: 'song_schedule'; many: true; filters:
            | 'after'
            | 'before'
            | 'most_recent'
            | 'most_recent_with_upcoming'
            | 'three_most_recent'; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
        unscoped_arrangements: { vertex: 'arrangement'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link SongSchedule}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/song_schedule
 */
export interface SongScheduleSchema {
    type: 'SongSchedule';
    attributes: {
        arrangement_name: string | null;
        key_name: string | null;
        plan_dates: string | null;
        plan_sort_date: string | null;
        plan_visible: boolean | null;
        service_type_name: string | null;
    };
    relationships: 'arrangement' | 'item' | 'key' | 'plan' | 'service_type';
    includes: never;
    related: {
        arrangement: 'arrangement';
        item: 'item';
        key: 'key';
        plan: 'plan';
        service_type: 'service_type';
    };
    where: {};
    whereOps: {};
    order: 'plan_sort_date';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link SongbookStatus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/songbook_status
 */
export interface SongbookStatusSchema {
    type: 'SongbookStatus';
    attributes: {
        status: string | null;
        status_code: string | null;
        status_token: string | null;
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
    edges: {};
}

/**
 * Type-level schema of {@link SplitTeamRehearsalAssignment}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/split_team_rehearsal_assignment
 */
export interface SplitTeamRehearsalAssignmentSchema {
    type: 'SplitTeamRehearsalAssignment';
    attributes: {
        /**
         * Controls if the related rehearsal/other time is assigned when a person is scheduled to a split team service time that does not match a Time Preference Option
         */
        schedule_special_service_times: boolean | null;
    };
    relationships: 'team' | 'time_preference_options';
    includes: never;
    related: {
        team: 'team';
        time_preference_options: 'time_preference_option';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        /**
         * Controls if the related rehearsal/other time is assigned when a person is scheduled to a split team service time that does not match a Time Preference Option
         */
        schedule_special_service_times?: boolean | null;
    };
    update: {
        /**
         * Controls if the related rehearsal/other time is assigned when a person is scheduled to a split team service time that does not match a Time Preference Option
         */
        schedule_special_service_times?: boolean | null;
    };
    delete: true;
    actions: never;
    edges: {
        team: { vertex: 'team'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Tag}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/tag
 */
export interface TagSchema {
    type: 'Tag';
    attributes: {
        name: string | null;
    };
    relationships: 'tag_group';
    includes: never;
    related: {
        tag_group: 'tag_group';
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
 * Type-level schema of {@link TagGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/tag_group
 */
export interface TagGroupSchema {
    type: 'TagGroup';
    attributes: {
        allow_multiple_selections: boolean | null;
        name: string | null;
        required: boolean | null;
        service_type_folder_name: string | null;
        /** Scopes a tag group to `person`, `song`, `arrangement`, `media` */
        tags_for: string | null;
    };
    relationships: never;
    includes: 'folder' | 'tags';
    related: {
        folder: 'folder';
        tags: 'tag';
    };
    where: {
        name: string;
        tags_for: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        folder: { vertex: 'folder'; many: true; filters: never; create: false };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Team}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team
 */
export interface TeamSchema {
    type: 'Team';
    attributes: {
        archived_at: string | null;
        assigned_directly: boolean | null;
        created_at: string | null;
        default_prepare_notifications: boolean | null;
        default_status: string | null;
        deleted_at: string | null;
        /** Whether direct messages are enabled for this team in Chat. */
        direct_messages_enabled: boolean | null;
        last_plan_from: string | null;
        name: string | null;
        rehearsal_team: boolean | null;
        /**
         * This determines whether a team is a split team or not.Accepted values: 1. "plan" (default) 2. "time" (designates as a split team)
         */
        schedule_to: string | null;
        secure_team: boolean | null;
        sequence: number | null;
        stage_color: string | null;
        stage_variant: string | null;
        updated_at: string | null;
        viewers_see: number | null;
    };
    relationships: 'default_responds_to' | 'service_type' | 'service_types';
    includes:
        | 'people'
        | 'person_team_position_assignments'
        | 'service_types'
        | 'team_leaders'
        | 'team_positions';
    related: {
        default_responds_to: 'person';
        people: 'person';
        person_team_position_assignments: 'person_team_position_assignment';
        service_type: 'service_type';
        service_types: 'service_type';
        team_leaders: 'team_leader';
        team_positions: 'team_position';
    };
    where: {
        id: string;
        name: string;
    };
    whereOps: {};
    order: 'created_at' | 'name' | 'updated_at';
    create: {
        archived_at?: string | null;
        assigned_directly?: boolean | null;
        deleted_at?: string | null;
        name?: string | null;
        rehearsal_team?: boolean | null;
        /**
         * This determines whether a team is a split team or not.Accepted values: 1. "plan" (default) 2. "time" (designates as a split team)
         */
        schedule_to?: string | null;
        secure_team?: boolean | null;
        service_type_ids?: string[];
        stage_color?: string | null;
        stage_variant?: string | null;
    };
    update: {};
    delete: false;
    actions: never;
    edges: {
        people: { vertex: 'person'; many: true; filters: never; create: false };
        person_team_position_assignments: { vertex: 'person_team_position_assignment'; many: true; filters: never; create: false };
        service_types: { vertex: 'service_type'; many: true; filters: never; create: false };
        team_leaders: { vertex: 'team_leader'; many: true; filters: never; create: false };
        team_positions: { vertex: 'team_position'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link TeamLeader}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team_leader
 */
export interface TeamLeaderSchema {
    type: 'TeamLeader';
    attributes: {
        send_responses_for_accepts: boolean | null;
        send_responses_for_blockouts: boolean | null;
        send_responses_for_declines: boolean | null;
    };
    relationships: 'person' | 'team';
    includes: 'people' | 'team';
    related: {
        people: 'person';
        person: 'person';
        team: 'team';
    };
    where: {};
    whereOps: {};
    order: 'first_name' | 'last_name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        people: { vertex: 'person'; many: true; filters: never; create: false };
        team: { vertex: 'team'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link TeamPosition}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team_position
 */
export interface TeamPositionSchema {
    type: 'TeamPosition';
    attributes: {
        name: string | null;
        /**
         * If the Team is assigned via tags, these are Tags where the option "None" is specified.
         */
        negative_tag_groups: unknown[] | null;
        sequence: number | null;
        /**
         * If the Team is assigned via tags, these are Tags where the option "Any" is specified.
         */
        tag_groups: unknown[] | null;
        /** If the Team is assigned via tags, these are specific Tags that are specified. */
        tags: unknown[] | null;
    };
    relationships: 'attachment_types' | 'tags' | 'team';
    includes: 'tags' | 'team';
    related: {
        attachment_types: 'attachment_type';
        tags: 'tag';
        team: 'team';
    };
    where: {};
    whereOps: {};
    order: 'name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        person_team_position_assignments: { vertex: 'person_team_position_assignment'; many: true; filters: 'time_preference_options'; create: true };
        tags: { vertex: 'tag'; many: true; filters: never; create: false };
        team: { vertex: 'team'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link TextSetting}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/text_setting
 */
export interface TextSettingSchema {
    type: 'TextSetting';
    attributes: {
        carrier: string | null;
        display_number: string | null;
        general_emails_enabled: boolean | null;
        normalized_number: string | null;
        reminders_enabled: boolean | null;
        scheduling_replies_enabled: boolean | null;
        scheduling_requests_enabled: boolean | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {
        general_emails_enabled?: boolean | null;
        reminders_enabled?: boolean | null;
        scheduling_replies_enabled?: boolean | null;
        scheduling_requests_enabled?: boolean | null;
    };
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link TimePreferenceOption}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/time_preference_option
 */
export interface TimePreferenceOptionSchema {
    type: 'TimePreferenceOption';
    attributes: {
        created_at: string | null;
        day_of_week: number | null;
        description: string | null;
        /** 0 for 12:00 am, 1 for 12:01 am, 100 for 1:00 am, through 2359 for 11:59pm */
        minute_of_day: number | null;
        sort_index: string | null;
        starts_at: string | null;
        time_type: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'day_of_week' | 'hour_of_day';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Zoom}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/zoom
 */
export interface ZoomSchema {
    type: 'Zoom';
    attributes: {
        /**
         * The aspect ratio of the device this zoom is for. It is rounded to the nearest 3 decimal places.
         */
        aspect_ratio: number | null;
        /**
         * The percentage of the document's width the zoomed document should be offset by horizontally.
         */
        x_offset: number | null;
        /**
         * The percentage of the document's height the zoomed document should be offset by vertically.
         */
        y_offset: number | null;
        /** The percentage of the zoom. Must be a value between 1.0 and 5.0 */
        zoom_level: number | null;
    };
    relationships: 'attachable' | 'attachment' | 'person';
    includes: never;
    related: {
        attachable: 'attachment';
        attachment: 'attachment';
        person: 'person';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {
        /**
         * The aspect ratio of the device this zoom is for. It is rounded to the nearest 3 decimal places.
         */
        aspect_ratio?: number | null;
        /**
         * The percentage of the document's width the zoomed document should be offset by horizontally.
         */
        x_offset?: number | null;
        /**
         * The percentage of the document's height the zoomed document should be offset by vertically.
         */
        y_offset?: number | null;
        /** The percentage of the zoom. Must be a value between 1.0 and 5.0 */
        zoom_level?: number | null;
    };
    update: {
        /**
         * The percentage of the document's width the zoomed document should be offset by horizontally.
         */
        x_offset?: number | null;
        /**
         * The percentage of the document's height the zoomed document should be offset by vertically.
         */
        y_offset?: number | null;
        /** The percentage of the zoom. Must be a value between 1.0 and 5.0 */
        zoom_level?: number | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/** Type-level schema of every Planning Center Services resource, keyed by vertex id. */
export type ServicesSchema = {
    arrangement: ArrangementSchema;
    arrangement_sections: ArrangementSectionsSchema;
    attachment: AttachmentSchema;
    attachment_activity: AttachmentActivitySchema;
    attachment_type: AttachmentTypeSchema;
    attachment_type_group: AttachmentTypeGroupSchema;
    attendance: AttendanceSchema;
    available_signup: AvailableSignupSchema;
    blockout: BlockoutSchema;
    blockout_date: BlockoutDateSchema;
    blockout_exception: BlockoutExceptionSchema;
    blockout_schedule_conflict: BlockoutScheduleConflictSchema;
    chat: ChatSchema;
    contributor: ContributorSchema;
    custom_slide: CustomSlideSchema;
    email: EmailSchema;
    email_template: EmailTemplateSchema;
    email_template_rendered_response: EmailTemplateRenderedResponseSchema;
    folder: FolderSchema;
    folder_path: FolderPathSchema;
    item: ItemSchema;
    item_assignment: ItemAssignmentSchema;
    item_note: ItemNoteSchema;
    item_note_category: ItemNoteCategorySchema;
    item_time: ItemTimeSchema;
    key: KeySchema;
    live: LiveSchema;
    live_controller: LiveControllerSchema;
    media: MediaSchema;
    media_schedule: MediaScheduleSchema;
    needed_position: NeededPositionSchema;
    organization: OrganizationSchema;
    person: PersonSchema;
    person_team_position_assignment: PersonTeamPositionAssignmentSchema;
    plan: PlanSchema;
    plan_import_metadata: PlanImportMetadataSchema;
    plan_note: PlanNoteSchema;
    plan_note_category: PlanNoteCategorySchema;
    plan_person: PlanPersonSchema;
    plan_person_time: PlanPersonTimeSchema;
    plan_template: PlanTemplateSchema;
    plan_time: PlanTimeSchema;
    public_view: PublicViewSchema;
    report_template: ReportTemplateSchema;
    schedule: ScheduleSchema;
    scheduled_person: ScheduledPersonSchema;
    scheduling_preference: SchedulingPreferenceSchema;
    series: SeriesSchema;
    service_type: ServiceTypeSchema;
    service_type_path: ServiceTypePathSchema;
    signup_sheet: SignupSheetSchema;
    signup_sheet_metadata: SignupSheetMetadataSchema;
    skipped_attachment: SkippedAttachmentSchema;
    song: SongSchema;
    song_schedule: SongScheduleSchema;
    songbook_status: SongbookStatusSchema;
    split_team_rehearsal_assignment: SplitTeamRehearsalAssignmentSchema;
    tag: TagSchema;
    tag_group: TagGroupSchema;
    team: TeamSchema;
    team_leader: TeamLeaderSchema;
    team_position: TeamPositionSchema;
    text_setting: TextSettingSchema;
    time_preference_option: TimePreferenceOptionSchema;
    zoom: ZoomSchema;
};

/** Edges available from the product root (`/services/v2`). */
export type ServicesRoot = {
    attachment_types: { vertex: 'attachment_type'; many: true; filters: never; create: false };
    chat: { vertex: 'chat'; many: true; filters: never; create: false };
    email_templates: { vertex: 'email_template'; many: true; filters: never; create: true };
    folders: { vertex: 'folder'; many: true; filters: never; create: true };
    media: { vertex: 'media'; many: true; filters:
        | 'archived'
        | 'audio'
        | 'background_audio'
        | 'background_image'
        | 'background_video'
        | 'countdown'
        | 'curriculum'
        | 'document'
        | 'drama'
        | 'image'
        | 'not_archived'
        | 'powerpoint'
        | 'song_video'
        | 'video'; create: true };
    people: { vertex: 'person'; many: true; filters: never; create: false };
    plans: { vertex: 'organization'; many: true; filters: never; create: false };
    report_templates: { vertex: 'report_template'; many: true; filters: 'matrix' | 'people' | 'plans' | 'without_defaults'; create: false };
    series: { vertex: 'series'; many: true; filters: never; create: false };
    service_types: { vertex: 'service_type'; many: true; filters: 'no_parent'; create: true };
    songs: { vertex: 'song'; many: true; filters: never; create: true };
    tag_groups: { vertex: 'tag_group'; many: true; filters: 'arrangement' | 'media' | 'person' | 'song'; create: false };
    teams: { vertex: 'team'; many: true; filters: 'editable' | 'service_types'; create: true };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<ServicesSchema>, AssertRoot<ServicesRoot>];

/**
 * Each arrangement belongs to a song and is a different version of that song.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/arrangement
 */
export type Arrangement = PcoResource<ArrangementSchema>;
/**
 * Attributes of {@link Arrangement}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/arrangement
 */
export type ArrangementAttributes = ArrangementSchema['attributes'];

/**
 * Sections of an Arrangement, derived from its chord chart
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/arrangement_sections
 */
export type ArrangementSections = PcoResource<ArrangementSectionsSchema>;
/**
 * Attributes of {@link ArrangementSections}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/arrangement_sections
 */
export type ArrangementSectionsAttributes = ArrangementSectionsSchema['attributes'];

/**
 * A file, whether it's stored on Planning Center or linked from another location.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment
 */
export type Attachment = PcoResource<AttachmentSchema>;
/**
 * Attributes of {@link Attachment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment
 */
export type AttachmentAttributes = AttachmentSchema['attributes'];

/**
 * Returned from the `open` attachment action.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_activity
 */
export type AttachmentActivity = PcoResource<AttachmentActivitySchema>;
/**
 * Attributes of {@link AttachmentActivity}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_activity
 */
export type AttachmentActivityAttributes = AttachmentActivitySchema['attributes'];

/**
 * Create an Attachment Type for each type of file you might want only specific people to see. When you attach a file, you can specify an attachment type to then be able to link the file to a position.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_type
 */
export type AttachmentType = PcoResource<AttachmentTypeSchema>;
/**
 * Attributes of {@link AttachmentType}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_type
 */
export type AttachmentTypeAttributes = AttachmentTypeSchema['attributes'];

/**
 * A AttachmentTypeGroup resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_type_group
 */
export type AttachmentTypeGroup = PcoResource<AttachmentTypeGroupSchema>;
/**
 * Attributes of {@link AttachmentTypeGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attachment_type_group
 */
export type AttachmentTypeGroupAttributes = AttachmentTypeGroupSchema['attributes'];

/**
 * A Attendance resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attendance
 */
export type Attendance = PcoResource<AttendanceSchema>;
/**
 * Attributes of {@link Attendance}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/attendance
 */
export type AttendanceAttributes = AttendanceSchema['attributes'];

/**
 * Signups that are available.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/available_signup
 */
export type AvailableSignup = PcoResource<AvailableSignupSchema>;
/**
 * Attributes of {@link AvailableSignup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/available_signup
 */
export type AvailableSignupAttributes = AvailableSignupSchema['attributes'];

/**
 * An object representing a blockout date, and an optional recurrence pattern
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout
 */
export type Blockout = PcoResource<BlockoutSchema>;
/**
 * Attributes of {@link Blockout}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout
 */
export type BlockoutAttributes = BlockoutSchema['attributes'];

/**
 * The actual dates generated by the blockout or its recurrence pattern. Generated up to a year in advance
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_date
 */
export type BlockoutDate = PcoResource<BlockoutDateSchema>;
/**
 * Attributes of {@link BlockoutDate}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_date
 */
export type BlockoutDateAttributes = BlockoutDateSchema['attributes'];

/**
 * A single exception for the dates generated from the blockout
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_exception
 */
export type BlockoutException = PcoResource<BlockoutExceptionSchema>;
/**
 * Attributes of {@link BlockoutException}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_exception
 */
export type BlockoutExceptionAttributes = BlockoutExceptionSchema['attributes'];

/**
 * A BlockoutScheduleConflict resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_schedule_conflict
 */
export type BlockoutScheduleConflict = PcoResource<BlockoutScheduleConflictSchema>;
/**
 * Attributes of {@link BlockoutScheduleConflict}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/blockout_schedule_conflict
 */
export type BlockoutScheduleConflictAttributes = BlockoutScheduleConflictSchema['attributes'];

/**
 * A Chat resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/chat
 */
export type Chat = PcoResource<ChatSchema>;
/**
 * Attributes of {@link Chat}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/chat
 */
export type ChatAttributes = ChatSchema['attributes'];

/**
 * A Contributor Resource
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/contributor
 */
export type Contributor = PcoResource<ContributorSchema>;
/**
 * Attributes of {@link Contributor}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/contributor
 */
export type ContributorAttributes = ContributorSchema['attributes'];

/**
 * A CustomSlide is used for adding text intended for display on a screen.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/custom_slide
 */
export type CustomSlide = PcoResource<CustomSlideSchema>;
/**
 * Attributes of {@link CustomSlide}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/custom_slide
 */
export type CustomSlideAttributes = CustomSlideSchema['attributes'];

/**
 * A persons email
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email
 */
export type Email = PcoResource<EmailSchema>;
/**
 * Attributes of {@link Email}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email
 */
export type EmailAttributes = EmailSchema['attributes'];

/**
 * A EmailTemplate Resource
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email_template
 */
export type EmailTemplate = PcoResource<EmailTemplateSchema>;
/**
 * Attributes of {@link EmailTemplate}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email_template
 */
export type EmailTemplateAttributes = EmailTemplateSchema['attributes'];

/**
 * A EmailTemplateRenderedResponse Resource
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email_template_rendered_response
 */
export type EmailTemplateRenderedResponse = PcoResource<EmailTemplateRenderedResponseSchema>;
/**
 * Attributes of {@link EmailTemplateRenderedResponse}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/email_template_rendered_response
 */
export type EmailTemplateRenderedResponseAttributes = EmailTemplateRenderedResponseSchema['attributes'];

/**
 * A folder is a container used to organize multiple Service Types or other Folders.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/folder
 */
export type Folder = PcoResource<FolderSchema>;
/**
 * Attributes of {@link Folder}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/folder
 */
export type FolderAttributes = FolderSchema['attributes'];

/**
 * The Folder path of a Folder
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/folder_path
 */
export type FolderPath = PcoResource<FolderPathSchema>;
/**
 * Attributes of {@link FolderPath}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/folder_path
 */
export type FolderPathAttributes = FolderPathSchema['attributes'];

/**
 * An item in a plan.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item
 */
export type Item = PcoResource<ItemSchema>;
/**
 * Attributes of {@link Item}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item
 */
export type ItemAttributes = ItemSchema['attributes'];

/**
 * An assignment of a person or position to a plan item.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_assignment
 */
export type ItemAssignment = PcoResource<ItemAssignmentSchema>;
/**
 * Attributes of {@link ItemAssignment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_assignment
 */
export type ItemAssignmentAttributes = ItemAssignmentSchema['attributes'];

/**
 * A plan item note that belongs to a category.
 *
 * Note: You can only assign the category on create. If you want to change category; delete the current note, and create a new one passing in the `item_note_category_id` then.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_note
 */
export type ItemNote = PcoResource<ItemNoteSchema>;
/**
 * Attributes of {@link ItemNote}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_note
 */
export type ItemNoteAttributes = ItemNoteSchema['attributes'];

/**
 * A category of plan item notes for an entire Service Type.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_note_category
 */
export type ItemNoteCategory = PcoResource<ItemNoteCategorySchema>;
/**
 * Attributes of {@link ItemNoteCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_note_category
 */
export type ItemNoteCategoryAttributes = ItemNoteCategorySchema['attributes'];

/**
 * A ItemTime resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_time
 */
export type ItemTime = PcoResource<ItemTimeSchema>;
/**
 * Attributes of {@link ItemTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/item_time
 */
export type ItemTimeAttributes = ItemTimeSchema['attributes'];

/**
 * Each song arrangement can have multiple keys. A key is the pitch center of the song.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/key
 */
export type Key = PcoResource<KeySchema>;
/**
 * Attributes of {@link Key}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/key
 */
export type KeyAttributes = KeySchema['attributes'];

/**
 * A Live resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/live
 */
export type Live = PcoResource<LiveSchema>;
/**
 * Attributes of {@link Live}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/live
 */
export type LiveAttributes = LiveSchema['attributes'];

/**
 * A person who can control Services LIVE without the required permissions
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/live_controller
 */
export type LiveController = PcoResource<LiveControllerSchema>;
/**
 * Attributes of {@link LiveController}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/live_controller
 */
export type LiveControllerAttributes = LiveControllerSchema['attributes'];

/**
 * A piece of media
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/media
 */
export type Media = PcoResource<MediaSchema>;
/**
 * Attributes of {@link Media}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/media
 */
export type MediaAttributes = MediaSchema['attributes'];

/**
 * A MediaSchedule resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/media_schedule
 */
export type MediaSchedule = PcoResource<MediaScheduleSchema>;
/**
 * Attributes of {@link MediaSchedule}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/media_schedule
 */
export type MediaScheduleAttributes = MediaScheduleSchema['attributes'];

/**
 * An amount of unfilled positions needed within a team in a plan.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/needed_position
 */
export type NeededPosition = PcoResource<NeededPositionSchema>;
/**
 * Attributes of {@link NeededPosition}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/needed_position
 */
export type NeededPositionAttributes = NeededPositionSchema['attributes'];

/**
 * The root level of an organization where account-level settings are applied.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * A person added to Planning Center Services.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A person's assignment to a position within a team.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/person_team_position_assignment
 */
export type PersonTeamPositionAssignment = PcoResource<PersonTeamPositionAssignmentSchema>;
/**
 * Attributes of {@link PersonTeamPositionAssignment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/person_team_position_assignment
 */
export type PersonTeamPositionAssignmentAttributes = PersonTeamPositionAssignmentSchema['attributes'];

/**
 * A single plan within a Service Type.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan
 */
export type Plan = PcoResource<PlanSchema>;
/**
 * Attributes of {@link Plan}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan
 */
export type PlanAttributes = PlanSchema['attributes'];

/**
 * Metadata about a Plan or Template import
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_import_metadata
 */
export type PlanImportMetadata = PcoResource<PlanImportMetadataSchema>;
/**
 * Attributes of {@link PlanImportMetadata}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_import_metadata
 */
export type PlanImportMetadataAttributes = PlanImportMetadataSchema['attributes'];

/**
 * A specific plan note within a single plan.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_note
 */
export type PlanNote = PcoResource<PlanNoteSchema>;
/**
 * Attributes of {@link PlanNote}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_note
 */
export type PlanNoteAttributes = PlanNoteSchema['attributes'];

/**
 * A category of plan notes for an entire Service Type.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_note_category
 */
export type PlanNoteCategory = PcoResource<PlanNoteCategorySchema>;
/**
 * Attributes of {@link PlanNoteCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_note_category
 */
export type PlanNoteCategoryAttributes = PlanNoteCategorySchema['attributes'];

/**
 * A person scheduled within a specific plan.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_person
 */
export type PlanPerson = PcoResource<PlanPersonSchema>;
/**
 * Attributes of {@link PlanPerson}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_person
 */
export type PlanPersonAttributes = PlanPersonSchema['attributes'];

/**
 * A PlanPersonTime resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_person_time
 */
export type PlanPersonTime = PcoResource<PlanPersonTimeSchema>;
/**
 * Attributes of {@link PlanPersonTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_person_time
 */
export type PlanPersonTimeAttributes = PlanPersonTimeSchema['attributes'];

/**
 * A PlanTemplate Resource
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_template
 */
export type PlanTemplate = PcoResource<PlanTemplateSchema>;
/**
 * Attributes of {@link PlanTemplate}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_template
 */
export type PlanTemplateAttributes = PlanTemplateSchema['attributes'];

/**
 * A time in a plan.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_time
 */
export type PlanTime = PcoResource<PlanTimeSchema>;
/**
 * Attributes of {@link PlanTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/plan_time
 */
export type PlanTimeAttributes = PlanTimeSchema['attributes'];

/**
 * Manage options for a public plan
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/public_view
 */
export type PublicView = PcoResource<PublicViewSchema>;
/**
 * Attributes of {@link PublicView}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/public_view
 */
export type PublicViewAttributes = PublicViewSchema['attributes'];

/**
 * A template for generating reports
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/report_template
 */
export type ReportTemplate = PcoResource<ReportTemplateSchema>;
/**
 * Attributes of {@link ReportTemplate}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/report_template
 */
export type ReportTemplateAttributes = ReportTemplateSchema['attributes'];

/**
 * An instance of a PlanPerson with included data for displaying in a user's schedule
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/schedule
 */
export type Schedule = PcoResource<ScheduleSchema>;
/**
 * Attributes of {@link Schedule}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/schedule
 */
export type ScheduleAttributes = ScheduleSchema['attributes'];

/**
 * A person already scheduled to a SignupSheet
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/scheduled_person
 */
export type ScheduledPerson = PcoResource<ScheduledPersonSchema>;
/**
 * Attributes of {@link ScheduledPerson}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/scheduled_person
 */
export type ScheduledPersonAttributes = ScheduledPersonSchema['attributes'];

/**
 * Household member scheduling preference
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/scheduling_preference
 */
export type SchedulingPreference = PcoResource<SchedulingPreferenceSchema>;
/**
 * Attributes of {@link SchedulingPreference}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/scheduling_preference
 */
export type SchedulingPreferenceAttributes = SchedulingPreferenceSchema['attributes'];

/**
 * A Series can be specified for each plan to tie plans with similar messages together, even across Service Types.
 *
 * *Note*: A series is not created until artwork is added from the plan.  You can use `series_title` included in `Plan` attributes to get titles for series without artwork.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/series
 */
export type Series = PcoResource<SeriesSchema>;
/**
 * Attributes of {@link Series}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/series
 */
export type SeriesAttributes = SeriesSchema['attributes'];

/**
 * A Service Type is a container for plans.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/service_type
 */
export type ServiceType = PcoResource<ServiceTypeSchema>;
/**
 * Attributes of {@link ServiceType}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/service_type
 */
export type ServiceTypeAttributes = ServiceTypeSchema['attributes'];

/**
 * The Folder path of a Service Type
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/service_type_path
 */
export type ServiceTypePath = PcoResource<ServiceTypePathSchema>;
/**
 * Attributes of {@link ServiceTypePath}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/service_type_path
 */
export type ServiceTypePathAttributes = ServiceTypePathSchema['attributes'];

/**
 * Available positions to sign up for
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/signup_sheet
 */
export type SignupSheet = PcoResource<SignupSheetSchema>;
/**
 * Attributes of {@link SignupSheet}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/signup_sheet
 */
export type SignupSheetAttributes = SignupSheetSchema['attributes'];

/**
 * A SignupSheetMetadata Resource
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/signup_sheet_metadata
 */
export type SignupSheetMetadata = PcoResource<SignupSheetMetadataSchema>;
/**
 * Attributes of {@link SignupSheetMetadata}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/signup_sheet_metadata
 */
export type SignupSheetMetadataAttributes = SignupSheetMetadataSchema['attributes'];

/**
 * a skipped attachment
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/skipped_attachment
 */
export type SkippedAttachment = PcoResource<SkippedAttachmentSchema>;
/**
 * Attributes of {@link SkippedAttachment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/skipped_attachment
 */
export type SkippedAttachmentAttributes = SkippedAttachmentSchema['attributes'];

/**
 * A song
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/song
 */
export type Song = PcoResource<SongSchema>;
/**
 * Attributes of {@link Song}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/song
 */
export type SongAttributes = SongSchema['attributes'];

/**
 * A upcoming schedule for a song
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/song_schedule
 */
export type SongSchedule = PcoResource<SongScheduleSchema>;
/**
 * Attributes of {@link SongSchedule}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/song_schedule
 */
export type SongScheduleAttributes = SongScheduleSchema['attributes'];

/**
 * Used to get the status of an in progress songbook action. When FINISHED, will contain the url of the songbook.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/songbook_status
 */
export type SongbookStatus = PcoResource<SongbookStatusSchema>;
/**
 * Attributes of {@link SongbookStatus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/songbook_status
 */
export type SongbookStatusAttributes = SongbookStatusSchema['attributes'];

/**
 * For Rehearsal/Other Times, maps a Split Team to selected Time Preference Options. For example, used to assign 8am Ushers to 7:30am call time, and 11am Ushers to 10:30am call time.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/split_team_rehearsal_assignment
 */
export type SplitTeamRehearsalAssignment = PcoResource<SplitTeamRehearsalAssignmentSchema>;
/**
 * Attributes of {@link SplitTeamRehearsalAssignment}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/split_team_rehearsal_assignment
 */
export type SplitTeamRehearsalAssignmentAttributes = SplitTeamRehearsalAssignmentSchema['attributes'];

/**
 * A tag belonging to a tag group.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/tag
 */
export type Tag = PcoResource<TagSchema>;
/**
 * Attributes of {@link Tag}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/tag
 */
export type TagAttributes = TagSchema['attributes'];

/**
 * A tag group contains tags
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/tag_group
 */
export type TagGroup = PcoResource<TagGroupSchema>;
/**
 * Attributes of {@link TagGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/tag_group
 */
export type TagGroupAttributes = TagGroupSchema['attributes'];

/**
 * A Team within a Service Type.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team
 */
export type Team = PcoResource<TeamSchema>;
/**
 * Attributes of {@link Team}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team
 */
export type TeamAttributes = TeamSchema['attributes'];

/**
 * A leader of a specific Team in a Service Type.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team_leader
 */
export type TeamLeader = PcoResource<TeamLeaderSchema>;
/**
 * Attributes of {@link TeamLeader}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team_leader
 */
export type TeamLeaderAttributes = TeamLeaderSchema['attributes'];

/**
 * A position within a team.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team_position
 */
export type TeamPosition = PcoResource<TeamPositionSchema>;
/**
 * Attributes of {@link TeamPosition}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/team_position
 */
export type TeamPositionAttributes = TeamPositionSchema['attributes'];

/**
 * A TextSetting resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/text_setting
 */
export type TextSetting = PcoResource<TextSettingSchema>;
/**
 * Attributes of {@link TextSetting}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/text_setting
 */
export type TextSettingAttributes = TextSettingSchema['attributes'];

/**
 * A Service Time a person prefers to be scheduled to.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/time_preference_option
 */
export type TimePreferenceOption = PcoResource<TimePreferenceOptionSchema>;
/**
 * Attributes of {@link TimePreferenceOption}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/time_preference_option
 */
export type TimePreferenceOptionAttributes = TimePreferenceOptionSchema['attributes'];

/**
 * Describes a zoom level for an attachment
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/zoom
 */
export type Zoom = PcoResource<ZoomSchema>;
/**
 * Attributes of {@link Zoom}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/services/versions/2018-11-01/vertices/zoom
 */
export type ZoomAttributes = ZoomSchema['attributes'];
