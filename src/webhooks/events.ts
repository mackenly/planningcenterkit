/**
 * Webhook delivery parsing and event-name types.
 *
 * A delivery body is a JSON:API document whose `data` is an array of `EventDelivery` resources.
 * Each one's `payload` attribute is a JSON *string* holding the JSON:API document for the
 * resource that changed:
 *
 * ```json
 * {
 *   "data": [{
 *     "id": "cac783dc-75e7-4c5b-88e8-502d9d8682ae",
 *     "type": "EventDelivery",
 *     "attributes": {
 *       "name": "people.v2.events.person.updated",
 *       "attempt": 1,
 *       "payload": "{\"data\":{\"type\":\"Person\",\"id\":\"125587227\",\"attributes\":{...}},\"included\":[],\"meta\":{...}}"
 *     },
 *     "relationships": { "organization": { "data": { "type": "Organization", "id": "127" } } }
 *   }]
 * }
 * ```
 *
 * @see https://api.planningcenteronline.com/docs/overview/webhooks
 */
import type { AnyResource, JsonApiDocument } from '../core/jsonapi.js';
import { PcoWebhookParseError } from './errors.js';
import type { WebhookBody } from './signature.js';

/**
 * A full webhook event name, `{product}.v2.events.{resource}.{action}`, for example
 * `people.v2.events.person.created` or `check_ins.v2.events.check_in.updated`. The list of
 * names you can subscribe to is at https://api.planningcenteronline.com/webhooks/v2/available_events.
 *
 * @example
 * ```ts
 * const name: WebhookEventName = 'people.v2.events.person.created';
 * ```
 */
export type WebhookEventName = `${string}.v2.events.${string}`;

/**
 * Common webhook actions. Other strings are allowed so new actions don't break your types.
 *
 * @example
 * ```ts
 * if (event.action === 'destroyed') await db.people.delete(event.payload.data.id);
 * ```
 */
export type WebhookAction = 'created' | 'updated' | 'destroyed' | (string & {});

type LastSegment<S extends string> = S extends `${string}.${infer Rest}` ? LastSegment<Rest> : S;
type DropLastSegment<S extends string, Acc extends string = ''> = S extends `${infer Head}.${infer Rest}`
    ? DropLastSegment<Rest, Acc extends '' ? Head : `${Acc}.${Head}`>
    : Acc;

/** Product segment of an event name (`'people'` for `people.v2.events.person.created`). */
export type EventProduct<N extends string> = string extends N
    ? string
    : N extends `${infer P}.v2.events.${string}` ? P : string;

/** Resource segment of an event name (`'person'` for `people.v2.events.person.created`). */
export type EventResource<N extends string> = string extends N
    ? string
    : N extends `${string}.v2.events.${infer Rest}`
      ? Rest extends `${string}.${string}` ? DropLastSegment<Rest> : string
      : string;

/** Action segment of an event name (`'created'` for `people.v2.events.person.created`). */
export type EventAction<N extends string> = string extends N
    ? WebhookAction
    : N extends `${string}.v2.events.${infer Rest}`
      ? string extends LastSegment<Rest> ? WebhookAction : LastSegment<Rest>
      : WebhookAction;

/**
 * One event from a webhook delivery.
 *
 * `N` narrows the event name (and with it `product`, `resource`, and `action`); use
 * {@link isEvent} to narrow. `R` lets you type the payload's primary resource yourself.
 *
 * @example
 * ```ts
 * for (const event of parseWebhook(rawBody)) {
 *     console.log(event.name, event.attempt, event.payload.data.id);
 * }
 * ```
 */
export interface WebhookEvent<N extends string = WebhookEventName, R extends AnyResource = AnyResource> {
    /** The delivery's unique ID (a UUID). The same event redelivered keeps its ID, so use it to dedupe. */
    id: string;
    /** Full event name, e.g. `people.v2.events.person.created`. */
    name: N;
    /** Delivery attempt number, starting at 1. */
    attempt: number;
    /** Product the event came from, e.g. `people`, `services`, `check_ins`. */
    product: EventProduct<N>;
    /** Resource that changed, e.g. `person`, `plan`, `check_in`. */
    resource: EventResource<N>;
    /** What happened: `created`, `updated`, `destroyed`, or another action. */
    action: EventAction<N>;
    /** The JSON:API document for the resource, parsed from the delivery's `payload` string. */
    payload: JsonApiDocument<R>;
    /** The organization the event belongs to, when Planning Center included it. */
    organizationId?: string;
    /** The raw `EventDelivery` resource from the delivery body. */
    raw: AnyResource;
}

/** The parts of a webhook event name. */
export interface ParsedEventName {
    product: string;
    version: string;
    resource: string;
    action: WebhookAction;
}

/**
 * Splits an event name into its parts. Resource names may themselves contain dots, so the
 * action is always the last segment and the resource is everything between `events.` and it.
 * Returns `undefined` when the name is not in `{product}.{version}.events.{resource}.{action}` form.
 *
 * @example
 * ```ts
 * parseEventName('people.v2.events.person.created');
 * // { product: 'people', version: 'v2', resource: 'person', action: 'created' }
 * ```
 */
export function parseEventName(name: string): ParsedEventName | undefined {
    const parts = name.split('.');
    if (parts.length < 5 || parts[2] !== 'events' || parts.some((p) => p.length === 0)) return undefined;
    return {
        product: parts[0]!,
        version: parts[1]!,
        resource: parts.slice(3, -1).join('.'),
        action: parts[parts.length - 1]!,
    };
}

