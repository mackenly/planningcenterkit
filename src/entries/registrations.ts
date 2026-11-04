/**
 * Standalone Registrations client, for apps that only need Registrations and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createRegistrationsClient } from '@mackenly/planningcenterkit/registrations';
 *
 * const registrations = createRegistrationsClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { registrationsGraph, type RegistrationsRoot, type RegistrationsSchema } from '../generated/registrations.js';

export * from '../generated/registrations.js';

/** Options for {@link createRegistrationsClient}: transport options (or an existing transport) and an optional API version. */
export type RegistrationsClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Registrations client without the rest of the products. Same API as `new PlanningCenter(...).registrations`. */
export function createRegistrationsClient(options: RegistrationsClientOptions): ProductClient<RegistrationsSchema, RegistrationsRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<RegistrationsSchema, RegistrationsRoot>(registrationsGraph, transport, version ? { version } : {});
}
