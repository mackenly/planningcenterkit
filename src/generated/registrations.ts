/**
 * Registrations API (`/registrations/v2`).
 *
 * Generated from the Planning Center API documentation, version 2025-05-01, by
 * scripts/generate.ts. Do not edit: run `npm run spec:fetch && npm run generate`.
 *
 * @module
 */
import type { ProductGraph, ProductSchema, RootSchema } from '../core/graph.js';
import type { PcoResource } from '../core/jsonapi.js';

/** Runtime metadata for Registrations: paths and capabilities only. */
export const registrationsGraph = {
    product: 'registrations',
    slug: 'registrations',
    basePath: '/registrations/v2',
    version: '2025-05-01',
    rootVertex: 'organization',
    root: {
        attendees: { vertex: 'attendee', many: true, canCreate: false },
        campuses: { vertex: 'campus', many: true, canCreate: false },
        categories: { vertex: 'category', many: true, canCreate: false },
        people: { vertex: 'person', many: true, canCreate: false },
        registrations: { vertex: 'registration', many: true, canCreate: false },
        signups: { vertex: 'signup', many: true, canCreate: false },
    },
    vertices: {
        attendee: {
            type: 'Attendee',
            edges: {
                emergency_contact: { vertex: 'emergency_contact', many: true, canCreate: false },
                person: { vertex: 'person', many: true, canCreate: false },
                registration: { vertex: 'registration', many: true, canCreate: false },
                selection_type: { vertex: 'selection_type', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/registrations/v2/attendees',
        },
        campus: {
            type: 'Campus',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/registrations/v2/campuses',
        },
        category: {
            type: 'Category',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/registrations/v2/categories',
        },
        emergency_contact: {
            type: 'EmergencyContact',
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
            canonicalPath: '/registrations/v2/people',
        },
        registration: {
            type: 'Registration',
            edges: {
                created_by: { vertex: 'person', many: true, canCreate: false },
                registrant_contact: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/registrations/v2/registrations',
        },
        selection_type: {
            type: 'SelectionType',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        signup: {
            type: 'Signup',
            edges: {
                attendees: { vertex: 'attendee', many: true, canCreate: false },
                campuses: { vertex: 'campus', many: true, canCreate: false },
                categories: { vertex: 'category', many: true, canCreate: false },
                next_signup_time: { vertex: 'signup_time', many: true, canCreate: false },
                registrations: { vertex: 'registration', many: true, canCreate: false },
                selection_types: { vertex: 'selection_type', many: true, canCreate: false },
                signup_location: { vertex: 'signup_location', many: true, canCreate: false },
                signup_times: { vertex: 'signup_time', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
            canonicalPath: '/registrations/v2/signups',
        },
        signup_location: {
            type: 'SignupLocation',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        signup_time: {
            type: 'SignupTime',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
    },
} as const satisfies ProductGraph;

/**
 * Type-level schema of {@link Attendee}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/attendee
 */
export interface AttendeeSchema {
    type: 'Attendee';
    attributes: {
        /** Whether or not the attendee is active. */
        active: boolean | null;
        /** Whether or not the attendee is canceled. */
        canceled: boolean | null;
        /**
         * Whether or not attendee has completed all necessary items (personal information, questions, forms, add ons).
         *
         *
         * Only available when requested with the `?fields` param
         */
        complete: boolean | null;
        created_at: string | null;
        /**
         * The attendee's name. Derived from the associated person record.
         *
         *
         * Only available when requested with the `?fields` param
         */
        name: string | null;
        updated_at: string | null;
        /** Whether or not the attendee is waitlisted. */
        waitlisted: boolean | null;
        /** UTC time at which the attendee was waitlisted. */
        waitlisted_at: string | null;
    };
    relationships: never;
    includes: 'emergency_contact' | 'person' | 'registration' | 'selection_type';
    related: {
        emergency_contact: 'emergency_contact';
        person: 'person';
        registration: 'registration';
        selection_type: 'selection_type';
    };
    where: {};
    whereOps: {};
    order: 'created_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        emergency_contact: { vertex: 'emergency_contact'; many: true; filters: never; create: false };
        person: { vertex: 'person'; many: true; filters: never; create: false };
        registration: { vertex: 'registration'; many: true; filters: never; create: false };
        selection_type: { vertex: 'selection_type'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link Campus}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/campus
 */
export interface CampusSchema {
    type: 'Campus';
    attributes: {
        /** City where the campus is located. */
        city: string | null;
        /** Country where the campus is located. */
        country: string | null;
        created_at: string | null;
        full_formatted_address: string | null;
        /** Name of the campus. */
        name: string | null;
        /** State or province where the campus is located. */
        state: string | null;
        /** Street address of the campus. */
        street: string | null;
        updated_at: string | null;
        /** Zip code of the campus. */
        zip: string | null;
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
 * Type-level schema of {@link Category}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/category
 */
export interface CategorySchema {
    type: 'Category';
    attributes: {
        created_at: string | null;
        /** Name of the category. */
        name: string | null;
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
 * Type-level schema of {@link EmergencyContact}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/emergency_contact
 */
export interface EmergencyContactSchema {
    type: 'EmergencyContact';
    attributes: {
        name: string | null;
        /** Phone number of the emergency contact person. */
        phone_number: string | null;
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
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/organization
 */
export interface OrganizationSchema {
    type: 'Organization';
    attributes: {
        created_at: string | null;
        /** Name of the Organization. */
        name: string | null;
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
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/person
 */
export interface PersonSchema {
    type: 'Person';
    attributes: {
        can_search: boolean | null;
        first_name: string | null;
        last_name: string | null;
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
 * Type-level schema of {@link Registration}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/registration
 */
export interface RegistrationSchema {
    type: 'Registration';
    attributes: {
        created_at: string | null;
        /**
         * The registration's total cost after discounts, formatted with the signup's
         * currency symbol (for example `"$120.00"`). `null` for a free registration.
         * Accounts for discounts and every attendee on the registration.
         */
        total_cost: string | null;
        /**
         * The registration's total cost after discounts, in cents. `0` for a free
         * registration. Accounts for discounts and every attendee on the registration.
         */
        total_cost_cents: number | null;
        /**
         * The registration's outstanding balance, formatted with the signup's currency
         * symbol (for example `"$120.00"`). Accounts for discounts and every attendee
         * on the registration.
         */
        total_due: string | null;
        /**
         * The registration's outstanding balance in cents. Accounts for discounts and
         * every attendee on the registration.
         */
        total_due_cents: number | null;
        /**
         * The total amount paid toward the registration, formatted with the signup's
         * currency symbol (for example `"$120.00"`).
         */
        total_paid: string | null;
        /** The total amount paid toward the registration, in cents. */
        total_paid_cents: number | null;
        updated_at: string | null;
    };
    relationships: never;
    includes: 'created_by' | 'registrant_contact';
    related: {
        created_by: 'person';
        registrant_contact: 'person';
    };
    where: {};
    whereOps: {};
    order: 'created_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        created_by: { vertex: 'person'; many: true; filters: never; create: false };
        registrant_contact: { vertex: 'person'; many: true; filters: never; create: false };
    };
}

/**
 * Type-level schema of {@link SelectionType}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/selection_type
 */
export interface SelectionTypeSchema {
    type: 'SelectionType';
    attributes: {
        /**
         * Whether the selection type has reached its maximum capacity.
         *
         *
         * Only available when requested with the `?fields` param
         */
        at_maximum_capacity: boolean | null;
        /**
         * Remaining spots for this selection type (`maximum_capacity` minus active
         * registrations). `null` when there is no capacity limit.
         *
         *
         * Only available when requested with the `?fields` param
         */
        available_capacity: number | null;
        created_at: string | null;
        /**
         * Maximum number of attendees this selection type can hold. `null` when there
         * is no capacity limit.
         */
        maximum_capacity: number | null;
        /** Name of the selection type. */
        name: string | null;
        /** Price of selection type in cents. */
        price_cents: number | null;
        /**
         * Signup currency code, example `"USD"`.
         *
         *
         * Only available when requested with the `?fields` param
         */
        price_currency: string | null;
        /**
         * Signup currency symbol, example `"$"`.
         *
         *
         * Only available when requested with the `?fields` param
         */
        price_currency_symbol: string | null;
        /**
         * Price of selection type with currency formatting (symbol not included).
         *
         *
         * Only available when requested with the `?fields` param
         */
        price_formatted: string | null;
        /** Whether or not the selection type is available to the public. */
        publicly_available: boolean | null;
        updated_at: string | null;
        /** Whether the selection type offers a waitlist once it is full. */
        waitlist: boolean | null;
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
 * Type-level schema of {@link Signup}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup
 */
export interface SignupSchema {
    type: 'Signup';
    attributes: {
        /** Whether the signup is archived or not. */
        archived: boolean | null;
        /**
         * Whether the signup has reached its signup-level maximum capacity.
         *
         *
         * Only available when requested with the `?fields` param
         */
        at_maximum_capacity: boolean | null;
        /** UTC time at which regsitration closes. */
        close_at: string | null;
        /**
         * Whether the signup is currently closed to new registrations. A signup is
         * closed when it is archived, has no `open_at`, has an `open_at` in the
         * future, or has a `close_at` in the past.
         */
        closed: boolean | null;
        created_at: string | null;
        /** Decription of the signup. */
        description: string | null;
        /** URL for the image used for the signup. */
        logo_url: string | null;
        /**
         * Maximum number of attendees this signup can hold across all selection types.
         * `null` when there is no signup-level capacity limit.
         */
        maximum_capacity: number | null;
        /** Name of the signup. */
        name: string | null;
        /** URL to allow people to register for signup. */
        new_registration_url: string | null;
        /**
         * Whether the signup is currently open to new registrations. Inverse of
         * `closed`.
         */
        open: boolean | null;
        /** UTC time at which regsitration opens. */
        open_at: string | null;
        updated_at: string | null;
    };
    relationships: never;
    includes:
        | 'campuses'
        | 'categories'
        | 'next_signup_time'
        | 'selection_types'
        | 'signup_location'
        | 'signup_times';
    related: {
        campuses: 'campus';
        categories: 'category';
        next_signup_time: 'signup_time';
        selection_types: 'selection_type';
        signup_location: 'signup_location';
        signup_times: 'signup_time';
    };
    where: {
        id: string;
        name: string;
    };
    whereOps: {};
    order: 'created_at' | 'updated_at';
    create: {};
    update: {};
    delete: false;
    actions: never;
    edges: {
        attendees: { vertex: 'attendee'; many: true; filters: 'active' | 'canceled' | 'waitlist'; create: false };
        campuses: { vertex: 'campus'; many: true; filters: never; create: false };
        categories: { vertex: 'category'; many: true; filters: never; create: false };
        next_signup_time: { vertex: 'signup_time'; many: true; filters: never; create: false };
        registrations: { vertex: 'registration'; many: true; filters: never; create: false };
        selection_types: { vertex: 'selection_type'; many: true; filters: 'publicly_available'; create: false };
        signup_location: { vertex: 'signup_location'; many: true; filters: never; create: false };
        signup_times: { vertex: 'signup_time'; many: true; filters: 'future' | 'past'; create: false };
    };
}

/**
 * Type-level schema of {@link SignupLocation}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup_location
 */
export interface SignupLocationSchema {
    type: 'SignupLocation';
    attributes: {
        /**
         * The address data of the signup location, which includes details like street, city, state, and postal code.
         *
         *
         * Only available when requested with the `?fields` param
         */
        address_data: Record<string, unknown> | null;
        created_at: string | null;
        /**
         * The formatted address of the signup location, which may not include subpremise details.
         */
        formatted_address: string | null;
        /**
         * The fully formatted address of the signup location, including subpremise details.
         */
        full_formatted_address: string | null;
        /** The latitude of the signup location. */
        latitude: string | null;
        /** The type of location, such as `address`, `coords`, or `online`. */
        location_type: string | null;
        /** The longitude of the signup location. */
        longitude: string | null;
        /** The name of the signup location. */
        name: string | null;
        /** The subpremise of the signup location, such as an building or room number. */
        subpremise: string | null;
        updated_at: string | null;
        /** The URL for the signup location, if applicable (e.g., for online events). */
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
 * Type-level schema of {@link SignupTime}: attributes, query options, writable fields, and edges.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup_time
 */
export interface SignupTimeSchema {
    type: 'SignupTime';
    attributes: {
        /** Whether or not the signup time is all day. */
        all_day: boolean | null;
        created_at: string | null;
        /** End date and time of signup time. */
        ends_at: string | null;
        /** Start date and time of signup time. */
        starts_at: string | null;
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

/** Type-level schema of every Registrations resource, keyed by vertex id. */
export type RegistrationsSchema = {
    attendee: AttendeeSchema;
    campus: CampusSchema;
    category: CategorySchema;
    emergency_contact: EmergencyContactSchema;
    organization: OrganizationSchema;
    person: PersonSchema;
    registration: RegistrationSchema;
    selection_type: SelectionTypeSchema;
    signup: SignupSchema;
    signup_location: SignupLocationSchema;
    signup_time: SignupTimeSchema;
};

/** Edges available from the product root (`/registrations/v2`). */
export type RegistrationsRoot = {
    attendees: { vertex: 'attendee'; many: true; filters: never; create: false };
    campuses: { vertex: 'campus'; many: true; filters: never; create: false };
    categories: { vertex: 'category'; many: true; filters: never; create: false };
    people: { vertex: 'person'; many: true; filters: never; create: false };
    registrations: { vertex: 'registration'; many: true; filters: never; create: false };
    signups: { vertex: 'signup'; many: true; filters: 'archived' | 'unarchived'; create: false };
};

type AssertSchema<T extends ProductSchema> = T;
type AssertRoot<T extends RootSchema> = T;
type SchemaCheck = [AssertSchema<RegistrationsSchema>, AssertRoot<RegistrationsRoot>];

/**
 * An `Attendee` is a person registered for a signup.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/attendee
 */
export type Attendee = PcoResource<AttendeeSchema>;
/**
 * Attributes of {@link Attendee}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/attendee
 */
export type AttendeeAttributes = AttendeeSchema['attributes'];

/**
 * A `Campus` is a location belonging to an Organization.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/campus
 */
export type Campus = PcoResource<CampusSchema>;
/**
 * Attributes of {@link Campus}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/campus
 */
export type CampusAttributes = CampusSchema['attributes'];

/**
 * A `Category` is a label used to group together and find signups more easily.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/category
 */
export type Category = PcoResource<CategorySchema>;
/**
 * Attributes of {@link Category}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/category
 */
export type CategoryAttributes = CategorySchema['attributes'];

/**
 * `Emergency_Contact` is the person assigned as the emergency contact for an attendee.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/emergency_contact
 */
export type EmergencyContact = PcoResource<EmergencyContactSchema>;
/**
 * Attributes of {@link EmergencyContact}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/emergency_contact
 */
export type EmergencyContactAttributes = EmergencyContactSchema['attributes'];

/**
 * The root level `Organization` record which serves as a link to `Signup`s.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/organization
 */
export type Organization = PcoResource<OrganizationSchema>;
/**
 * Attributes of {@link Organization}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/organization
 */
export type OrganizationAttributes = OrganizationSchema['attributes'];

/**
 * A Person resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/person
 */
export type Person = PcoResource<PersonSchema>;
/**
 * Attributes of {@link Person}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/person
 */
export type PersonAttributes = PersonSchema['attributes'];

/**
 * A Registration resource.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/registration
 */
export type Registration = PcoResource<RegistrationSchema>;
/**
 * Attributes of {@link Registration}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/registration
 */
export type RegistrationAttributes = RegistrationSchema['attributes'];

/**
 * `Selection_Types` are used to present the options people register for in a signup.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/selection_type
 */
export type SelectionType = PcoResource<SelectionTypeSchema>;
/**
 * Attributes of {@link SelectionType}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/selection_type
 */
export type SelectionTypeAttributes = SelectionTypeSchema['attributes'];

/**
 * A `Signup` is an organization signup that people can register for.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup
 */
export type Signup = PcoResource<SignupSchema>;
/**
 * Attributes of {@link Signup}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup
 */
export type SignupAttributes = SignupSchema['attributes'];

/**
 * `Signup_location` is the location of a signup.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup_location
 */
export type SignupLocation = PcoResource<SignupLocationSchema>;
/**
 * Attributes of {@link SignupLocation}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup_location
 */
export type SignupLocationAttributes = SignupLocationSchema['attributes'];

/**
 * `Signup_time`s are associated with a signup, which can have multiple signup times.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup_time
 */
export type SignupTime = PcoResource<SignupTimeSchema>;
/**
 * Attributes of {@link SignupTime}.
 *
 * @see https://api.planningcenteronline.com/docs/apps/registrations/versions/2025-05-01/vertices/signup_time
 */
export type SignupTimeAttributes = SignupTimeSchema['attributes'];