/**
 * Narrows an event to one (or any of several) event names, which also narrows `product`,
 * `resource`, and `action` to literals.
 *
 * @example
 * ```ts
 * for (const event of events) {
 *     if (isEvent(event, 'people.v2.events.person.created')) {
 *         event.action; // 'created'
 *         await welcome(event.payload.data);
 *     } else if (isEvent(event, ['people.v2.events.person.updated', 'people.v2.events.person.destroyed'])) {
 *         await sync(event.payload.data.id);
 *     }
 * }
 * ```
 */
export function isEvent<const N extends WebhookEventName, R extends AnyResource = AnyResource>(
    event: WebhookEvent<WebhookEventName, R>,
    name: N | readonly N[],
): event is WebhookEvent<WebhookEventName, R> & WebhookEvent<N, R> {
    return typeof name === 'string' ? event.name === name : name.includes(event.name as N);
}

const decoder = new TextDecoder('utf-8', { fatal: true });

/**
 * Parses a webhook delivery body into its events. A single delivery body may contain several.
 *
 * This does NOT verify the signature; use {@link handleWebhook} or call
 * {@link verifyWebhookSignature} first. Accepts the raw body (string or bytes) or an already
 * parsed object.
 *
 * @throws {PcoWebhookParseError} If the body or any event's `payload` is not valid JSON, or is
 * not shaped like an `EventDelivery` document. Its `status` is 400.
 *
 * @example
 * ```ts
 * const events = parseWebhook(rawBody);
 * for (const event of events) {
 *     console.log(event.product, event.resource, event.action, event.payload.data.id);
 * }
 * ```
 */
export function parseWebhook(body: WebhookBody | object): WebhookEvent<WebhookEventName>[] {
    let document: unknown = body;
    if (typeof body === 'string' || body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
        let text: string;
        if (typeof body === 'string') {
            text = body;
        } else {
            try {
                text = decoder.decode(body);
            } catch (cause) {
                throw new PcoWebhookParseError('Webhook body is not valid UTF-8', { cause });
            }
        }
        try {
            document = JSON.parse(text);
        } catch (cause) {
            throw new PcoWebhookParseError('Webhook body is not valid JSON', { cause });
        }
    }

    if (!isObject(document) || !('data' in document)) {
        throw new PcoWebhookParseError('Webhook body is not a JSON:API document with a `data` member');
    }
    const data = document.data;
    const deliveries = Array.isArray(data) ? data : [data];
    return deliveries.map((delivery, index) => parseDelivery(delivery, index));
}

function parseDelivery(delivery: unknown, index: number): WebhookEvent<WebhookEventName> {
    const where = `Webhook delivery data[${index}]`;
    if (!isObject(delivery) || !isObject(delivery.attributes)) {
        throw new PcoWebhookParseError(`${where} is not a resource with attributes`);
    }
    const id = delivery.id;
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new PcoWebhookParseError(`${where} has no id`);
    }
    const { name, attempt, payload } = delivery.attributes;
    if (typeof name !== 'string' || name.length === 0) {
        throw new PcoWebhookParseError(`${where} has no event name`);
    }
    if (typeof payload !== 'string') {
        throw new PcoWebhookParseError(`${where} (${name}) has no payload string`);
    }

    let parsedPayload: unknown;
    try {
        parsedPayload = JSON.parse(payload);
    } catch (cause) {
        throw new PcoWebhookParseError(`${where} (${name}) payload is not valid JSON`, { cause });
    }
    if (!isObject(parsedPayload) || !isObject(parsedPayload.data) || typeof parsedPayload.data.type !== 'string') {
        throw new PcoWebhookParseError(`${where} (${name}) payload is not a JSON:API document with a resource in \`data\``);
    }
    const resource = parsedPayload.data;
    if (typeof resource.id === 'number') resource.id = String(resource.id);

    const parts = parseEventName(name);
    const segments = name.split('.');
    const event: WebhookEvent<WebhookEventName> = {
        id: String(id),
        name: name as WebhookEventName,
        attempt: typeof attempt === 'number' ? attempt : Number(attempt) || 1,
        product: parts?.product ?? segments[0] ?? '',
        resource: parts?.resource ?? segments.slice(1, -1).join('.'),
        action: parts?.action ?? segments[segments.length - 1] ?? '',
        payload: parsedPayload as unknown as JsonApiDocument<AnyResource>,
        raw: delivery as unknown as AnyResource,
    };
    const organizationId = findOrganizationId(delivery, parsedPayload);
    if (organizationId !== undefined) event.organizationId = organizationId;
    return event;
}

function findOrganizationId(delivery: Record<string, unknown>, payload: Record<string, unknown>): string | undefined {
    const relationships = delivery.relationships;
    if (isObject(relationships) && isObject(relationships.organization)) {
        const data = relationships.organization.data;
        if (isObject(data) && (typeof data.id === 'string' || typeof data.id === 'number')) return String(data.id);
    }
    const meta = payload.meta;
    if (isObject(meta) && isObject(meta.parent) && meta.parent.type === 'Organization') {
        const parentId = meta.parent.id;
        if (typeof parentId === 'string' || typeof parentId === 'number') return String(parentId);
    }
    return undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
