/**
 * Standalone Current client, for apps that only need Current and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createCurrentClient } from '@mackenly/planningcenterkit/current';
 *
 * const current = createCurrentClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { currentGraph, type CurrentRoot, type CurrentSchema } from '../generated/current.js';

export * from '../generated/current.js';

/** Options for {@link createCurrentClient}: transport options (or an existing transport) and an optional API version. */
export type CurrentClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Current client without the rest of the products. Same API as `new PlanningCenter(...).current`. */
export function createCurrentClient(options: CurrentClientOptions): ProductClient<CurrentSchema, CurrentRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<CurrentSchema, CurrentRoot>(currentGraph, transport, version ? { version } : {});
}
