/**
 * Standalone Services client, for apps that only need Services and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createServicesClient } from '@mackenly/planningcenterkit/services';
 *
 * const services = createServicesClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { servicesGraph, type ServicesRoot, type ServicesSchema } from '../generated/services.js';

export * from '../generated/services.js';

/** Options for {@link createServicesClient}: transport options (or an existing transport) and an optional API version. */
export type ServicesClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Services client without the rest of the products. Same API as `new PlanningCenter(...).services`. */
export function createServicesClient(options: ServicesClientOptions): ProductClient<ServicesSchema, ServicesRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<ServicesSchema, ServicesRoot>(servicesGraph, transport, version ? { version } : {});
}
