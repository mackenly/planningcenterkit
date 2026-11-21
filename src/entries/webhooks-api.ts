/**
 * Standalone Webhooks client, for apps that only need Webhooks and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createWebhooksClient } from '@mackenly/planningcenterkit/webhooks-api';
 *
 * const webhooks = createWebhooksClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { webhooksGraph, type WebhooksRoot, type WebhooksSchema } from '../generated/webhooks.js';

export * from '../generated/webhooks.js';

/** Options for {@link createWebhooksClient}: transport options (or an existing transport) and an optional API version. */
export type WebhooksClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Webhooks client without the rest of the products. Same API as `new PlanningCenter(...).webhooks`. */
export function createWebhooksClient(options: WebhooksClientOptions): ProductClient<WebhooksSchema, WebhooksRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<WebhooksSchema, WebhooksRoot>(webhooksGraph, transport, version ? { version } : {});
}
