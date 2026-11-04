import { readFileSync } from 'node:fs';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { PcoError, PcoWebhookError } from '../../src/core/errors.js';
import {
    handleWebhook,
    isEvent,
    parseEventName,
    parseWebhook,
    PcoWebhookParseError,
    PcoWebhookVerificationError,
    signWebhookBody,
    verifyWebhookSignature,
    WEBHOOK_SIGNATURE_HEADER,
    type WebhookAction,
    type WebhookEvent,
} from '../../src/webhooks/index.js';

// Sample body, secret, and expected digest straight from
// https://api.planningcenteronline.com/docs/overview/webhooks (Authenticity section).
const DOCS_BODY = readFileSync(new URL('./fixtures/docs-sample-delivery.json', import.meta.url), 'utf8');
const DOCS_SECRET = '2608ab74db02d670279278a90585fca300953f0a19fd96529cb61bb92ed39d86';
const DOCS_DIGEST = 'a0782fde663e7ee25a99b9d44f45434120ff027ba98ef333a83a4590fcc97828';

const encoder = new TextEncoder();

/** Independent HMAC implementation so tests don't only check signWebhookBody against itself. */
async function hmacHex(body: string | Uint8Array, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const bytes = typeof body === 'string' ? encoder.encode(body) : new Uint8Array(body);
    const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes));
    return Array.from(mac, (b) => b.toString(16).padStart(2, '0')).join('');
}

function delivery(name: string, resource: object, extra: { id?: string; attempt?: number; org?: string } = {}) {
    return {
        id: extra.id ?? crypto.randomUUID(),
        type: 'EventDelivery',
        attributes: {
            name,
            attempt: extra.attempt ?? 1,
            payload: JSON.stringify({ data: resource, included: [], meta: {} }),
        },
        relationships: extra.org ? { organization: { data: { type: 'Organization', id: extra.org } } } : {},
    };
}

const person = { type: 'Person', id: '1', attributes: { first_name: 'Ada' } };

function makeRequest(body: string | Uint8Array<ArrayBuffer>, signature?: string): Request {
    const headers = new Headers({ 'content-type': 'application/json' });
    if (signature !== undefined) headers.set(WEBHOOK_SIGNATURE_HEADER, signature);
    return new Request('https://example.com/webhooks/pco', { method: 'POST', body, headers });
}

describe('verifyWebhookSignature', () => {
    it('matches the sample from the Planning Center docs', async () => {
        expect(await hmacHex(DOCS_BODY, DOCS_SECRET)).toBe(DOCS_DIGEST);
        expect(await signWebhookBody(DOCS_BODY, DOCS_SECRET)).toBe(DOCS_DIGEST);
        expect(await verifyWebhookSignature({ body: DOCS_BODY, signature: DOCS_DIGEST, secret: DOCS_SECRET })).toBe(true);
    });

    it('accepts string, Uint8Array, Buffer, and ArrayBuffer bodies', async () => {
        const bytes = encoder.encode(DOCS_BODY);
        const args = { signature: DOCS_DIGEST, secret: DOCS_SECRET };
        expect(await verifyWebhookSignature({ ...args, body: bytes })).toBe(true);
        expect(await verifyWebhookSignature({ ...args, body: bytes.buffer })).toBe(true);
        expect(await verifyWebhookSignature({ ...args, body: Buffer.from(DOCS_BODY) })).toBe(true);
        // A view into a larger buffer must only hash its own bytes.
        const padded = new Uint8Array(bytes.length + 8);
        padded.set(bytes, 4);
        expect(await verifyWebhookSignature({ ...args, body: padded.subarray(4, 4 + bytes.length) })).toBe(true);
    });

    it('tolerates uppercase hex and surrounding whitespace', async () => {
        expect(await verifyWebhookSignature({ body: DOCS_BODY, signature: ` ${DOCS_DIGEST.toUpperCase()}\n`, secret: DOCS_SECRET })).toBe(true);
    });

    it('rejects a wrong secret, a tampered body, and a wrong digest', async () => {
        expect(await verifyWebhookSignature({ body: DOCS_BODY, signature: DOCS_DIGEST, secret: 'nope' })).toBe(false);
        expect(await verifyWebhookSignature({ body: DOCS_BODY + ' ', signature: DOCS_DIGEST, secret: DOCS_SECRET })).toBe(false);
        const flipped = (DOCS_DIGEST[0] === 'a' ? 'b' : 'a') + DOCS_DIGEST.slice(1);
        expect(await verifyWebhookSignature({ body: DOCS_BODY, signature: flipped, secret: DOCS_SECRET })).toBe(false);
    });

    it('returns false (never throws) for missing or malformed input', async () => {
        const body = DOCS_BODY;
        for (const signature of [undefined, null, '', 'zz', 'abc', DOCS_DIGEST.slice(0, 62), DOCS_DIGEST + '00', `sha256=${DOCS_DIGEST}`]) {
            expect(await verifyWebhookSignature({ body, signature, secret: DOCS_SECRET })).toBe(false);
        }
        expect(await verifyWebhookSignature({ body, signature: DOCS_DIGEST, secret: '' })).toBe(false);
        expect(await verifyWebhookSignature({ body, signature: DOCS_DIGEST, secret: [] })).toBe(false);
        expect(await verifyWebhookSignature({ body: 42 as never, signature: DOCS_DIGEST, secret: DOCS_SECRET })).toBe(false);
        expect(await verifyWebhookSignature(undefined as never)).toBe(false);
    });

    it('accepts any of several secrets', async () => {
        expect(await verifyWebhookSignature({ body: DOCS_BODY, signature: DOCS_DIGEST, secret: ['', 'other', DOCS_SECRET] })).toBe(true);
        expect(await verifyWebhookSignature({ body: DOCS_BODY, signature: DOCS_DIGEST, secret: ['a', 'b'] })).toBe(false);
    });
});

