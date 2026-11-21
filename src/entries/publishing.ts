/**
 * Standalone Publishing client, for apps that only need Publishing and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createPublishingClient } from '@mackenly/planningcenterkit/publishing';
 *
 * const publishing = createPublishingClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { publishingGraph, type PublishingRoot, type PublishingSchema } from '../generated/publishing.js';

export * from '../generated/publishing.js';

/** Options for {@link createPublishingClient}: transport options (or an existing transport) and an optional API version. */
export type PublishingClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Publishing client without the rest of the products. Same API as `new PlanningCenter(...).publishing`. */
export function createPublishingClient(options: PublishingClientOptions): ProductClient<PublishingSchema, PublishingRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<PublishingSchema, PublishingRoot>(publishingGraph, transport, version ? { version } : {});
}
