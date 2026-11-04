import type { ProductName } from './core/graph.js';
import { createTransport, type TransportOptions } from './core/http.js';
import { createProductClient, type ProductClient } from './core/product.js';
import type { PcoRequest, PcoTransport, UploadedFile, UploadOptions } from './core/transport.js';
import { apiGraph, type ApiRoot, type ApiSchema } from './generated/api.js';
import { calendarGraph, type CalendarRoot, type CalendarSchema } from './generated/calendar.js';
import { checkInsGraph, type CheckInsRoot, type CheckInsSchema } from './generated/check-ins.js';
import { currentGraph, type CurrentRoot, type CurrentSchema } from './generated/current.js';
import { givingGraph, type GivingRoot, type GivingSchema } from './generated/giving.js';
import { groupsGraph, type GroupsRoot, type GroupsSchema } from './generated/groups.js';
import { peopleGraph, type PeopleRoot, type PeopleSchema } from './generated/people.js';
import { publishingGraph, type PublishingRoot, type PublishingSchema } from './generated/publishing.js';
import { registrationsGraph, type RegistrationsRoot, type RegistrationsSchema } from './generated/registrations.js';
import { servicesGraph, type ServicesRoot, type ServicesSchema } from './generated/services.js';
import { webhooksGraph, type WebhooksRoot, type WebhooksSchema } from './generated/webhooks.js';

/**
 * API versions to send per product, as `YYYY-MM-DD` (or `'LATEST'`).
 *
 * By default each product is pinned to the version this package's types were generated from,
 * so responses always match the types. Override only if you need a different version, and note
 * the types won't follow.
 *
 * @see https://api.planningcenteronline.com/docs/overview/versioning
 */
export type ApiVersions = Partial<Record<ProductName, string>>;

/** Options for {@link PlanningCenter}: transport options plus per-product API versions. */
export interface PlanningCenterOptions extends TransportOptions {
    /** Per-product API version overrides. */
    versions?: ApiVersions;
}

/** Use an existing transport (e.g. a shared one, or a mock in tests) instead of creating one. */
export interface PlanningCenterTransportOptions {
    transport: PcoTransport;
    versions?: ApiVersions;
}

/**
 * The Planning Center API client. One property per product, each generated from Planning
 * Center's API documentation, plus raw `request()` and `uploadFile()`.
 *
 * Product clients are created on first use, and all share one transport, so authentication,
 * rate limiting, and retries are coordinated across products.
 *
 * @example
 * ```ts
 * import { PlanningCenter } from '@mackenly/planningcenterkit';
 *
 * const pco = new PlanningCenter({
 *     auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! },
 * });
 *
 * const { data } = await pco.people.people
 *     .where('created_at', 'gte', '2026-01-01')
 *     .include('emails')
 *     .order('-created_at')
 *     .list();
 *
 * for await (const plan of pco.services.service_types.id('1').plans.filter('future').all()) {
 *     console.log(plan.attributes.title);
 * }
 * ```
 */
export class PlanningCenter {
    /** The underlying transport. Use it to share auth/rate limiting with your own code. */
    readonly transport: PcoTransport;
    readonly #versions: ApiVersions;
    readonly #clients = new Map<ProductName, unknown>();

    constructor(options: PlanningCenterOptions | PlanningCenterTransportOptions) {
        if ('transport' in options) {
            this.transport = options.transport;
            this.#versions = { ...options.versions };
        } else {
            const { versions, ...transportOptions } = options;
            this.transport = createTransport(transportOptions);
            this.#versions = { ...versions };
        }
    }

    /**
     * Planning Center API: OAuth applications, personal access tokens, connected applications.
     * @see https://api.planningcenteronline.com/docs/apps/api
     */
    get api(): ProductClient<ApiSchema, ApiRoot> {
        return this.#product('api', () => createProductClient<ApiSchema, ApiRoot>(apiGraph, this.transport, this.#options('api')));
    }

    /**
     * Calendar: events, resources, rooms, approvals.
     * @see https://api.planningcenteronline.com/docs/apps/calendar
     */
    get calendar(): ProductClient<CalendarSchema, CalendarRoot> {
        return this.#product('calendar', () =>
            createProductClient<CalendarSchema, CalendarRoot>(calendarGraph, this.transport, this.#options('calendar')),
        );
    }

    /**
     * Check-Ins: events, check-ins, locations, stations, labels.
     * @see https://api.planningcenteronline.com/docs/apps/check-ins
     */
    get checkIns(): ProductClient<CheckInsSchema, CheckInsRoot> {
        return this.#product('checkIns', () =>
            createProductClient<CheckInsSchema, CheckInsRoot>(checkInsGraph, this.transport, this.#options('checkIns')),
        );
    }