describe('parseEventName', () => {
    it('splits product, version, resource, and action', () => {
        expect(parseEventName('people.v2.events.person.created')).toEqual({ product: 'people', version: 'v2', resource: 'person', action: 'created' });
        expect(parseEventName('check_ins.v2.events.check_in.destroyed')).toEqual({ product: 'check_ins', version: 'v2', resource: 'check_in', action: 'destroyed' });
        expect(parseEventName('services.v2.events.plan.live.updated')).toEqual({ product: 'services', version: 'v2', resource: 'plan.live', action: 'updated' });
    });

    it('returns undefined for names in another shape', () => {
        expect(parseEventName('person.created')).toBeUndefined();
        expect(parseEventName('people.v2.hooks.person.created')).toBeUndefined();
        expect(parseEventName('people.v2.events..created')).toBeUndefined();
    });
});

describe('parseWebhook', () => {
    it('parses the docs sample', () => {
        const [event, ...rest] = parseWebhook(DOCS_BODY);
        expect(rest).toHaveLength(0);
        expect(event).toMatchObject({
            id: 'cac783dc-75e7-4c5b-88e8-502d9d8682ae',
            name: 'people.v2.events.person.updated',
            attempt: 1,
            product: 'people',
            resource: 'person',
            action: 'updated',
            organizationId: '127',
        });
        expect(event!.payload.data).toMatchObject({ type: 'Person', id: '125587227', attributes: { first_name: 'Kid' } });
        expect(event!.payload.included).toEqual([]);
        expect(event!.raw.type).toBe('EventDelivery');
    });

    it('parses multiple deliveries in one body, from string or bytes', () => {
        const body = JSON.stringify({
            data: [
                delivery('people.v2.events.person.created', person, { id: 'a', attempt: 1, org: '9' }),
                delivery('people.v2.events.person.destroyed', { type: 'Person', id: 2 }, { id: 'b', attempt: 3 }),
            ],
        });
        for (const input of [body, encoder.encode(body), encoder.encode(body).buffer]) {
            const events = parseWebhook(input);
            expect(events.map((e) => [e.id, e.action, e.attempt, e.organizationId])).toEqual([
                ['a', 'created', 1, '9'],
                ['b', 'destroyed', 3, undefined],
            ]);
            expect(events[1]!.payload.data.id).toBe('2'); // numeric ids normalized to strings
        }
    });

    it('accepts a single delivery object and an already-parsed body', () => {
        const single = { data: delivery('groups.v2.events.membership.created', person) };
        expect(parseWebhook(single)[0]!.resource).toBe('membership');
        expect(parseWebhook(JSON.stringify(single))[0]!.product).toBe('groups');
    });

    it('falls back to payload meta.parent for the organization id', () => {
        const d = delivery('people.v2.events.person.created', person);
        d.attributes.payload = JSON.stringify({ data: person, meta: { parent: { type: 'Organization', id: '55' } } });
        expect(parseWebhook({ data: [d] })[0]!.organizationId).toBe('55');
    });

    it('throws PcoWebhookParseError (status 400) on malformed input', () => {
        const bad: unknown[] = [
            'not json',
            new Uint8Array([0xff, 0xfe, 0x00]),
            '[]',
            '{"nope":1}',
            JSON.stringify({ data: [null] }),
            JSON.stringify({ data: [{ id: 'x', attributes: { attempt: 1, payload: '{}' } }] }),
            JSON.stringify({ data: [{ attributes: { name: 'a.v2.events.b.c', payload: '{}' } }] }),
            JSON.stringify({ data: [{ id: 'x', attributes: { name: 'a.v2.events.b.c' } }] }),
            JSON.stringify({ data: [{ id: 'x', attributes: { name: 'a.v2.events.b.c', payload: '{not json' } }] }),
            JSON.stringify({ data: [{ id: 'x', attributes: { name: 'a.v2.events.b.c', payload: '{"data":null}' } }] }),
            JSON.stringify({ data: [{ id: 'x', attributes: { name: 'a.v2.events.b.c', payload: '{"data":[]}' } }] }),
        ];
        for (const body of bad) {
            let error: unknown;
            try {
                parseWebhook(body as string);
            } catch (err) {
                error = err;
            }
            expect(error, String(body)).toBeInstanceOf(PcoWebhookParseError);
            expect(error).toBeInstanceOf(PcoWebhookError);
            expect(error).toBeInstanceOf(PcoError);
            expect((error as PcoWebhookParseError).status).toBe(400);
        }
    });

    it('names the failing delivery and event in the message', () => {
        const body = { data: [delivery('people.v2.events.person.created', person), { id: 'x', attributes: { name: 'people.v2.events.person.updated', payload: 'oops' } }] };
        expect(() => parseWebhook(body)).toThrow(/data\[1\] \(people\.v2\.events\.person\.updated\) payload is not valid JSON/);
    });
});

