/**
 * Standalone Groups client, for apps that only need Groups and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createGroupsClient } from '@mackenly/planningcenterkit/groups';
 *
 * const groups = createGroupsClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { groupsGraph, type GroupsRoot, type GroupsSchema } from '../generated/groups.js';

export * from '../generated/groups.js';

/** Options for {@link createGroupsClient}: transport options (or an existing transport) and an optional API version. */
export type GroupsClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Groups client without the rest of the products. Same API as `new PlanningCenter(...).groups`. */
export function createGroupsClient(options: GroupsClientOptions): ProductClient<GroupsSchema, GroupsRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<GroupsSchema, GroupsRoot>(groupsGraph, transport, version ? { version } : {});
}