    /**
     * Current (legacy donations product).
     * @see https://api.planningcenteronline.com/docs/apps/current
     */
    get current(): ProductClient<CurrentSchema, CurrentRoot> {
        return this.#product('current', () =>
            createProductClient<CurrentSchema, CurrentRoot>(currentGraph, this.transport, this.#options('current')),
        );
    }

    /**
     * Giving: donations, funds, batches, pledges, recurring donations.
     * @see https://api.planningcenteronline.com/docs/apps/giving
     */
    get giving(): ProductClient<GivingSchema, GivingRoot> {
        return this.#product('giving', () =>
            createProductClient<GivingSchema, GivingRoot>(givingGraph, this.transport, this.#options('giving')),
        );
    }

    /**
     * Groups: groups, memberships, events, attendance, tags.
     * @see https://api.planningcenteronline.com/docs/apps/groups
     */
    get groups(): ProductClient<GroupsSchema, GroupsRoot> {
        return this.#product('groups', () =>
            createProductClient<GroupsSchema, GroupsRoot>(groupsGraph, this.transport, this.#options('groups')),
        );
    }

    /**
     * People: people, households, lists, forms, workflows, notes, field data.
     * @see https://api.planningcenteronline.com/docs/apps/people
     */
    get people(): ProductClient<PeopleSchema, PeopleRoot> {
        return this.#product('people', () =>
            createProductClient<PeopleSchema, PeopleRoot>(peopleGraph, this.transport, this.#options('people')),
        );
    }

    /**
     * Publishing: channels, episodes, series, speakers.
     * @see https://api.planningcenteronline.com/docs/apps/publishing
     */
    get publishing(): ProductClient<PublishingSchema, PublishingRoot> {
        return this.#product('publishing', () =>
            createProductClient<PublishingSchema, PublishingRoot>(publishingGraph, this.transport, this.#options('publishing')),
        );
    }

    /**
     * Registrations: signups, attendees, registrations, selection types.
     * @see https://api.planningcenteronline.com/docs/apps/registrations
     */
    get registrations(): ProductClient<RegistrationsSchema, RegistrationsRoot> {
        return this.#product('registrations', () =>
            createProductClient<RegistrationsSchema, RegistrationsRoot>(
                registrationsGraph,
                this.transport,
                this.#options('registrations'),
            ),
        );
    }

    /**
     * Services: service types, plans, items, songs, arrangements, teams, schedules.
     * @see https://api.planningcenteronline.com/docs/apps/services
     */
    get services(): ProductClient<ServicesSchema, ServicesRoot> {
        return this.#product('services', () =>
            createProductClient<ServicesSchema, ServicesRoot>(servicesGraph, this.transport, this.#options('services')),
        );
    }

    /**
     * Webhooks: subscriptions, available events, deliveries. To receive webhooks, see
     * `@mackenly/planningcenterkit/webhooks`.
     * @see https://api.planningcenteronline.com/docs/apps/webhooks
     */
    get webhooks(): ProductClient<WebhooksSchema, WebhooksRoot> {
        return this.#product('webhooks', () =>
            createProductClient<WebhooksSchema, WebhooksRoot>(webhooksGraph, this.transport, this.#options('webhooks')),
        );
    }

    /**
     * Sends any request, authenticated, rate limited, and retried like every other call. Use it
     * for endpoints or parameters the typed clients don't cover.
     *
     * @example
     * ```ts
     * const me = await pco.request<JsonApiDocument>({ method: 'GET', path: '/people/v2/me' });
     * ```
     */
    request<T = unknown>(request: PcoRequest): Promise<T> {
        return this.transport.request<T>(request);
    }

    /**
     * Uploads a file and returns its UUID, which you then pass to an attribute that accepts files.
     *
     * @example
     * ```ts
     * const file = await pco.uploadFile(await fs.readFile('avatar.png'), { filename: 'avatar.png' });
     * await pco.people.people.id('123').update({ avatar: file.id });
     * ```
     * @see https://api.planningcenteronline.com/docs/overview/file-uploads
     */
    uploadFile(file: Blob | ArrayBuffer | Uint8Array, options?: UploadOptions): Promise<UploadedFile> {
        return this.transport.upload(file, options);
    }

    #options(product: ProductName): { version?: string } {
        const version = this.#versions[product];
        return version ? { version } : {};
    }

    #product<T>(name: ProductName, create: () => T): T {
        let client = this.#clients.get(name) as T | undefined;
        if (!client) {
            client = create();
            this.#clients.set(name, client);
        }
        return client;
    }
}