describe('isEvent', () => {
    const [created, updated] = parseWebhook({
        data: [delivery('people.v2.events.person.created', person), delivery('people.v2.events.person.updated', person)],
    });

    it('narrows by one name or a list of names', () => {
        expect(isEvent(created!, 'people.v2.events.person.created')).toBe(true);
        expect(isEvent(updated!, 'people.v2.events.person.created')).toBe(false);
        expect(isEvent(updated!, ['people.v2.events.person.created', 'people.v2.events.person.updated'])).toBe(true);
    });

    it('narrows the types of product, resource, and action', () => {
        const event: WebhookEvent = created!;
        if (isEvent(event, 'people.v2.events.person.created')) {
            expectTypeOf(event.name).toEqualTypeOf<'people.v2.events.person.created'>();
            expectTypeOf(event.product).toEqualTypeOf<'people'>();
            expectTypeOf(event.resource).toEqualTypeOf<'person'>();
            expectTypeOf(event.action).toEqualTypeOf<'created'>();
        }
        if (isEvent(event, 'services.v2.events.plan.live.updated')) {
            expectTypeOf(event.resource).toEqualTypeOf<'plan.live'>();
            expectTypeOf(event.action).toEqualTypeOf<'updated'>();
        }
        expectTypeOf(event.payload.data.id).toEqualTypeOf<string>();
    });
});

