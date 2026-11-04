/**
 * Print the upcoming plans for every service type in Planning Center Services, with each plan's
 * service times.
 *
 * Shows: navigating nested edges (service type -> plans), named filters (`future`), `include`
 * with `related()`, `perPage`, and typed resources (`Services.PlanTime`).
 *
 * Run it:
 *
 *     export PCO_APP_ID=...
 *     export PCO_SECRET=...
 *     npx tsx examples/upcoming-plans.ts
 *
 * In your own project, import from '@mackenly/planningcenterkit' instead of '../src/index.js'.
 */
import process from 'node:process';
import { PlanningCenter, type Services } from '../src/index.js';

const pco = new PlanningCenter({
    auth: { applicationId: process.env.PCO_APP_ID ?? '', secret: process.env.PCO_SECRET ?? '' },
});

function formatTime(time: Services.PlanTime): string {
    const { name, starts_at, time_type } = time.attributes;
    const when = starts_at ? new Date(starts_at).toLocaleString() : 'unscheduled';
    return `${name || time_type || 'time'} at ${when}`;
}

async function main(): Promise<void> {
    for await (const serviceType of pco.services.service_types.order('name').all()) {
        console.log(`\n${serviceType.attributes.name}`);

        // GET /services/v2/service_types/{id}/plans?filter=future&include=plan_times&order=sort_date&per_page=5
        const plans = await pco.services.service_types
            .id(serviceType.id)
            .plans.filter('future')
            .include('plan_times')
            .order('sort_date')
            .perPage(5)
            .list();

        if (plans.data.length === 0) console.log('  (no upcoming plans)');
        for (const plan of plans.data) {
            const times = plans.related(plan, 'plan_times').filter((t) => t.attributes.time_type === 'service');
            console.log(`  ${plan.attributes.dates}  ${plan.attributes.title ?? ''}`.trimEnd());
            for (const time of times) console.log(`    - ${formatTime(time)}`);
        }
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
