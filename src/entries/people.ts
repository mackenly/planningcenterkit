/**
 * Standalone People client, for apps that only need People and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createPeopleClient } from '@mackenly/planningcenterkit/people';
 *
 * const people = createPeopleClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { peopleGraph, type PeopleRoot, type PeopleSchema } from '../generated/people.js';

export * from '../generated/people.js';

/** Options for {@link createPeopleClient}: transport options (or an existing transport) and an optional API version. */
export type PeopleClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a People client without the rest of the products. Same API as `new PlanningCenter(...).people`. */
export function createPeopleClient(options: PeopleClientOptions): ProductClient<PeopleSchema, PeopleRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<PeopleSchema, PeopleRoot>(peopleGraph, transport, version ? { version } : {});
}
