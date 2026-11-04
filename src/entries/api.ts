/**
 * Standalone Api client, for apps that only need Api and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createApiClient } from '@mackenly/planningcenterkit/api';
 *
 * const api = createApiClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { apiGraph, type ApiRoot, type ApiSchema } from '../generated/api.js';

export * from '../generated/api.js';

/** Options for {@link createApiClient}: transport options (or an existing transport) and an optional API version. */
export type ApiClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Api client without the rest of the products. Same API as `new PlanningCenter(...).api`. */
export function createApiClient(options: ApiClientOptions): ProductClient<ApiSchema, ApiRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<ApiSchema, ApiRoot>(apiGraph, transport, version ? { version } : {});
}
