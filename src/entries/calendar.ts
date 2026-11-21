/**
 * Standalone Calendar client, for apps that only need Calendar and want the smallest bundle.
 *
 * @example
 * ```ts
 * import { createCalendarClient } from '@mackenly/planningcenterkit/calendar';
 *
 * const calendar = createCalendarClient({ auth: { applicationId: '...', secret: '...' } });
 * ```
 *
 * @module
 */
import { createTransport, type TransportOptions } from '../core/http.js';
import { createProductClient, type ProductClient } from '../core/product.js';
import type { PcoTransport } from '../core/transport.js';
import { calendarGraph, type CalendarRoot, type CalendarSchema } from '../generated/calendar.js';

export * from '../generated/calendar.js';

/** Options for {@link createCalendarClient}: transport options (or an existing transport) and an optional API version. */
export type CalendarClientOptions = (TransportOptions | { transport: PcoTransport }) & { version?: string };

/** Creates a Calendar client without the rest of the products. Same API as `new PlanningCenter(...).calendar`. */
export function createCalendarClient(options: CalendarClientOptions): ProductClient<CalendarSchema, CalendarRoot> {
    const { version, ...rest } = options;
    const transport = 'transport' in rest ? rest.transport : createTransport(rest);
    return createProductClient<CalendarSchema, CalendarRoot>(calendarGraph, transport, version ? { version } : {});
}
