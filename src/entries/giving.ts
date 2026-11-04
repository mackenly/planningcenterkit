/**
 * Standalone Giving client, for apps that only need Giving and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createGivingClient } from '@mackenly/planningcenterkit/giving';
 *
 * const giving = createGivingClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { givingGraph, type GivingRoot, type GivingSchema } from '../generated/giving.js';

export * from '../generated/giving.js';

/** Options for {@link createGivingClient}: transport options (or an existing transport) and an optional API version. */
export type GivingClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Giving client without the rest of the products. Same API as `new PlanningCenter(...).giving`. */
export function createGivingClient(options: GivingClientOptions): ProductClient<GivingSchema, GivingRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<GivingSchema, GivingRoot>(givingGraph, transport, version ? { version } : {});
}
