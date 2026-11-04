/**
 * Read-only live tests against a real Planning Center organization.
 *
 * Credentials come from PCO_TEST_CLIENT_ID / PCO_TEST_SECRET (a personal access token's
 * application ID and secret) and are never logged: errors and summaries only include URLs.
 * Nothing here creates, updates, or deletes data.
 */
import { describe, expect, it } from 'vitest';
import {
    PcoApiError,
    PcoAuthenticationError,
    PcoForbiddenError,
    PcoNotFoundError,
    PlanningCenter,
    productGraphs,
    type ProductName,
} from '../../src/index.js';

const applicationId = process.env.PCO_TEST_CLIENT_ID;
const secret = process.env.PCO_TEST_SECRET;
const enabled = Boolean(applicationId && secret);

const pco = enabled ? new PlanningCenter({ auth: { applicationId: applicationId!, secret: secret! } }) : undefined!;

interface Probe {
    path: string;
    outcome: 'ok' | 'no access' | 'not found' | 'error';
    detail?: string;
}

/** Calls `fn`, classifying the result so one product the org doesn't use doesn't fail the run. */
async function probe(path: string, fn: () => Promise<{ data: unknown }>, expectMany: boolean): Promise<Probe> {
    try {
        const { data } = await fn();
        if (expectMany && !Array.isArray(data)) return { path, outcome: 'error', detail: 'expected an array of resources' };
        return { path, outcome: 'ok' };
    } catch (error) {
        // 401/403: the organization doesn't use this product or the user lacks permission.
        if (error instanceof PcoForbiddenError || error instanceof PcoAuthenticationError) return { path, outcome: 'no access' };
        if (error instanceof PcoNotFoundError) return { path, outcome: 'not found', detail: error.message };
        if (error instanceof PcoApiError) return { path, outcome: 'error', detail: `${error.status}: ${error.message}` };
        return { path, outcome: 'error', detail: String(error) };
    }
}

function summarize(title: string, probes: Probe[]): void {
    const counts = probes.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.outcome]: (acc[p.outcome] ?? 0) + 1 }), {});
    console.info(`${title}: ${JSON.stringify(counts)}`);
    for (const p of probes.filter((p) => p.outcome !== 'ok' && p.outcome !== 'no access')) {
        console.info(`  ${p.outcome}: ${p.path} ${p.detail ?? ''}`);
    }
}

describe.skipIf(!enabled)('live: Planning Center API', () => {
    it('fetches the authenticated person', async () => {
        const { data } = await pco.people.me.get();
        expect(data?.type).toBe('Person');
        expect(typeof data?.id).toBe('string');
    });

    it('lists people with where, include, order, and related()', async () => {
        const page = await pco.people.people
            .where('created_at', 'gte', new Date('2000-01-01'))
            .include('emails')
            .order('-created_at')
            .perPage(2)
            .list();
        expect(Array.isArray(page.data)).toBe(true);
        expect(page.data.length).toBeLessThanOrEqual(2);
        for (const person of page.data) {
            expect(person.type).toBe('Person');
            expect(Array.isArray(page.related(person, 'emails'))).toBe(true);
        }
        expect(typeof page.totalCount).toBe('number');
    });

    it('paginates across pages without repeating resources', async () => {
        const people = await pco.people.people.perPage(1).toArray({ max: 3 });
        expect(people.length).toBeLessThanOrEqual(3);
        expect(new Set(people.map((p) => p.id)).size).toBe(people.length);
    });

    it('counts and fetches by id', async () => {
        const total = await pco.people.people.count();
        expect(total).toBeGreaterThan(0);
        const first = await pco.people.people.first();
        const { data } = await pco.people.people.get(first!.id);
        expect(data?.id).toBe(first!.id);
    });

    it('maps a missing resource to PcoNotFoundError', async () => {
        await expect(pco.people.people.get('999999999999')).rejects.toBeInstanceOf(PcoNotFoundError);
    });

    it('reaches every root collection of every product at a documented URL', async () => {
        const probes: Probe[] = [];
        for (const product of Object.keys(productGraphs) as ProductName[]) {
            const client = pco[product] as unknown as { edge(name: string): { perPage?(n: number): { list(): Promise<{ data: unknown }> }; get(): Promise<{ data: unknown }> } };
            for (const [name, edge] of Object.entries(productGraphs[product].root)) {
                const builder = client.edge(name);
                const path = `${productGraphs[product].basePath}/${name}`;
                probes.push(await probe(path, () => (edge.many ? builder.perPage!(1).list() : builder.get()), edge.many));
            }
        }
        summarize('root collections', probes);
        expect(probes.filter((p) => p.outcome === 'not found').map((p) => p.path)).toEqual([]);
        expect(probes.filter((p) => p.outcome === 'ok').length).toBeGreaterThan(0);
    });

    it('follows every edge from a person at the URLs the generator builds', async () => {
        const { data: me } = await pco.people.me.get();
        const ref = pco.people.people.id(me!.id) as unknown as { edge(name: string): { perPage?(n: number): { list(): Promise<{ data: unknown }> }; get(): Promise<{ data: unknown }> } };
        const probes: Probe[] = [];
        for (const [name, edge] of Object.entries(productGraphs.people.vertices.person!.edges)) {
            const builder = ref.edge(name);
            probes.push(await probe(`/people/v2/people/{me}/${name}`, () => (edge.many ? builder.perPage!(1).list() : builder.get()), edge.many));
        }
        summarize('person edges', probes);
        expect(probes.filter((p) => p.outcome === 'not found').map((p) => p.path)).toEqual([]);
    });
});
