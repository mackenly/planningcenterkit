/**
 * Planning Center Giving API (`/giving/v2`).
 *
 * Generated from the Planning Center API documentation, version 2019-10-18, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Planning Center Giving: paths and capabilities only. */
export const givingGraph = {
    product: 'giving',
    slug: 'giving',
    basePath: '/giving/v2',
    version: '2019-10-18',
    rootVertex: 'organization',
    root: {
        batch_groups: { vertex: 'batch_group', many: true, canCreate: true },
        batches: { vertex: 'batch', many: true, canCreate: true },
        campuses: { vertex: 'campus', many: true, canCreate: false },
        donations: { vertex: 'donation', many: true, canCreate: false },
        donor_summaries: { vertex: 'donor_summary', many: true, canCreate: false },
        funds: { vertex: 'fund', many: true, canCreate: true },
        in_kind_donations: { vertex: 'in_kind_donation', many: true, canCreate: true },
        labels: { vertex: 'label', many: true, canCreate: true },
        payment_sources: { vertex: 'payment_source', many: true, canCreate: true },
        people: { vertex: 'person', many: true, canCreate: false },
        pledge_campaigns: { vertex: 'pledge_campaign', many: true, canCreate: true },
        recurring_donations: { vertex: 'recurring_donation', many: true, canCreate: false },
    },
    vertices: {
        batch: {
            type: 'Batch',
            edges: {
                batch_group: { vertex: 'batch_group', many: true, canCreate: false },
                donations: { vertex: 'donation', many: true, canCreate: true },
                owner: { vertex: 'person', many: true, canCreate: false },
            },
            actions: ['commit'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/batches',
        },
        batch_group: {
            type: 'BatchGroup',
            edges: {
                batches: { vertex: 'batch', many: true, canCreate: true },
                owner: { vertex: 'person', many: true, canCreate: false },
            },
            actions: ['commit'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/batch_groups',
        },
        campus: {
            type: 'Campus',
            edges: {
                donations: { vertex: 'donation', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/giving/v2/campuses',
        },
        designation: {
            type: 'Designation',
            edges: {
                fund: { vertex: 'fund', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        designation_refund: {
            type: 'DesignationRefund',
            edges: {
                designation: { vertex: 'designation', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        donation: {
            type: 'Donation',
            edges: {
                campus: { vertex: 'campus', many: true, canCreate: false },
                designations: { vertex: 'designation', many: true, canCreate: false },
                labels: { vertex: 'label', many: true, canCreate: false },
                note: { vertex: 'note', many: false, canCreate: true },
                refund: { vertex: 'refund', many: false, canCreate: false },
            },
            actions: ['issue_refund', 'mark_failed'],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/donations',
        },
        donor_summary: {
            type: 'DonorSummary',
            edges: {
                joint_giver: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        fund: {
            type: 'Fund',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/funds',
        },
        in_kind_donation: {
            type: 'InKindDonation',
            edges: {
                campus: { vertex: 'campus', many: true, canCreate: false },
                fund: { vertex: 'fund', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/in_kind_donations',
        },
        label: {
            type: 'Label',
            edges: {},
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/labels',
        },
        note: {
            type: 'Note',
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
        payment_method: {
            type: 'PaymentMethod',
            edges: {
                recurring_donations: { vertex: 'recurring_donation', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        payment_source: {
            type: 'PaymentSource',
            edges: {
                donations: { vertex: 'donation', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/payment_sources',
        },
        person: {
            type: 'Person',
            edges: {
                batch_groups: { vertex: 'batch_group', many: true, canCreate: false },
                batches: { vertex: 'batch', many: true, canCreate: false },
                donations: { vertex: 'donation', many: true, canCreate: false },
                in_kind_donations: { vertex: 'in_kind_donation', many: true, canCreate: false },
                payment_methods: { vertex: 'payment_method', many: true, canCreate: false },
                pledges: { vertex: 'pledge', many: true, canCreate: true },
                primary_campus: { vertex: 'campus', many: true, canCreate: false },
                recurring_donations: { vertex: 'recurring_donation', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: false,
            canonicalPath: '/giving/v2/people',
        },
        pledge: {
            type: 'Pledge',
            edges: {
                joint_giver: { vertex: 'person', many: true, canCreate: false },
                pledge_campaign: { vertex: 'pledge_campaign', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        pledge_campaign: {
            type: 'PledgeCampaign',
            edges: {
                fund: { vertex: 'fund', many: true, canCreate: false },
                pledges: { vertex: 'pledge', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
            canonicalPath: '/giving/v2/pledge_campaigns',
        },
        recurring_donation: {
            type: 'RecurringDonation',
            edges: {
                designations: { vertex: 'recurring_donation_designation', many: true, canCreate: false },
                payment_method: { vertex: 'payment_method', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/giving/v2/recurring_donations',
        },
        recurring_donation_designation: {
            type: 'RecurringDonationDesignation',
            edges: {
                fund: { vertex: 'fund', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        refund: {
            type: 'Refund',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Batch}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/batch
 */
export interface BatchSchema {
    type: 'Batch';
    attributes: {
        /**
         * The date and time that a batch was committed at. If it's `null`, the batch is still in progress or updating. Example: `2000-01-01T12:00:00Z`
         */
        committed_at: string | null;
        /**
         * The date and time at which a batch was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * A brief description of what a batch is for. This is displayed in Giving to help differentiate different batches from one another. If no description is provided for a batch, it will be referred to as `Untitled batch` within Giving.
         */
        description: string | null;
        /** Only available when requested with the `?fields` param */
        donations_count: number | null;
        /**
         * One of `in_progress`, `updating`, or `committed`. The `updating` state is temporary and describes a Batch that is currently being changed in some way (e.g. moving from `in_progress` to `committed`). Certain changes to Batches in this state (or their Donations) will be restricted until the Batch has finished updating.
         */
        status: string | null;
        /** The gross total of cents donated within the batch. */
        total_cents: number | null;
        /** The currency used to calculate `total_cents`. */
        total_currency: string | null;
        /**
         * The date and time at which a batch was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
    };
    relationships: 'batch_group';
    includes: 'batch_group' | 'owner';
    related: {
        batch_group: 'batch_group';
        owner: 'person';
    };
    where: {
        committed_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        committed_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'committed_at' | 'updated_at';
    create: {
        /**
         * A brief description of what a batch is for. This is displayed in Giving to help differentiate different batches from one another. If no description is provided for a batch, it will be referred to as `Untitled batch` within Giving.
         */
        description?: string | null;
    };
    update: {
        /**
         * A brief description of what a batch is for. This is displayed in Giving to help differentiate different batches from one another. If no description is provided for a batch, it will be referred to as `Untitled batch` within Giving.
         */
        description?: string | null;
    };
    delete: true;
    actions: 'commit';
    edges: {
        batch_group: { vertex: 'batch_group'; many: true; filters: never; create: false };
        donations: { vertex: 'donation'; many: true; filters: never; create: true };
        owner: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link BatchGroup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/batch_group
 */
export interface BatchGroupSchema {
    type: 'BatchGroup';
    attributes: {
        /** Returns `true` if a batch group has been committed, and `false` if it hasn't. */
        committed: boolean | null;
        /**
         * The date and time at which a batch group was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * A brief description of what a batch group is for. This is displayed in Giving to help differentiate different batch groups from one another. If no description is provided for a batch group, it will be referred to as `Untitled group` within Giving.
         */
        description: string | null;
        /**
         * One of `uncommitted`, `updating`, or `committed`. The `updating` state is temporary and describes a BatchGroup that is currently being changed in some way (e.g. moving from `uncommitted` to `committed`). Certain changes to BatchGroups in this state (or their Batches or Donations) will be restricted until the BatchGroup has finished updating.
         */
        status: string | null;
        /**
         * The gross total of cents donated within the batch group. Factors in all donations made to each batch within the group.
         */
        total_cents: number | null;
        /** The currency used to calculate `total_cents`. */
        total_currency: string | null;
        /**
         * The date and time at which a batch group was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'owner';
    related: {
        owner: 'person';
    };
    where: {
        description: string;
        updated_at: string | Date;
    };
    whereOps: {
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'updated_at';
    create: {
        /**
         * A brief description of what a batch group is for. This is displayed in Giving to help differentiate different batch groups from one another. If no description is provided for a batch group, it will be referred to as `Untitled group` within Giving.
         */
        description?: string | null;
    };
    update: {
        /**
         * A brief description of what a batch group is for. This is displayed in Giving to help differentiate different batch groups from one another. If no description is provided for a batch group, it will be referred to as `Untitled group` within Giving.
         */
        description?: string | null;
    };
    delete: true;
    actions: 'commit';
    edges: {
        batches: { vertex: 'batch'; many: true; filters: 'committed' | 'in_progress'; create: true };
        owner: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Campus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/campus
 */
export interface CampusSchema {
    type: 'Campus';
    attributes: {
        /**
         * The address for a campus. Campus descriptions can be set via Accounts or the People API.
         */
        address: Record<string, unknown> | null;
        /**
         * The name for a campus. Campus names can be set via Accounts or the People API.
         */
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
    edges: {
        donations: { vertex: 'donation'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Designation}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/designation
 */
export interface DesignationSchema {
    type: 'Designation';
    attributes: {
        /**
         * Required. The number of cents being donated to a designation's associated fund.
         */
        amount_cents: number | null;
        /**
         * The currency of `amount_cents`. Set to the currency of the associated organization.
         */
        amount_currency: string | null;
        /**
         * The fee amount distributed to a donation's designation in proportion to the amount of the designation. This should either be 0 or a negative integer.
         */
        fee_cents: number | null;
    };
    relationships: 'fund';
    includes: 'fund';
    related: {
        fund: 'fund';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        fund: { vertex: 'fund'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link DesignationRefund}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/designation_refund
 */
export interface DesignationRefundSchema {
    type: 'DesignationRefund';
    attributes: {
        /** The number of cents being refunded. */
        amount_cents: number | null;
        /** The currency of `amount_cents`. */
        amount_currency: string | null;
        fee_cents: number | null;
    };
    relationships: 'designation' | 'fund';
    includes: 'designation';
    related: {
        designation: 'designation';
        fund: 'fund';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        designation: { vertex: 'designation'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Donation}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/donation
 */
export interface DonationSchema {
    type: 'Donation';
    attributes: {
        /**
         * The number of cents being donated. Derived from the total of all of a donation's associated designation's `amount_cents` values.
         */
        amount_cents: number | null;
        /** The currency of `amount_cents`. Based on the organization's currency. */
        amount_currency: string | null;
        /**
         * The date and time at which a donation was completely processed. For card and ACH donations processed by Stripe, this is the moment when the donation was marked as fully processed by Stripe. For committed batch donations, this is the moment that the batch was committed. For uncommitted batch donations, this should return `null`. Example: `2000-01-01T12:00:00Z`
         */
        completed_at: string | null;
        /**
         * The date and time at which a donation was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * The fee to process a donation. This should either be 0 or a negative integer. For a donation processed by Giving via Stripe, this is the amount the associated organization paid Stripe to process it. For donations not processed by Stripe, this can be used to record fees from other systems. Note: while `amount_cents` is assigned via a donation's designations, `fee_cents` is set here, and used by Giving to distribute fees across all designations in proportion to the amount of each designation.
         */
        fee_cents: number | null;
        /**
         * A boolean indicating whether the donor chose to cover the Stripe processing fee for this donation.Note that `fee_covered` can only be true for donations processed through Stripe.
         */
        fee_covered: boolean | null;
        /** The currency of `fee_cents`. Based on the organization's currency. */
        fee_currency: string | null;
        /**
         * An optional short note donors can add to specify their gift intention (e.g. "In memory of..."). Only available when enabled by the church for specific funds.
         */
        memo: string | null;
        /**
         * For cards, this is the card brand (eg Visa, Mastercard, etc). For checks and bank accounts, this is the bank name. For cash donations, this should be `null`.
         */
        payment_brand: string | null;
        /**
         * The channel through which the donation was created.
         *
         *  Possible values: `api`, `sms`, `mobile_app`, `web`, `admin`, or `other`
         */
        payment_channel: string | null;
        /** The check date for donations made by check. Example: `2000-01-01` */
        payment_check_dated_at: string | null;
        /** The check number for donations made by check. */
        payment_check_number: number | null;
        /**
         * The last 4 digits of a donation's payment method number. For cards, this is the last 4 digits of the card number. For bank accounts, this is the last 4 digits of the bank account number. For cash and check donations, this should be `null`. Note: In cases where we don't have all 4 digits on file, a `*` will be used to pad the number. For example: `*321`
         */
        payment_last4: string | null;
        /**
         * Required. The payment method used to make a donation.
         *
         * Possible values: `ach`, `cash`, `check`, or `card`
         */
        payment_method: string | null;
        /**
         * For cards, this will be the card subtype. Will be `null` for other payment method types.
         *
         * Possible values: `credit`, `debit`, `prepaid`, or `unknown`
         */
        payment_method_sub: string | null;
        /**
         * For Stripe donations, this is the payment status. For batch donations, `pending` means that the donation has not yet been committed, whereas `succeeded` refers to a committed donation.
         *
         * Possible values: `pending`, `succeeded`, or `failed`
         */
        payment_status: string | null;
        /**
         * The date and time at which a donation was received. For card and ACH donations processed by Stripe, this is the moment when the donation was created in Giving. For batch donations, this is a customizable value that can be set via the Giving UI or API to any date. This allows for batch donations recieved on a previous day to be dated in the past, as well as for postdated checks to have a date in the future. It is important to ensure that this attribute is set accurately, as this is the date used to filter donations in the Giving admin UI. When creating new donations via the API, this attribute will default to the current date and time. Example: `2000-01-01T12:00:00Z`
         */
        received_at: string | null;
        /**
         * A boolean indicating whether this donation can be refunded via the API. Note that for some donations, this may be false, even though the donation _can_ be refunded in the UI.
         */
        refundable: boolean | null;
        /** Returns `true` if a donation has been refunded, or `false` if it hasn't. */
        refunded: boolean | null;
        /**
         * The date and time at which a donation was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
    };
    relationships:
        | 'batch'
        | 'campus'
        | 'labels'
        | 'payment_source'
        | 'person'
        | 'recurring_donation';
    includes: 'designations' | 'labels' | 'note' | 'refund';
    related: {
        batch: 'batch';
        campus: 'campus';
        designations: 'designation';
        labels: 'label';
        note: 'note';
        payment_source: 'payment_source';
        person: 'person';
        recurring_donation: 'recurring_donation';
        refund: 'refund';
    };
    where: {
        completed_at: string | Date;
        created_at: string | Date;
        payment_method: string;
        received_at: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        completed_at: 'gt' | 'gte' | 'lt' | 'lte';
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        received_at: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'completed_at' | 'created_at' | 'received_at' | 'updated_at';
    create: {
        campus_id?: string;
        /**
         * The fee to process a donation. This should either be 0 or a negative integer. For a donation processed by Giving via Stripe, this is the amount the associated organization paid Stripe to process it. For donations not processed by Stripe, this can be used to record fees from other systems. Note: while `amount_cents` is assigned via a donation's designations, `fee_cents` is set here, and used by Giving to distribute fees across all designations in proportion to the amount of each designation.
         */
        fee_cents?: number | null;
        /**
         * For cards, this is the card brand (eg Visa, Mastercard, etc). For checks and bank accounts, this is the bank name. For cash donations, this should be `null`.
         */
        payment_brand?: string | null;
        /** The check date for donations made by check. Example: `2000-01-01` */
        payment_check_dated_at?: string | null;
        /** The check number for donations made by check. */
        payment_check_number?: number | null;
        /**
         * The last 4 digits of a donation's payment method number. For cards, this is the last 4 digits of the card number. For bank accounts, this is the last 4 digits of the bank account number. For cash and check donations, this should be `null`. Note: In cases where we don't have all 4 digits on file, a `*` will be used to pad the number. For example: `*321`
         */
        payment_last4?: string | null;
        /**
         * Required. The payment method used to make a donation.
         *
         * Possible values: `ach`, `cash`, `check`, or `card`
         */
        payment_method?: string | null;
        /**
         * For cards, this will be the card subtype. Will be `null` for other payment method types.
         *
         * Possible values: `credit`, `debit`, `prepaid`, or `unknown`
         */
        payment_method_sub?: string | null;
        payment_source_id?: string;
        person_id?: string;
        /**
         * The date and time at which a donation was received. For card and ACH donations processed by Stripe, this is the moment when the donation was created in Giving. For batch donations, this is a customizable value that can be set via the Giving UI or API to any date. This allows for batch donations recieved on a previous day to be dated in the past, as well as for postdated checks to have a date in the future. It is important to ensure that this attribute is set accurately, as this is the date used to filter donations in the Giving admin UI. When creating new donations via the API, this attribute will default to the current date and time. Example: `2000-01-01T12:00:00Z`
         */
        received_at?: string | null;
    };
    update: {
        campus_id?: string;
        /**
         * The fee to process a donation. This should either be 0 or a negative integer. For a donation processed by Giving via Stripe, this is the amount the associated organization paid Stripe to process it. For donations not processed by Stripe, this can be used to record fees from other systems. Note: while `amount_cents` is assigned via a donation's designations, `fee_cents` is set here, and used by Giving to distribute fees across all designations in proportion to the amount of each designation.
         */
        fee_cents?: number | null;
        /**
         * For cards, this is the card brand (eg Visa, Mastercard, etc). For checks and bank accounts, this is the bank name. For cash donations, this should be `null`.
         */
        payment_brand?: string | null;
        /** The check date for donations made by check. Example: `2000-01-01` */
        payment_check_dated_at?: string | null;
        /** The check number for donations made by check. */
        payment_check_number?: number | null;
        /**
         * The last 4 digits of a donation's payment method number. For cards, this is the last 4 digits of the card number. For bank accounts, this is the last 4 digits of the bank account number. For cash and check donations, this should be `null`. Note: In cases where we don't have all 4 digits on file, a `*` will be used to pad the number. For example: `*321`
         */
        payment_last4?: string | null;
        /**
         * Required. The payment method used to make a donation.
         *
         * Possible values: `ach`, `cash`, `check`, or `card`
         */
        payment_method?: string | null;
        /**
         * For cards, this will be the card subtype. Will be `null` for other payment method types.
         *
         * Possible values: `credit`, `debit`, `prepaid`, or `unknown`
         */
        payment_method_sub?: string | null;
        payment_source_id?: string;
        person_id?: string;
        /**
         * The date and time at which a donation was received. For card and ACH donations processed by Stripe, this is the moment when the donation was created in Giving. For batch donations, this is a customizable value that can be set via the Giving UI or API to any date. This allows for batch donations recieved on a previous day to be dated in the past, as well as for postdated checks to have a date in the future. It is important to ensure that this attribute is set accurately, as this is the date used to filter donations in the Giving admin UI. When creating new donations via the API, this attribute will default to the current date and time. Example: `2000-01-01T12:00:00Z`
         */
        received_at?: string | null;
    };
    delete: true;
    actions: 'issue_refund' | 'mark_failed';
    edges: {
        campus: { vertex: 'campus'; many: true; filters: never; create: false };
        designations: { vertex: 'designation'; many: true; filters: never; create: false };
        labels: { vertex: 'label'; many: true; filters: never; create: false };
        note: { vertex: 'note'; many: false; filters: never; create: true };
        refund: { vertex: 'refund'; many: false; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link DonorSummary}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/donor_summary
 */
export interface DonorSummarySchema {
    type: 'DonorSummary';
    attributes: {
        /**
         * The number of donations this donor made over the requested date range, including refunded and failed donations.
         */
        donation_count: number | null;
        /**
         * The donor number for the person, if donor numbers are visible for this organization.
         */
        donor_number: string | null;
        /**
         * Timestamp of the donor's first donation ever (lifetime, not scoped to the requested date range).
         */
        first_donated: string | null;
        /** The donor's full name. */
        name: string | null;
        /**
         * The total received donation amount (in the currency's smallest unit) for this donor over the requested date range.
         */
        total_received_donation_amount_cents: number | null;
        /** The ISO currency code for the total (the organization's currency). */
        total_received_donation_amount_currency: string | null;
    };
    relationships: never;
    includes: 'joint_giver';
    related: {
        joint_giver: 'person';
    };
    where: {
        campus_id: string;
        person_id: string;
        received_at: string | Date;
    };
    whereOps: {
        received_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'donation_count' | 'first_donated' | 'name' | 'total_received_donation_amount_cents';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        joint_giver: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Fund}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/fund
 */
export interface FundSchema {
    type: 'Fund';
    attributes: {
        /**
         * The hex color code that is used to help differentiate the fund from others in Giving, as determined by `color_identifier`.
         */
        color: string | null;
        /**
         * The date and time at which a fund was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * This attribute is set to `true` if a fund is the associated organization's default fund, or `false` if it isn't. More information on default funds can be found in our product documentation: https://help.planningcenter.com/en/138385-create-and-manage-funds.html
         */
        default: boolean | null;
        /**
         * Boolean that tells if you if the fund can be deleted or not. Read more in our product documentation: https://help.planningcenter.com/en/138385-create-and-manage-funds.html
         */
        deletable: boolean | null;
        /**
         * A short description that describes how the money given to the fund will be used. 255 characters maximum.
         */
        description: string | null;
        /**
         * If an organization's general ledger software tracks funds by code, this attribute can be used to store the fund's code for reference.
         */
        ledger_code: string | null;
        /**
         * Required. The name for a fund. Must be unique within the associated organization.
         */
        name: string | null;
        /** A URL-friendly identifier for a fund, derived from the fund name. */
        slug: string | null;
        /**
         * The date and time at which a fund was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
        /**
         * Required. Controls how a fund is visible on Church Center. `everywhere` will allow anyone to donate to the fund on Church Center. `admin_only` will hide the fund on Church Center, allowing only permitted Giving Users to designate donations to it. `nowhere` will prevent donations from being designated to the fund altogether, while still displaying fund data in historical reports. `hidden` will hide the fund from the list of funds in the default Church Center donation form, but allow donors to give to it via direct link, or through Text-to-Give.
         *
         * Possible values: `everywhere`, `admin_only`, `nowhere`, or `hidden`
         */
        visibility: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        default: boolean;
        id: string;
        name: string;
        visibility: string;
    };
    whereOps: {};
    order: never;
    create: {
        /**
         * A short description that describes how the money given to the fund will be used. 255 characters maximum.
         */
        description?: string | null;
        /**
         * If an organization's general ledger software tracks funds by code, this attribute can be used to store the fund's code for reference.
         */
        ledger_code?: string | null;
        /**
         * Required. The name for a fund. Must be unique within the associated organization.
         */
        name?: string | null;
        /**
         * Required. Controls how a fund is visible on Church Center. `everywhere` will allow anyone to donate to the fund on Church Center. `admin_only` will hide the fund on Church Center, allowing only permitted Giving Users to designate donations to it. `nowhere` will prevent donations from being designated to the fund altogether, while still displaying fund data in historical reports. `hidden` will hide the fund from the list of funds in the default Church Center donation form, but allow donors to give to it via direct link, or through Text-to-Give.
         *
         * Possible values: `everywhere`, `admin_only`, `nowhere`, or `hidden`
         */
        visibility?: string | null;
    };
    update: {
        /**
         * A short description that describes how the money given to the fund will be used. 255 characters maximum.
         */
        description?: string | null;
        /**
         * If an organization's general ledger software tracks funds by code, this attribute can be used to store the fund's code for reference.
         */
        ledger_code?: string | null;
        /**
         * Required. The name for a fund. Must be unique within the associated organization.
         */
        name?: string | null;
        /**
         * Required. Controls how a fund is visible on Church Center. `everywhere` will allow anyone to donate to the fund on Church Center. `admin_only` will hide the fund on Church Center, allowing only permitted Giving Users to designate donations to it. `nowhere` will prevent donations from being designated to the fund altogether, while still displaying fund data in historical reports. `hidden` will hide the fund from the list of funds in the default Church Center donation form, but allow donors to give to it via direct link, or through Text-to-Give.
         *
         * Possible values: `everywhere`, `admin_only`, `nowhere`, or `hidden`
         */
        visibility?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link InKindDonation}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/in_kind_donation
 */
export interface InKindDonationSchema {
    type: 'InKindDonation';
    attributes: {
        /**
         * The timestamp of when the acknowledgment letter was last sent for this in-kind donation. This value is set automatically and cannot be manually changed.
         */
        acknowledgment_last_sent_at: string | null;
        /**
         * The date and time at which an in-kind donation was created.
         *
         * Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * Required. Brief description of an in-kind donation gift.
         *
         * Example: `2019 Toyota Corolla (used)`
         */
        description: string | null;
        /**
         * Optional. Records whether any goods or services were exchanged for an in-kind donation.
         *
         * Example: `In exchange, a charity event ticket for $100 was provided.`
         */
        exchange_details: string | null;
        /**
         * Optional. The fair market value of an in-kind donation in cents. Must be greater than $0 and less than or equal to $21,000,000.
         */
        fair_market_value_cents: number | null;
        fair_market_value_currency: string | null;
        /**
         * Required. The date an in-kind donation was received.
         *
         * Format: `YYYY-MM-DD` (e.g. `2025-04-09`).
         */
        received_on: string | null;
        /**
         * The date and time at which an in-kind donation was last updated.
         *
         * Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
        /**
         * Optional. The fair market for an in-kind donation which should be determined by donors and appraisers. Maximum 255 characters. Example: `Appraised by Bob Johnson CPA (123 Easy Street, Carlsbad CA 92008)`
         */
        valuation_details: string | null;
    };
    relationships: 'campus' | 'fund' | 'person';
    includes: 'campus' | 'fund' | 'person';
    related: {
        campus: 'campus';
        fund: 'fund';
        person: 'person';
    };
    where: {
        campus_id: string | number;
        created_at: string | Date;
        fund_id: string | number;
        received_on: string | Date;
        updated_at: string | Date;
    };
    whereOps: {
        created_at: 'gt' | 'gte' | 'lt' | 'lte';
        received_on: 'gt' | 'gte' | 'lt' | 'lte';
        updated_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'created_at' | 'received_on' | 'updated_at';
    create: {
        campus_id?: string;
        /**
         * Required. Brief description of an in-kind donation gift.
         *
         * Example: `2019 Toyota Corolla (used)`
         */
        description?: string | null;
        /**
         * Optional. Records whether any goods or services were exchanged for an in-kind donation.
         *
         * Example: `In exchange, a charity event ticket for $100 was provided.`
         */
        exchange_details?: string | null;
        /**
         * Optional. The fair market value of an in-kind donation in cents. Must be greater than $0 and less than or equal to $21,000,000.
         */
        fair_market_value_cents?: number | null;
        fair_market_value_currency?: string | null;
        fund_id?: string;
        person_id?: string;
        /**
         * Required. The date an in-kind donation was received.
         *
         * Format: `YYYY-MM-DD` (e.g. `2025-04-09`).
         */
        received_on?: string | null;
        /**
         * Optional. The fair market for an in-kind donation which should be determined by donors and appraisers. Maximum 255 characters. Example: `Appraised by Bob Johnson CPA (123 Easy Street, Carlsbad CA 92008)`
         */
        valuation_details?: string | null;
    };
    update: {
        campus_id?: string;
        /**
         * Required. Brief description of an in-kind donation gift.
         *
         * Example: `2019 Toyota Corolla (used)`
         */
        description?: string | null;
        /**
         * Optional. Records whether any goods or services were exchanged for an in-kind donation.
         *
         * Example: `In exchange, a charity event ticket for $100 was provided.`
         */
        exchange_details?: string | null;
        /**
         * Optional. The fair market value of an in-kind donation in cents. Must be greater than $0 and less than or equal to $21,000,000.
         */
        fair_market_value_cents?: number | null;
        fair_market_value_currency?: string | null;
        fund_id?: string;
        person_id?: string;
        /**
         * Required. The date an in-kind donation was received.
         *
         * Format: `YYYY-MM-DD` (e.g. `2025-04-09`).
         */
        received_on?: string | null;
        /**
         * Optional. The fair market for an in-kind donation which should be determined by donors and appraisers. Maximum 255 characters. Example: `Appraised by Bob Johnson CPA (123 Easy Street, Carlsbad CA 92008)`
         */
        valuation_details?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        campus: { vertex: 'campus'; many: true; filters: never; create: false };
        fund: { vertex: 'fund'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Label}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/label
 */
export interface LabelSchema {
    type: 'Label';
    attributes: {
        /**
         * The label text itself. Made up solely of lowercase letters, numbers, and dashes. When creating or updating a label, the string you provide will be formatted automatically. For example: `My awesome label!` will be saved as `my-awesome-label`
         */
        slug: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {
        slug: string;
    };
    whereOps: {};
    order: never;
    create: {
        /**
         * The label text itself. Made up solely of lowercase letters, numbers, and dashes. When creating or updating a label, the string you provide will be formatted automatically. For example: `My awesome label!` will be saved as `my-awesome-label`
         */
        slug?: string | null;
    };
    update: {
        /**
         * The label text itself. Made up solely of lowercase letters, numbers, and dashes. When creating or updating a label, the string you provide will be formatted automatically. For example: `My awesome label!` will be saved as `my-awesome-label`
         */
        slug?: string | null;
    };
    delete: true;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Note}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/note
 */
export interface NoteSchema {
    type: 'Note';
    attributes: {
        body: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {
        body?: string | null;
    };
    update: {};
    delete: false;
    actions: never;
    edges: {};
}

/**
 * Type-level schema of {@link Organization}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        /** The name for an organization. */
        name: string | null;
        /**
         * `true` if this organization is accepting Text2Give donations, `false` otherwise.
         */
        text2give_enabled: boolean | null;
        /** The time zone for an organization. */
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
 * Type-level schema of {@link PaymentMethod}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/payment_method
 */
export interface PaymentMethodSchema {
    type: 'PaymentMethod';
    attributes: {
        /**
         * For cards, this is the card brand (eg Visa, Mastercard, etc). For bank accounts, this is the bank name.
         */
        brand: string | null;
        /**
         * The date and time at which a payment method was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * For cards only. String representation of the expiration date in the `MM/YYYY` form (without leading zeros). Will be `null` for bank accounts.
         */
        expiration: string | null;
        /**
         * The last 4 digits of the payment method's number. For cards, this is the last 4 digits of the card number. For bank accounts, this is the last 4 digits of the bank account number. Note: In cases where we don't have all 4 digits on file, a `*` will be used to pad the number. For example: `*321`
         */
        last4: string | null;
        /**
         * For cards, either `credit`, `debit`, `prepaid`, or `unknown`. For bank accounts, either `checking` or `savings`.
         */
        method_subtype: string | null;
        /**
         * Determines whether or not the payment method is a card or bank account.
         *
         * Possible values: `card`, `us_bank_account`, or `au_becs_debit`
         */
        method_type: string | null;
        /**
         * The date and time at which a payment method was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
        /** For bank accounts only. Will be `null` for cards. */
        verified: boolean | null;
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
        recurring_donations: { vertex: 'recurring_donation'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PaymentSource}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/payment_source
 */
export interface PaymentSourceSchema {
    type: 'PaymentSource';
    attributes: {
        /**
         * The date and time at which a payment source was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * Required. The name of a payment source. Must be unique within the associated organization.
         */
        name: string | null;
        /**
         * The status of the payment source. Can be either `active` or `archived`. `active` payment sources can be assigned to donations, while `archived` payment sources cannot. Payment sources are `active` by default upon creation. Archiving a payment source will keep all historical records intact and can be undone.
         *
         * Possible values: `active` or `archived`
         */
        status: string | null;
        /**
         * The date and time at which a payment source was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
    };
    relationships: never;
    includes: never;
    related: {};
    where: {};
    whereOps: {};
    order: never;
    create: {
        /**
         * Required. The name of a payment source. Must be unique within the associated organization.
         */
        name?: string | null;
        payment_source_type?: unknown;
        /**
         * The status of the payment source. Can be either `active` or `archived`. `active` payment sources can be assigned to donations, while `archived` payment sources cannot. Payment sources are `active` by default upon creation. Archiving a payment source will keep all historical records intact and can be undone.
         *
         * Possible values: `active` or `archived`
         */
        status?: string | null;
    };
    update: {
        /**
         * Required. The name of a payment source. Must be unique within the associated organization.
         */
        name?: string | null;
        payment_source_type?: unknown;
        /**
         * The status of the payment source. Can be either `active` or `archived`. `active` payment sources can be assigned to donations, while `archived` payment sources cannot. Payment sources are `active` by default upon creation. Archiving a payment source will keep all historical records intact and can be undone.
         *
         * Possible values: `active` or `archived`
         */
        status?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        donations: { vertex: 'donation'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Person}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        /**
         * An array of addresses for a person. Can be managed via People. Example:
         * ```
         *   [
         *     {
         *       "street_line_1": "2790 Gateway Rd",
         *       "street_line_2": "",
         *       "city": "Carlsbad",
         *       "state": "CA",
         *       "zip": "92009",
         *       "location": "Home",
         *       "primary": true,
         *       "street": "2790 Gateway Rd",
         *       "line_1": "2790 Gateway Rd",
         *       "line_2": "Carlsbad, CA 92009"
         *     }
         *   ]
         * ```
         */
        addresses: unknown[] | null;
        /**
         * The donor number for a person, if applicable. See our product documentation for more information on [donor numbers](https://help.planningcenter.com/en/138370-donor-numbers.html#138370-donor-numbers).
         */
        donor_number: number | null;
        /**
         * An array of email addresses for a person. Can be managed via People. Example:
         * ```
         *   [
         *     {
         *       "address": "support@planningcenter.com",
         *       "location": "Home",
         *       "blocked": false,
         *       "primary": true
         *     }
         *   ]
         * ```
         */
        email_addresses: unknown[] | null;
        /** Timestamp of a person's first donation or `null` if they have never donated. */
        first_donated_at: string | null;
        /** A person's first name. */
        first_name: string | null;
        /** A person's last name. */
        last_name: string | null;
        /**
         * The level of Giving access granted to a person. See our product documentation for more information on [permissions in Giving](https://help.planningcenter.com/en/140716-permissions-in-giving.html).
         *
         * Possible values: `administrator`, `reviewer`, `counter`, or `bookkeeper`
         */
        permissions: string | null;
        /**
         * An array of phone numbers for a person. Can be managed via People. Example:
         * ```
         *   [
         *     {
         *       "number": "(123) 456-7890",
         *       "carrier": "PC Mobile",
         *       "location": "Mobile",
         *       "primary": true
         *     }
         *   ]
         * ```
         */
        phone_numbers: unknown[] | null;
    };
    relationships: 'primary_campus';
    includes: never;
    related: {
        primary_campus: 'campus';
    };
    where: {
        first_name: string;
        last_name: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {
        /**
         * The donor number for a person, if applicable. See our product documentation for more information on [donor numbers](https://help.planningcenter.com/en/138370-donor-numbers.html#138370-donor-numbers).
         */
        donor_number?: number | null;
    };
    delete: false;
    actions: never;
    edges: {
        batch_groups: { vertex: 'batch_group'; many: true; filters: 'committed' | 'in_progress'; create: false };
        batches: { vertex: 'batch'; many: true; filters: 'committed' | 'in_progress'; create: false };
        donations: { vertex: 'donation'; many: true; filters: never; create: false };
        in_kind_donations: { vertex: 'in_kind_donation'; many: true; filters: never; create: false };
        payment_methods: { vertex: 'payment_method'; many: true; filters: never; create: false };
        pledges: { vertex: 'pledge'; many: true; filters: never; create: true };
        primary_campus: { vertex: 'campus'; many: true; filters: never; create: false };
        recurring_donations: { vertex: 'recurring_donation'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Pledge}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/pledge
 */
export interface PledgeSchema {
    type: 'Pledge';
    attributes: {
        /** The amount pledged */
        amount_cents: number | null;
        amount_currency: string | null;
        created_at: string | null;
        /** The amount donated */
        donated_total_cents: number | null;
        /** The amount pledged by the joint giver, if in a joint giving unit */
        joint_giver_amount_cents: number | null;
        /** The amount donated by the joint giver, if in a joint giving unit */
        joint_giver_donated_total_cents: number | null;
        updated_at: string | null;
    };
    relationships: 'person' | 'pledge_campaign';
    includes: 'joint_giver' | 'pledge_campaign';
    related: {
        joint_giver: 'person';
        person: 'person';
        pledge_campaign: 'pledge_campaign';
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
        /** The amount pledged */
        amount_cents?: number | null;
        person_id?: string;
        pledge_campaign_id?: string;
    };
    update: {
        /** The amount pledged */
        amount_cents?: number | null;
    };
    delete: true;
    actions: never;
    edges: {
        joint_giver: { vertex: 'person'; many: true; filters: never; create: false };
        pledge_campaign: { vertex: 'pledge_campaign'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link PledgeCampaign}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/pledge_campaign
 */
export interface PledgeCampaignSchema {
    type: 'PledgeCampaign';
    attributes: {
        created_at: string | null;
        description: string | null;
        ends_at: string | null;
        /**
         * Optional. During the donation period of this campaign, the running total of donations will be tracked against this number
         */
        goal_cents: number | null;
        goal_currency: string | null;
        name: string | null;
        received_total_from_pledges_cents: number | null;
        received_total_outside_of_pledges_cents: number | null;
        /**
         * In addition to seeing their personal pledge progress within their donor profile, this option allows donors to see the the collective progress towards the campaign’s overall goal (if set).
         */
        show_goal_in_church_center: boolean | null;
        starts_at: string | null;
        updated_at: string | null;
    };
    relationships: 'fund';
    includes: 'fund';
    related: {
        fund: 'fund';
    };
    where: {
        ends_at: string | Date;
        fund_id: string | number;
        starts_at: string | Date;
    };
    whereOps: {
        ends_at: 'gt' | 'gte' | 'lt' | 'lte';
        starts_at: 'gt' | 'gte' | 'lt' | 'lte';
    };
    order: 'ends_at' | 'starts_at';
    create: {
        description?: string | null;
        ends_at?: string | null;
        fund_id?: string;
        /**
         * Optional. During the donation period of this campaign, the running total of donations will be tracked against this number
         */
        goal_cents?: number | null;
        name?: string | null;
        /**
         * In addition to seeing their personal pledge progress within their donor profile, this option allows donors to see the the collective progress towards the campaign’s overall goal (if set).
         */
        show_goal_in_church_center?: boolean | null;
        starts_at?: string | null;
    };
    update: {
        description?: string | null;
        ends_at?: string | null;
        fund_id?: string;
        /**
         * Optional. During the donation period of this campaign, the running total of donations will be tracked against this number
         */
        goal_cents?: number | null;
        name?: string | null;
        /**
         * In addition to seeing their personal pledge progress within their donor profile, this option allows donors to see the the collective progress towards the campaign’s overall goal (if set).
         */
        show_goal_in_church_center?: boolean | null;
        starts_at?: string | null;
    };
    delete: true;
    actions: never;
    edges: {
        fund: { vertex: 'fund'; many: true; filters: never; create: false };
        pledges: { vertex: 'pledge'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link RecurringDonation}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/recurring_donation
 */
export interface RecurringDonationSchema {
    type: 'RecurringDonation';
    attributes: {
        /** The number of cents scheduled to be donated. */
        amount_cents: number | null;
        /** The currency of `amount_cents`. */
        amount_currency: string | null;
        /**
         * The date and time at which a recurring donation was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /**
         * The date and time that the last donation was made for a recurring donation. Example: `2000-01-01T12:00:00Z`
         */
        last_donation_received_at: string | null;
        /**
         * The date that the next donation will be made for a recurring donation. Example: `2000-01-01T12:00:00Z`
         */
        next_occurrence: string | null;
        /**
         * The date when the hold on a recurring donation with a status of `temporary_hold` will be released.
         */
        release_hold_at: string | null;
        /**
         * JSON representation of the billing schedule. See the repeatable Ruby gem for more details on the structure and meaning: https://github.com/molawson/repeatable#time-expressions
         */
        schedule: Record<string, unknown> | null;
        /**
         * Determines if a recurring donation is active or on hold, and if on hold, the kind of hold that has been placed on it.
         *
         * Possible values: `active`, `indefinite_hold` or `temporary_hold`.
         */
        status: string | null;
        /**
         * The date and time at which a recurring donation was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
    };
    relationships: 'person';
    includes: 'designations';
    related: {
        designations: 'recurring_donation_designation';
        person: 'person';
    };
    where: {
        fund_id: string;
        status: string;
    };
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        designations: { vertex: 'recurring_donation_designation'; many: true; filters: never; create: false };
        payment_method: { vertex: 'payment_method'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link RecurringDonationDesignation}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/recurring_donation_designation
 */
export interface RecurringDonationDesignationSchema {
    type: 'RecurringDonationDesignation';
    attributes: {
        /**
         * Required. The number of cents that will be donated to a recurring donation designation's associated fund.
         */
        amount_cents: number | null;
        /**
         * The currency of `amount_cents`. Set to the currency of the associated organization.
         */
        amount_currency: string | null;
    };
    relationships: 'fund';
    includes: 'fund';
    related: {
        fund: 'fund';
    };
    where: {};
    whereOps: {};
    order: never;
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        fund: { vertex: 'fund'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Refund}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/refund
 */
export interface RefundSchema {
    type: 'Refund';
    attributes: {
        /** The number of cents being refunded. */
        amount_cents: number | null;
        /** The currency of `amount_cents`. */
        amount_currency: string | null;
        /**
         * The date and time at which a refund was created. Example: `2000-01-01T12:00:00Z`
         */
        created_at: string | null;
        /** The payment processing fee returned by Stripe, if any. */
        fee_cents: number | null;
        /** The currency of `fee_cents`. */
        fee_currency: string | null;
        /**
         * The date and time at which a refund was processed. Example: `2000-01-01T12:00:00Z`
         */
        refunded_at: string | null;
        /**
         * The date and time at which a refund was last updated. Example: `2000-01-01T12:00:00Z`
         */
        updated_at: string | null;
    };
    relationships: never;
    includes: 'designation_refunds';
    related: {
        designation_refunds: 'designation_refund';
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

/** Type-level schema of every Planning Center Giving resource, keyed by vertex id. */
export type GivingSchema = {
    batch: BatchSchema;
    batch_group: BatchGroupSchema;
    campus: CampusSchema;
    designation: DesignationSchema;
    designation_refund: DesignationRefundSchema;
    donation: DonationSchema;
    donor_summary: DonorSummarySchema;
    fund: FundSchema;
    in_kind_donation: InKindDonationSchema;
    label: LabelSchema;
    note: NoteSchema;
    organization: OrganizationSchema;
    payment_method: PaymentMethodSchema;
    payment_source: PaymentSourceSchema;
    person: PersonSchema;
    pledge: PledgeSchema;
    pledge_campaign: PledgeCampaignSchema;
    recurring_donation: RecurringDonationSchema;
    recurring_donation_designation: RecurringDonationDesignationSchema;
    refund: RefundSchema;
};

/** Edges available from the product root (`/giving/v2`). */
export type GivingRoot = {
    batch_groups: { vertex: 'batch_group'; many: true; filters: 'committed' | 'in_progress'; create: true };
    batches: { vertex: 'batch'; many: true; filters: 'committed' | 'in_progress'; create: true };
    campuses: { vertex: 'campus'; many: true; filters: never; create: false };
    donations: { vertex: 'donation'; many: true; filters: 'succeeded'; create: false };
    donor_summaries: { vertex: 'donor_summary'; many: true; filters: 'has_joint_giver'; create: false };
    funds: { vertex: 'fund'; many: true; filters: never; create: true };
    in_kind_donations: { vertex: 'in_kind_donation'; many: true; filters: never; create: true };
    labels: { vertex: 'label'; many: true; filters: never; create: true };
    payment_sources: { vertex: 'payment_source'; many: true; filters: never; create: true };
    people: { vertex: 'person'; many: true; filters: 'has_donated'; create: false };
    pledge_campaigns: { vertex: 'pledge_campaign'; many: true; filters: never; create: true };
    recurring_donations: { vertex: 'recurring_donation'; many: true; filters: never; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<GivingSchema>, AssertRoot<GivingRoot>];

/**
 * A `Batch` is a collection of `Donation`s. When creating `Donation`'s via the API, you're required to put them in a `Batch`.
 *
 * When a `Batch` is first created, it's in the `in_progress` or "uncommitted" state. You can freely add/remove/modify `Donation`s in this `Batch` and they won't show up in a donor's donation history online, they won't appear in any donor statements issued by the Giving admin, and changes to these donations are not flagged in the system log. Think of it as a staging area for donations.
 *
 * When a `Batch` is committed (see more in the Actions section), all of the `Donation`s within it are also marked as "committed". At that point, they're visible to donors in their online history, and any further edits made to those `Donation`s are logged and visible to Giving admins.
 *
 * With all of that in mind, you can use `Batch`es in one of two ways:
 *
 *   1.  Create an uncommitted `Batch`, add `Donation`s to it, then commit the `Batch`.
 *   2.  Create a `Batch` with a least one donation, commit it, then add more `Donation`s to it.
 *
 * In both cases, the end result is the same. The main difference is that option #2 does not provide you/other admins the opportunity to fix any mistakes before changes are logged and `Donation`s are made visible to donors. Any `Donation`s added to a committed `Batch` will automatically be committed as well. Note, batches can't be committed until they have at least one donation.
 *
 * Whichever route you decide to take, it's helpful to make use of the `Batch`'s description to help differentiate these groupings from each other and from other `Batch`es that the Giving admins might be creating on their own.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/batch
 */
export type Batch = PcoResource<BatchSchema>;
/**
 * Attributes of {@link Batch}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/batch
 */
export type BatchAttributes = BatchSchema['attributes'];

/**
 * A `BatchGroup` is a collection of `Batch`es.
 *
 * `BatchGroup`s are an optional way of organizing your `Batch`es into groups that share common characteristics. These are completely customizable and can be used in whatever way makes sense to your organization's workflow.
 *
 * Similarly to `Batch`es, you can `commit` (see more in the Actions section) a `BatchGroup`, and by doing so, all `Batches` and `Donations` contained in the `BatchGroup` will also be committed.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/batch_group
 */
export type BatchGroup = PcoResource<BatchGroupSchema>;
/**
 * Attributes of {@link BatchGroup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/batch_group
 */
export type BatchGroupAttributes = BatchGroupSchema['attributes'];

/**
 * A `Campus` that has been added to your `Organization`.
 *
 * `Campus`es can be especially useful in filtering `Donation`s across the various locations of your `Organization`.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/campus
 */
export type Campus = PcoResource<CampusSchema>;
/**
 * Attributes of {@link Campus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/campus
 */
export type CampusAttributes = CampusSchema['attributes'];

/**
 * A `Designation` conveys how much of a `Donation` goes to a particular `Fund`.
 *
 * `Designation` details are required when creating a `Donation`. If all of a `Donation` is going to a single `Fund`, it will only have one `Designation`. Similarly, to split a `Donation` between multiple `Fund`s, you can use multiple `Designation`s.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/designation
 */
export type Designation = PcoResource<DesignationSchema>;
/**
 * Attributes of {@link Designation}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/designation
 */
export type DesignationAttributes = DesignationSchema['attributes'];

/**
 * A record that links a `Refund` with a `Designation`
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/designation_refund
 */
export type DesignationRefund = PcoResource<DesignationRefundSchema>;
/**
 * Attributes of {@link DesignationRefund}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/designation_refund
 */
export type DesignationRefundAttributes = DesignationRefundSchema['attributes'];

/**
 * A `Donation` record corresponds to a gift given to an `Organization` at a particular point in time.
 *
 * `Donation`s are added by first associating them to a `Batch` of donations, and then committing the `Batch`. When adding a `Donation` to an already-committed `Batch`, the `Donation` will automatically be committed as well, and immediately added to the donor's online history.
 *
 * #### Totals
 *
 * On donation collection endpoints, pass `?with_totals=true` to add the received total to the response `meta`. It respects any `where[...]` filters and is unaffected by pagination. Totals are not available when filtering by `fund_id`.
 *
 * - `received_total_amount_cents`: the total received, excluding refunded and failed donations.
 * - `currency`: the currency of the totals above, based on the organization's currency.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/donation
 */
export type Donation = PcoResource<DonationSchema>;
/**
 * Attributes of {@link Donation}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/donation
 */
export type DonationAttributes = DonationSchema['attributes'];

/**
 * A donor and their aggregate giving to an `Organization` (name, donor number, total received, donation count, and first gift date), summed over a requested date range, defaulting to the last 30 days.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/donor_summary
 */
export type DonorSummary = PcoResource<DonorSummarySchema>;
/**
 * Attributes of {@link DonorSummary}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/donor_summary
 */
export type DonorSummaryAttributes = DonorSummarySchema['attributes'];

/**
 * A `Fund` is a way of tracking the intent of `Donation`.
 *
 * All `Organization`s have a default `Fund` (usually named "General"), and creating additional `Fund`s allows donors to allocate their gift to a particular cause/effort.
 *
 * You can query for the default `Fund` using the `default` param:
 * ```
 * GET https://api.planningcenteronline.com/giving/v2/funds?where[default]=true
 * ```
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/fund
 */
export type Fund = PcoResource<FundSchema>;
/**
 * Attributes of {@link Fund}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/fund
 */
export type FundAttributes = FundSchema['attributes'];

/**
 * An `InKindDonation` record represents a non-cash gift given to an `Organization` at a specific time.
 *
 * These include items like furniture, vehicles, services, or stocks. `InKindDonations` do not trigger
 * acknowledgment letter emails via the API — these must be sent from the Giving Admin UI.
 *
 * [More info](https://help.planningcenter.com/en/138390-in-kind-donations.html)
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/in_kind_donation
 */
export type InKindDonation = PcoResource<InKindDonationSchema>;
/**
 * Attributes of {@link InKindDonation}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/in_kind_donation
 */
export type InKindDonationAttributes = InKindDonationSchema['attributes'];

/**
 * A `Label` is a way for Admins to manage and categorize `Donation`s.
 *
 * Multiple `Label`s can be added for each `Donation`, and these will only be displayed in the Giving admin interface, so donors never see them.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/label
 */
export type Label = PcoResource<LabelSchema>;
/**
 * Attributes of {@link Label}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/label
 */
export type LabelAttributes = LabelSchema['attributes'];

/**
 * A `Note` is a way for Giving Admins and Bookkeepers to communicate internally about a donation.
 * Notes are only visible in the Giving admin interface, not shown to donors. Each `Donation` can only
 * have a single note associated with it.
 *
 * To record notes from donors, consider using the [memo line feature](https://help.planningcenter.com/en/143011-manage-your-online-donation-form.html#UUID-0949cfc8-d262-e23a-0635-fa100ae331ba_section-id235309330415896-how-do-memo-lines-work-) instead.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/note
 */
export type Note = PcoResource<NoteSchema>;
/**
 * Attributes of {@link Note}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/note
 */
export type NoteAttributes = NoteSchema['attributes'];

/**
 * The root level `Organization` record which serves as a link to `Donation`s, `People`, `Fund`s, etc.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * Stored `PaymentMethod` information (`card` or `bank_account`) used by donors to make online `Donation`s.
 *
 * `PaymentMethod` data is for informational purposes only and cannot be used to create charges through the API.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/payment_method
 */
export type PaymentMethod = PcoResource<PaymentMethodSchema>;
/**
 * Attributes of {@link PaymentMethod}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/payment_method
 */
export type PaymentMethodAttributes = PaymentMethodSchema['attributes'];

/**
 * A donation's `PaymentSource` refers to the platform it originated from.
 *
 * `Donation`s made through Giving will be assigned the built-in `PaymentSource` "Planning Center". `Donation`s made through external platforms (Square, Pushpay, ect.) can be assigned a `PaymentSource` identifying them as such.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/payment_source
 */
export type PaymentSource = PcoResource<PaymentSourceSchema>;
/**
 * Attributes of {@link PaymentSource}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/payment_source
 */
export type PaymentSourceAttributes = PaymentSourceSchema['attributes'];

/**
 * A Planning Center `Person` record that has been added to Giving.
 *
 * The `Person` object in Planning Center is so crucial that we have an entire product dedicated to managing, keeping track of, editing, and creating these records and metadata around them. For additional info, take a look at the [Planning Center People API Docs](https://developer.planning.center/docs/#/apps/people).
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A `Pledge` made by a `Person` toward a particular `PledgeCampaign`.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/pledge
 */
export type Pledge = PcoResource<PledgeSchema>;
/**
 * Attributes of {@link Pledge}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/pledge
 */
export type PledgeAttributes = PledgeSchema['attributes'];

/**
 * A `PledgeCampaign` is a way to request and track long-terms commitments to a particular goal or project.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/pledge_campaign
 */
export type PledgeCampaign = PcoResource<PledgeCampaignSchema>;
/**
 * Attributes of {@link PledgeCampaign}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/pledge_campaign
 */
export type PledgeCampaignAttributes = PledgeCampaignSchema['attributes'];

/**
 * A `RecurringDonation` is represents a `Donation` that repeats on a set schedule (weekly, monthly, etc.)
 *
 * Data for `RecurringDonation`s is read-only; they can not be created or edited through the API.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/recurring_donation
 */
export type RecurringDonation = PcoResource<RecurringDonationSchema>;
/**
 * Attributes of {@link RecurringDonation}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/recurring_donation
 */
export type RecurringDonationAttributes = RecurringDonationSchema['attributes'];

/**
 * Much like a `Designation`, A `RecurringDonationDesignation` conveys how much of a `RecurringDonation` goes to a particular `Fund`.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/recurring_donation_designation
 */
export type RecurringDonationDesignation = PcoResource<RecurringDonationDesignationSchema>;
/**
 * Attributes of {@link RecurringDonationDesignation}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/recurring_donation_designation
 */
export type RecurringDonationDesignationAttributes = RecurringDonationDesignationSchema['attributes'];

/**
 * A `Refund` record holds information pertaining to a refunded `Donation`.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/refund
 */
export type Refund = PcoResource<RefundSchema>;
/**
 * Attributes of {@link Refund}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/giving/versions/2019-10-18/vertices/refund
 */
export type RefundAttributes = RefundSchema['attributes'];
