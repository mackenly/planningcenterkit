/**
 * A small hand-written product graph + schema shaped like the generated ones, used to test the
 * query/product runtime without depending on src/generated.
 */
import type { ProductGraph } from '../../src/core/graph.js';
import type { PcoRequest, PcoTransport } from '../../src/core/transport.js';

export const fixtureGraph = {
    product: 'people',
    slug: 'people',
    basePath: '/people/v2',
    version: '2025-11-10',
    rootVertex: 'organization',
    root: {
        people: { vertex: 'person', many: true, canCreate: true },
        emails: { vertex: 'email', many: true, canCreate: false },
        campuses: { vertex: 'campus', many: true, canCreate: true },
        get: { vertex: 'email', many: true, canCreate: false },
    },
    vertices: {
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
                emails: { vertex: 'email', many: true, canCreate: true },
                households: { vertex: 'household', many: true, canCreate: false },
                primary_campus: { vertex: 'campus', many: false, canCreate: false },
                // Collides with a reserved method name; only reachable through edge().
                update: { vertex: 'email', many: true, canCreate: false },
                then: { vertex: 'email', many: true, canCreate: false },
            },
            actions: ['merge'],
            canUpdate: true,
            canDelete: true,
        },
        email: {
            type: 'Email',
            edges: {
                person: { vertex: 'person', many: false, canCreate: false },
            },
            actions: [],
            canUpdate: true,
            canDelete: true,
        },
        household: {
            type: 'Household',
            edges: {
                people: { vertex: 'person', many: true, canCreate: false },
            },
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
        campus: {
            type: 'Campus',
            edges: {},
            actions: [],
            canUpdate: false,
            canDelete: false,
        },
    },
} as const satisfies ProductGraph;

export type FixtureSchema = {
    organization: {
        type: 'Organization';
        attributes: { name: string | null };
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
    };
    person: {
        type: 'Person';
        attributes: {
            first_name: string | null;
            last_name: string | null;
            nickname: string | null;
            status: 'active' | 'inactive' | null;
            child: boolean | null;
            created_at: string;
        };
        relationships: 'emails' | 'primary_campus' | 'households';
        includes: 'emails' | 'primary_campus' | 'households';
        related: { emails: 'email'; primary_campus: 'campus'; households: 'household' };
        where: {
            first_name: string;
            status: 'active' | 'inactive';
            child: boolean;
            created_at: string;
            remote_id: number;
        };
        whereOps: { created_at: 'gt' | 'gte' | 'lt' | 'lte'; remote_id: 'gt' | 'lt' };
        order: 'first_name' | 'last_name' | 'created_at';
        create: { first_name?: string; last_name?: string; status?: 'active' | 'inactive' };
        update: { first_name?: string; last_name?: string; nickname?: string };
        delete: true;
        actions: 'merge';
        edges: {
            emails: { vertex: 'email'; many: true; filters: never; create: true };
            households: { vertex: 'household'; many: true; filters: 'active' | 'primary'; create: false };
            primary_campus: { vertex: 'campus'; many: false; filters: never; create: false };
            update: { vertex: 'email'; many: true; filters: never; create: false };
            then: { vertex: 'email'; many: true; filters: never; create: false };
        };
    };
    email: {
        type: 'Email';
        attributes: { address: string | null; location: string | null; primary: boolean };
        relationships: 'person';
        includes: never;
        related: { person: 'person' };
        where: { address: string; primary: boolean };
        whereOps: {};
        order: 'address';
        create: { address?: string; location?: string; primary?: boolean };
        update: { address?: string; location?: string; primary?: boolean };
        delete: true;
        actions: never;
        edges: {
            person: { vertex: 'person'; many: false; filters: never; create: false };
        };
    };
    household: {
        type: 'Household';
        attributes: { name: string | null; member_count: number };
        relationships: 'people';
        includes: 'people';
        related: { people: 'person' };
        where: { name: string };
        whereOps: {};
        order: 'name';
        create: {};
        update: {};
        delete: false;
        actions: never;
        edges: {
            people: { vertex: 'person'; many: true; filters: never; create: false };
        };
    };
    campus: {
        type: 'Campus';
        attributes: { name: string | null };
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
    };
};

export type FixtureRoot = {
    people: { vertex: 'person'; many: true; filters: 'admins' | 'organization_admins'; create: true };
    emails: { vertex: 'email'; many: true; filters: never; create: false };
    campuses: { vertex: 'campus'; many: true; filters: never; create: true };
    get: { vertex: 'email'; many: true; filters: never; create: false };
};

/** A transport that records requests and answers from a queue (or a handler). */
export function mockTransport(handler?: (req: PcoRequest) => unknown) {
    const requests: PcoRequest[] = [];
    const queue: unknown[] = [];
    const transport: PcoTransport = {
        async request<T>(req: PcoRequest): Promise<T> {
            requests.push(req);
            if (queue.length) return queue.shift() as T;
            return (handler ? handler(req) : { data: [], meta: {} }) as T;
        },
        async upload() {
            throw new Error('not used');
        },
    };
    return {
        transport,
        requests,
        /** Queues response bodies, returned in order. */
        respond(...bodies: unknown[]) {
            queue.push(...bodies);
        },
        /** The most recent request. */
        last(): PcoRequest {
            const req = requests[requests.length - 1];
            if (!req) throw new Error('no requests');
            return req;
        },
    };
}
