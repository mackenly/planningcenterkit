/**
 * Standalone CheckIns client, for apps that only need CheckIns and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createCheckInsClient } from '@mackenly/planningcenterkit/check-ins';
 *
 * const checkIns = createCheckInsClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { checkInsGraph, type CheckInsRoot, type CheckInsSchema } from '../generated/check-ins.js';

export * from '../generated/check-ins.js';

/** Options for {@link createCheckInsClient}: transport options (or an existing transport) and an optional API version. */
export type CheckInsClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a CheckIns client without the rest of the products. Same API as `new PlanningCenter(...).checkIns`. */
export function createCheckInsClient(options: CheckInsClientOptions): ProductClient<CheckInsSchema, CheckInsRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<CheckInsSchema, CheckInsRoot>(checkInsGraph, transport, version ? { version } : {});
}