describe('handleWebhook', () => {
    const body = JSON.stringify({
        data: [delivery('people.v2.events.person.created', person, { id: 'd1', org: '7' })],
    });

    it('verifies and parses a real Request', async () => {
        const request = makeRequest(body, await hmacHex(body, 's3cret'));
        const events = await handleWebhook(request, { secret: 's3cret' });
        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({ id: 'd1', product: 'people', resource: 'person', action: 'created', organizationId: '7' });
    });

    it('verifies against the exact bytes (byte body, docs sample)', async () => {
        const events = await handleWebhook(makeRequest(encoder.encode(DOCS_BODY), DOCS_DIGEST), { secret: DOCS_SECRET });
        expect(events[0]!.payload.data.id).toBe('125587227');
    });

    it('accepts any of several secrets', async () => {
        const request = makeRequest(body, await hmacHex(body, 'second'));
        await expect(handleWebhook(request, { secret: ['first', 'second'] })).resolves.toHaveLength(1);
    });

    it('resolves secrets per event name (sync or async)', async () => {
        const secrets: Record<string, string> = { 'people.v2.events.person.created': 'created-secret' };
        const seen: string[] = [];
        const resolver = (name: string) => {
            seen.push(name);
            return secrets[name];
        };
        const sig = await hmacHex(body, 'created-secret');
        await expect(handleWebhook(makeRequest(body, sig), { secret: resolver })).resolves.toHaveLength(1);
        expect(seen).toEqual(['people.v2.events.person.created']);
        await expect(handleWebhook(makeRequest(body, sig), { secret: async (name) => [secrets[name]!] })).resolves.toHaveLength(1);
    });

    it('rejects with 401 when the resolver has no secret for the event', async () => {
        const sig = await hmacHex(body, 'created-secret');
        const error = await handleWebhook(makeRequest(body, sig), { secret: () => undefined }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoWebhookVerificationError);
        expect((error as PcoWebhookVerificationError).status).toBe(401);
        expect((error as Error).message).toMatch(/No webhook secret configured for people\.v2\.events\.person\.created/);
    });

    it('rejects with 401 for a bad or missing signature', async () => {
        for (const request of [makeRequest(body, await hmacHex(body, 'wrong')), makeRequest(body), makeRequest(body, 'garbage')]) {
            const error = await handleWebhook(request, { secret: 's3cret' }).catch((e: unknown) => e);
            expect(error).toBeInstanceOf(PcoWebhookVerificationError);
            expect(error).toBeInstanceOf(PcoWebhookError);
            expect((error as PcoWebhookVerificationError).status).toBe(401);
        }
    });

    it('checks the signature before parsing with static secrets (401 beats 400)', async () => {
        const error = await handleWebhook(makeRequest('not json', 'ab'.repeat(32)), { secret: 's3cret' }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoWebhookVerificationError);
    });

    it('rejects a correctly signed but malformed body with 400', async () => {
        const bad = '{"data":[{"id":"x","attributes":{"name":"a.v2.events.b.c","payload":"nope"}}]}';
        const error = await handleWebhook(makeRequest(bad, await hmacHex(bad, 's3cret')), { secret: 's3cret' }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoWebhookParseError);
        expect((error as PcoWebhookParseError).status).toBe(400);
        // Resolver mode has to parse before it can verify, so an unparseable body is unverifiable: 401.
        const error2 = await handleWebhook(makeRequest('nope', 'ab'.repeat(32)), { secret: () => 's3cret' }).catch((e: unknown) => e);
        expect(error2).toBeInstanceOf(PcoWebhookVerificationError);
        expect((error2 as PcoWebhookVerificationError).status).toBe(401);
    });

    it('refuses mixed event names in resolver mode so one secret cannot authorize another subscription', async () => {
        const delivery = (id: string, name: string) => ({
            id,
            type: 'EventDelivery',
            attributes: { name, attempt: 1, payload: JSON.stringify({ data: { type: 'X', id: '1', attributes: {} } }) },
        });
        const mixed = JSON.stringify({
            data: [delivery('1', 'people.v2.events.person.created'), delivery('2', 'giving.v2.events.donation.created')],
        });
        const secrets: Record<string, string> = {
            'people.v2.events.person.created': 'people-secret',
            'giving.v2.events.donation.created': 'giving-secret',
        };
        const error = await handleWebhook(makeRequest(mixed, await hmacHex(mixed, 'people-secret')), {
            secret: (name) => secrets[name],
        }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoWebhookVerificationError);
    });

    it('does not return events from a forged body in resolver mode', async () => {
        const error = await handleWebhook(makeRequest(body, await hmacHex(body, 'attacker')), { secret: () => 'created-secret' }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoWebhookVerificationError);
    });

    it('throws a PcoWebhookError if the body was already consumed', async () => {
        const request = makeRequest(body, await hmacHex(body, 's3cret'));
        await request.text();
        const error = await handleWebhook(request, { secret: 's3cret' }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(PcoWebhookError);
        expect(error).not.toBeInstanceOf(PcoWebhookVerificationError);
    });
});

describe('WebhookEvent types', () => {
    it('types an un-narrowed action as the WebhookAction union', () => {
        expectTypeOf<WebhookEvent['action']>().toEqualTypeOf<WebhookAction>();
        expectTypeOf<WebhookEvent['product']>().toEqualTypeOf<string>();
    });
});
