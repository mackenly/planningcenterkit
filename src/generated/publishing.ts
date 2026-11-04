/**
 * Planning Center Publishing API (`/publishing/v2`).
 *
 * Generated from the Planning Center API documentation, version 2024-03-25, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Publishing: paths and capabilities only. */
export const publishingGraph = {
    product: 'publishing',
    slug: 'publishing',
    basePath: '/publishing/v2',
    version: '2024-03-25',
    rootVertex: 'organization',
    root: {
        announcement_categories: { vertex: 'announcement_category', many: true, canCreate: false },
        announcements: { vertex: 'announcement', many: true, canCreate: false },
        channels: { vertex: 'channel', many: true, canCreate: true },
        episodes: { vertex: 'episode', many: true, canCreate: true },
        series: { vertex: 'series', many: true, canCreate: true },
        speakers: { vertex: 'speaker', many: true, canCreate: false },
    },
    vertices: {
        announcement: {
            type: 'Announcement',
            edges: {
                announcements_announcement_categories: { vertex: 'announcements_announcement_category', many: true, canCreate: false },
                announcements_campuses: { vertex: 'announcements_campus', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/publishing/v2/announcements',
        },
        announcement_category: {
            type: 'AnnouncementCategory',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/publishing/v2/announcement_categories',
        },
        announcements_announcement_category: {
            type: 'AnnouncementsAnnouncementCategory',
            edges: {
                announcement_category: { vertex: 'announcement_category', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        announcements_campus: {
            type: 'AnnouncementsCampus',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        channel: {
            type: 'Channel',
            edges: {
                channel_default_episode_resources: { vertex: 'channel_default_episode_resource', many: true, canCreate: false },
                channel_default_times: { vertex: 'channel_default_time', many: true, canCreate: true },
                current_episode: { vertex: 'episode', many: true, canCreate: false },
                episodes: { vertex: 'episode', many: true, canCreate: false },
                next_times: { vertex: 'channel_next_time', many: true, canCreate: false },
                series: { vertex: 'series', many: true, canCreate: false },
                statistics: { vertex: 'episode_statistics', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/publishing/v2/channels',
        },
        channel_default_episode_resource: {
            type: 'ChannelDefaultEpisodeResource',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        channel_default_time: {
            type: 'ChannelDefaultTime',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        channel_next_time: {
            type: 'ChannelNextTime',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        episode: {
            type: 'Episode',
            edges: {
                channel: { vertex: 'channel', many: true, canCreate: false },
                episode_resources: { vertex: 'episode_resource', many: true, canCreate: true },
                episode_times: { vertex: 'episode_time', many: true, canCreate: true },
                note_template: { vertex: 'note_template', many: false, canCreate: false },
                series: { vertex: 'series', many: true, canCreate: false },
                speakerships: { vertex: 'speakership', many: true, canCreate: false },
            },
            actions: ['generate_download_url'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/publishing/v2/episodes',
        },
        episode_resource: {
            type: 'EpisodeResource',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        episode_statistics: {
            type: 'EpisodeStatistics',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        episode_time: {
            type: 'EpisodeTime',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        note_template: {
            type: 'NoteTemplate',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: false,
        },
        organization: {
            type: 'Organization',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        series: {
            type: 'Series',
            edges: {
                channel: { vertex: 'channel', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/publishing/v2/series',
        },
        speaker: {
            type: 'Speaker',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/publishing/v2/speakers',
        },
        speakership: {
            type: 'Speakership',
            edges: {
                speaker: { vertex: 'speaker', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Announcement}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcement
 */
export interface AnnouncementSchema {
    type: 'Announcement';
    attributes: {
        archived: boolean | null;
        attach_linked_resource_image_job_id: string | null;
        church_center_url: string | null;
        featured: boolean | null;
        hide_at: string | null;
        image: Record<string, unknown> | null;
        link: string | null;
        link_resource_id: number | null;
        link_type: string | null;
        position: number | null;
        show_at: string | null;
        status: string | null;
        summary: string | null;
        title: string | null;
    };
    relationships: never;
    includes: 'announcements_announcement_categories' | 'announcements_campuses';
    related: {
        announcements_announcement_categories: 'announcements_announcement_category';
        announcements_campuses: 'announcements_campus';
    };
    where: {
        title: string;
    };
    whereOps: {};
    order: 'featured' | 'position' | 'show_at' | 'status' | 'title';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        announcements_announcement_categories: { vertex: 'announcements_announcement_category'; many: true; filters: never; create: false };
        announcements_campuses: { vertex: 'announcements_campus'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link AnnouncementCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcement_category
 */
export interface AnnouncementCategorySchema {
    type: 'AnnouncementCategory';
    attributes: {
        name: string | null;
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
 * Type-level schema of {@link AnnouncementsAnnouncementCategory}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcements_announcement_category
 */
export interface AnnouncementsAnnouncementCategorySchema {
    type: 'AnnouncementsAnnouncementCategory';
    attributes: {};
    relationships: 'announcement_category';
    includes: 'announcement_category';
    related: {
        announcement_category: 'announcement_category';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        announcement_category: { vertex: 'announcement_category'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link AnnouncementsCampus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcements_campus
 */
export interface AnnouncementsCampusSchema {
    type: 'AnnouncementsCampus';
    attributes: {};
    relationships: 'campus';
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
 * Type-level schema of {@link Channel}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel
 */
export interface ChannelSchema {
    type: 'Channel';
    attributes: {
        /** The activation time for an episode, expressed in minutes before its start */
        activate_episode_minutes_before: number | null;
        archived: boolean | null;
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art: Record<string, unknown> | null;
        can_enable_chat: boolean | null;
        church_center_url: string | null;
        created_at: string | null;
        default_video_duration: number | null;
        default_video_embed_code: string | null;
        default_video_url: string | null;
        description: string | null;
        enable_audio: boolean | null;
        enable_on_demand_video: boolean | null;
        enable_watch_live: boolean | null;
        general_chat_enabled: boolean | null;
        group_chat_enabled: boolean | null;
        name: string | null;
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        podcast_art: Record<string, unknown> | null;
        podcast_feed_url: string | null;
        podcast_settings: Record<string, unknown> | null;
        position: number | null;
        published: boolean | null;
        sermon_notes_enabled: boolean | null;
        /**
         * The id for the associated Services Service Type (https://developer.planning.center/docs/#/apps/services/2018-08-01/vertices/service_type)
         */
        services_service_type_remote_identifier: string | null;
        updated_at: string | null;
        url: string | null;
    };
    relationships: never;
    includes: 'channel_default_episode_resources' | 'channel_default_times' | 'current_episode';
    related: {
        channel_default_episode_resources: 'channel_default_episode_resource';
        channel_default_times: 'channel_default_time';
        current_episode: 'episode';
    };
    where: {};
    whereOps: {};
    order: 'name' | 'position';
    create: {
        /** The activation time for an episode, expressed in minutes before its start */
        activate_episode_minutes_before?: number | null;
        archived?: boolean | null;
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art?: Record<string, unknown> | null;
        default_video_duration?: number | null;
        default_video_embed_code?: string | null;
        default_video_url?: string | null;
        description?: string | null;
        enable_audio?: boolean | null;
        enable_on_demand_video?: boolean | null;
        enable_watch_live?: boolean | null;
        general_chat_enabled?: boolean | null;
        group_chat_enabled?: boolean | null;
        name?: string | null;
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        podcast_art?: Record<string, unknown> | null;
        podcast_settings?: Record<string, unknown> | null;
        position?: number | null;
        published?: boolean | null;
        sermon_notes_enabled?: boolean | null;
        url?: string | null;
    };
    update: {
        /** The activation time for an episode, expressed in minutes before its start */
        activate_episode_minutes_before?: number | null;
        archived?: boolean | null;
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art?: Record<string, unknown> | null;
        default_video_duration?: number | null;
        default_video_embed_code?: string | null;
        default_video_url?: string | null;
        description?: string | null;
        enable_audio?: boolean | null;
        enable_on_demand_video?: boolean | null;
        enable_watch_live?: boolean | null;
        general_chat_enabled?: boolean | null;
        group_chat_enabled?: boolean | null;
        name?: string | null;
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        podcast_art?: Record<string, unknown> | null;
        podcast_settings?: Record<string, unknown> | null;
        position?: number | null;
        published?: boolean | null;
        sermon_notes_enabled?: boolean | null;
        url?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        channel_default_episode_resources: { vertex: 'channel_default_episode_resource'; many: true; filters: never; create: false };
        channel_default_times: { vertex: 'channel_default_time'; many: true; filters: never; create: true };
        current_episode: { vertex: 'episode'; many: true; filters: never; create: false };
        episodes: { vertex: 'episode'; many: true; filters:
            | 'connected_to_services'
            | 'not_connected_to_services'
            | 'not_published'
            | 'published'
            | 'published_to_library'; create: false };
        next_times: { vertex: 'channel_next_time'; many: true; filters: never; create: false };
        series: { vertex: 'series'; many: true; filters: never; create: false };
        statistics: { vertex: 'episode_statistics'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link ChannelDefaultEpisodeResource}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_default_episode_resource
 */
export interface ChannelDefaultEpisodeResourceSchema {
    type: 'ChannelDefaultEpisodeResource';
    attributes: {
        featured: boolean | null;
        icon: string | null;
        /**
         * Possible values: `giving_fund`, `people_form`, `generic_url`, `services_public_page`
         */
        kind: string | null;
        position: number | null;
        title: string | null;
        type: string | null;
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
 * Type-level schema of {@link ChannelDefaultTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_default_time
 */
export interface ChannelDefaultTimeSchema {
    type: 'ChannelDefaultTime';
    attributes: {
        /** The day of the week. 0 is Sunday, 1 is Monday, etc. */
        day_of_week: number | null;
        /** Possible values: `weekly` */
        frequency: string | null;
        hour: number | null;
        minute: number | null;
        position: number | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'position';
    create: {
        /** The day of the week. 0 is Sunday, 1 is Monday, etc. */
        day_of_week?: number | null;
        /** Possible values: `weekly` */
        frequency?: string | null;
        hour?: number | null;
        minute?: number | null;
        position?: number | null;
    };
    update: {
        /** The day of the week. 0 is Sunday, 1 is Monday, etc. */
        day_of_week?: number | null;
        /** Possible values: `weekly` */
        frequency?: string | null;
        hour?: number | null;
        minute?: number | null;
        position?: number | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link ChannelNextTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_next_time
 */
export interface ChannelNextTimeSchema {
    type: 'ChannelNextTime';
    attributes: {
        starts_at: string | null;
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
 * Type-level schema of {@link Episode}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode
 */
export interface EpisodeSchema {
    type: 'Episode';
    attributes: {
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art: Record<string, unknown> | null;
        church_center_url: string | null;
        created_at: string | null;
        description: string | null;
        library_audio_url: string | null;
        /**
         * Possible values: `vimeo`, `youtube`, `livestream_com`, `resi`, `facebook`, or `boxcast`
         */
        library_streaming_service: string | null;
        library_video_embed_code: string | null;
        library_video_thumbnail_url: string | null;
        library_video_url: string | null;
        needs_library_audio_or_video_url: boolean | null;
        needs_notes_template: boolean | null;
        needs_video_url: boolean | null;
        page_actions: unknown[] | null;
        published_live_at: string | null;
        published_to_library_at: string | null;
        /**
         * An audio file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        sermon_audio: Record<string, unknown> | null;
        /**
         * The id for the associated Services Plan
         * (https://developer.planning.center/docs/#/apps/services/2018-08-01/vertices/plan)
         */
        services_plan_remote_identifier: string | null;
        /**
         * The id for the associated Services Service Type
         * (https://developer.planning.center/docs/#/apps/services/2018-08-01/vertices/service_type)
         */
        services_service_type_remote_identifier: string | null;
        /** Possible values: `channel_default_livestream`, `livestream`, or `prerecorded` */
        stream_type: string | null;
        /**
         * Possible values: `vimeo`, `youtube`, `livestream_com`, `resi`, `facebook`, or `boxcast`
         */
        streaming_service: string | null;
        /**
         * The description as HTML, limited to paragraphs, line breaks, bold, and italics.
         * Setting it also replaces description with its plain text.
         */
        summary: string | null;
        title: string | null;
        updated_at: string | null;
        video_embed_code: string | null;
        video_thumbnail_url: string | null;
        video_url: string | null;
    };
    relationships: 'series';
    includes: 'channel' | 'episode_resources' | 'episode_times' | 'series' | 'speakerships';
    related: {
        channel: 'channel';
        episode_resources: 'episode_resource';
        episode_times: 'episode_time';
        series: 'series';
        speakerships: 'speakership';
    };
    where: {
        series_id: string | number;
        services_plan_remote_identifier: string;
        services_service_type_remote_identifier: string;
    };
    whereOps: {};
    order: 'published_live_at' | 'published_to_library_at' | 'stream_type' | 'title';
    create: {
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art?: Record<string, unknown> | null;
        description?: string | null;
        library_audio_url?: string | null;
        library_video_url?: string | null;
        published_to_library_at?: string | null;
        series_id?: string;
        /**
         * An audio file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        sermon_audio?: Record<string, unknown> | null;
        /** Possible values: `channel_default_livestream`, `livestream`, or `prerecorded` */
        stream_type?: string | null;
        /**
         * The description as HTML, limited to paragraphs, line breaks, bold, and italics.
         * Setting it also replaces description with its plain text.
         */
        summary?: string | null;
        title?: string | null;
        video_url?: string | null;
    };
    update: {
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art?: Record<string, unknown> | null;
        description?: string | null;
        library_audio_url?: string | null;
        library_video_url?: string | null;
        published_to_library_at?: string | null;
        series_id?: string;
        /**
         * An audio file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        sermon_audio?: Record<string, unknown> | null;
        /** Possible values: `channel_default_livestream`, `livestream`, or `prerecorded` */
        stream_type?: string | null;
        /**
         * The description as HTML, limited to paragraphs, line breaks, bold, and italics.
         * Setting it also replaces description with its plain text.
         */
        summary?: string | null;
        title?: string | null;
        video_url?: string | null;
    };
    delete: true;
    actions: 'generate_download_url';
    edges: {
        channel: { vertex: 'channel'; many: true; filters: never; create: false };
        episode_resources: { vertex: 'episode_resource'; many: true; filters: never; create: true };
        episode_times: { vertex: 'episode_time'; many: true; filters: never; create: true };
        note_template: { vertex: 'note_template'; many: false; filters: never; create: false };
        series: { vertex: 'series'; many: true; filters: never; create: false };
        speakerships: { vertex: 'speakership'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link EpisodeResource}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_resource
 */
export interface EpisodeResourceSchema {
    type: 'EpisodeResource';
    attributes: {
        featured: boolean | null;
        icon: string | null;
        /**
         * Possible values: `giving_fund`, `people_form`, `generic_url`, `services_public_page`
         */
        kind: string | null;
        position: number | null;
        title: string | null;
        type: string | null;
        url: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'position';
    create: {
        featured?: boolean | null;
        icon?: string | null;
        position?: number | null;
        title?: string | null;
        type?: string | null;
        url?: string | null;
    };
    update: {
        featured?: boolean | null;
        icon?: string | null;
        position?: number | null;
        title?: string | null;
        type?: string | null;
        url?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link EpisodeStatistics}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_statistics
 */
export interface EpisodeStatisticsSchema {
    type: 'EpisodeStatistics';
    attributes: {
        library_watch_count: boolean | null;
        live_watch_count: boolean | null;
        published_live_at: string | null;
        published_to_library_at: string | null;
        /** `watch_count` per EpisodeTime */
        times: unknown[] | null;
        title: string | null;
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
 * Type-level schema of {@link EpisodeTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_time
 */
export interface EpisodeTimeSchema {
    type: 'EpisodeTime';
    attributes: {
        caveats: unknown[] | null;
        /** Possible values: `upcoming`, `active`, `over` */
        current_state: string | null;
        current_timestamp: number | null;
        ends_at: string | null;
        starts_at: string | null;
        /**
         * Possible values: `vimeo`, `youtube`, `livestream_com`, `resi`, `facebook`, `boxcast`
         */
        streaming_service: string | null;
        video_embed_code: string | null;
        video_url: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'starts_at';
    create: {
        starts_at?: string | null;
        video_embed_code?: string | null;
        video_url?: string | null;
    };
    update: {
        starts_at?: string | null;
        video_embed_code?: string | null;
        video_url?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link NoteTemplate}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/note_template
 */
export interface NoteTemplateSchema {
    type: 'NoteTemplate';
    attributes: {
        auto_create_free_form_notes: boolean | null;
        enabled: boolean | null;
        published_at: string | null;
        template: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {
        auto_create_free_form_notes?: boolean | null;
        enabled?: boolean | null;
        template?: string | null;
    };
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        /** Only available when requested with the `?fields` param */
        downloads_used: number | null;
        name: string | null;
        subdomain: string | null;
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
 * Type-level schema of {@link Series}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/series
 */
export interface SeriesSchema {
    type: 'Series';
    attributes: {
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art: Record<string, unknown> | null;
        church_center_url: string | null;
        created_at: string | null;
        description: string | null;
        ended_at: string | null;
        episodes_count: number | null;
        published: boolean | null;
        started_at: string | null;
        title: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'channel';
    related: {
        channel: 'channel';
    };
    where: {
        id: string;
    };
    whereOps: {};
    order: 'ended_at' | 'episodes_count' | 'started_at' | 'title';
    create: {
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art?: Record<string, unknown> | null;
        description?: string | null;
        published?: boolean | null;
        title?: string | null;
    };
    update: {
        /**
         * An image file object. When setting, pass an upload UUID from the Uploads API
         * (https://api.planningcenteronline.com/docs/overview/file-uploads)
         * or a signed_identifier from an existing File.
         */
        art?: Record<string, unknown> | null;
        description?: string | null;
        published?: boolean | null;
        title?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        channel: { vertex: 'channel'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Speaker}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/speaker
 */
export interface SpeakerSchema {
    type: 'Speaker';
    attributes: {
        avatar_url: string | null;
        episodes_count: number | null;
        first_name: string | null;
        formatted_name: string | null;
        last_name: string | null;
        name_prefix: string | null;
        name_suffix: string | null;
        speaker_type: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: 'first_name';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Speakership}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/speakership
 */
export interface SpeakershipSchema {
    type: 'Speakership';
    attributes: {};
    relationships: 'speaker';
    includes: 'speaker';
    related: {
        speaker: 'speaker';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: true;
    actions: never;
    edges: {
        speaker: { vertex: 'speaker'; many: true; filters: never; create: false };
    };
}

/** Type-level schema of every Planning Center Publishing resource, keyed by vertex id. */
export type PublishingSchema = {
    announcement: AnnouncementSchema;
    announcement_category: AnnouncementCategorySchema;
    announcements_announcement_category: AnnouncementsAnnouncementCategorySchema;
    announcements_campus: AnnouncementsCampusSchema;
    channel: ChannelSchema;
    channel_default_episode_resource: ChannelDefaultEpisodeResourceSchema;
    channel_default_time: ChannelDefaultTimeSchema;
    channel_next_time: ChannelNextTimeSchema;
    episode: EpisodeSchema;
    episode_resource: EpisodeResourceSchema;
    episode_statistics: EpisodeStatisticsSchema;
    episode_time: EpisodeTimeSchema;
    note_template: NoteTemplateSchema;
    organization: OrganizationSchema;
    series: SeriesSchema;
    speaker: SpeakerSchema;
    speakership: SpeakershipSchema;
};

/** Edges available from the product root (`/publishing/v2`). */
export type PublishingRoot = {
    announcement_categories: { vertex: 'announcement_category'; many: true; filters: never; create: false };
    announcements: { vertex: 'announcement'; many: true; filters:
        | 'active'
        | 'active_and_scheduled'
        | 'archived'
        | 'inactive'; create: false };
    channels: { vertex: 'channel'; many: true; filters:
        | 'archived'
        | 'not_archived'
        | 'podcast_enabled'
        | 'published'; create: true };
    episodes: { vertex: 'episode'; many: true; filters:
        | 'connected_to_services'
        | 'not_connected_to_services'
        | 'not_published_live'
        | 'published_live'
        | 'published_on_church_center'; create: true };
    series: { vertex: 'series'; many: true; filters:
        | 'not_published'
        | 'published'
        | 'published_on_church_center'; create: true };
    speakers: { vertex: 'speaker'; many: true; filters: never; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<PublishingSchema>, AssertRoot<PublishingRoot>];

/**
 * A Announcement resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcement
 */
export type Announcement = PcoResource<AnnouncementSchema>;
/**
 * Attributes of {@link Announcement}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcement
 */
export type AnnouncementAttributes = AnnouncementSchema['attributes'];

/**
 * A AnnouncementCategory resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcement_category
 */
export type AnnouncementCategory = PcoResource<AnnouncementCategorySchema>;
/**
 * Attributes of {@link AnnouncementCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcement_category
 */
export type AnnouncementCategoryAttributes = AnnouncementCategorySchema['attributes'];

/**
 * A AnnouncementsAnnouncementCategory resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcements_announcement_category
 */
export type AnnouncementsAnnouncementCategory = PcoResource<AnnouncementsAnnouncementCategorySchema>;
/**
 * Attributes of {@link AnnouncementsAnnouncementCategory}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcements_announcement_category
 */
export type AnnouncementsAnnouncementCategoryAttributes = AnnouncementsAnnouncementCategorySchema['attributes'];

/**
 * A AnnouncementsCampus resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcements_campus
 */
export type AnnouncementsCampus = PcoResource<AnnouncementsCampusSchema>;
/**
 * Attributes of {@link AnnouncementsCampus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/announcements_campus
 */
export type AnnouncementsCampusAttributes = AnnouncementsCampusSchema['attributes'];

/**
 * A collection of sermons
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel
 */
export type Channel = PcoResource<ChannelSchema>;
/**
 * Attributes of {@link Channel}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel
 */
export type ChannelAttributes = ChannelSchema['attributes'];

/**
 * The default EpisodeResources for a Channel
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_default_episode_resource
 */
export type ChannelDefaultEpisodeResource = PcoResource<ChannelDefaultEpisodeResourceSchema>;
/**
 * Attributes of {@link ChannelDefaultEpisodeResource}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_default_episode_resource
 */
export type ChannelDefaultEpisodeResourceAttributes = ChannelDefaultEpisodeResourceSchema['attributes'];

/**
 * The default times for a channel
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_default_time
 */
export type ChannelDefaultTime = PcoResource<ChannelDefaultTimeSchema>;
/**
 * Attributes of {@link ChannelDefaultTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_default_time
 */
export type ChannelDefaultTimeAttributes = ChannelDefaultTimeSchema['attributes'];

/**
 * The next default time for a channel
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_next_time
 */
export type ChannelNextTime = PcoResource<ChannelNextTimeSchema>;
/**
 * Attributes of {@link ChannelNextTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/channel_next_time
 */
export type ChannelNextTimeAttributes = ChannelNextTimeSchema['attributes'];

/**
 * A Episode resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode
 */
export type Episode = PcoResource<EpisodeSchema>;
/**
 * Attributes of {@link Episode}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode
 */
export type EpisodeAttributes = EpisodeSchema['attributes'];

/**
 * A EpisodeResource resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_resource
 */
export type EpisodeResource = PcoResource<EpisodeResourceSchema>;
/**
 * Attributes of {@link EpisodeResource}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_resource
 */
export type EpisodeResourceAttributes = EpisodeResourceSchema['attributes'];

/**
 * Viewership statistics for an episode
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_statistics
 */
export type EpisodeStatistics = PcoResource<EpisodeStatisticsSchema>;
/**
 * Attributes of {@link EpisodeStatistics}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_statistics
 */
export type EpisodeStatisticsAttributes = EpisodeStatisticsSchema['attributes'];

/**
 * Live schedule times for an Episode
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_time
 */
export type EpisodeTime = PcoResource<EpisodeTimeSchema>;
/**
 * Attributes of {@link EpisodeTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/episode_time
 */
export type EpisodeTimeAttributes = EpisodeTimeSchema['attributes'];

/**
 * A NoteTemplate resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/note_template
 */
export type NoteTemplate = PcoResource<NoteTemplateSchema>;
/**
 * Attributes of {@link NoteTemplate}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/note_template
 */
export type NoteTemplateAttributes = NoteTemplateSchema['attributes'];

/**
 * A Organization resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * A Series resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/series
 */
export type Series = PcoResource<SeriesSchema>;
/**
 * Attributes of {@link Series}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/series
 */
export type SeriesAttributes = SeriesSchema['attributes'];

/**
 * A Speaker resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/speaker
 */
export type Speaker = PcoResource<SpeakerSchema>;
/**
 * Attributes of {@link Speaker}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/speaker
 */
export type SpeakerAttributes = SpeakerSchema['attributes'];

/**
 * A Speakership resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/speakership
 */
export type Speakership = PcoResource<SpeakershipSchema>;
/**
 * Attributes of {@link Speakership}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/publishing/versions/2024-03-25/vertices/speakership
 */
export type SpeakershipAttributes = SpeakershipSchema['attributes'];
