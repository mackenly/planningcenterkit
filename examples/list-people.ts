/**
 * List every active person in a Planning Center organization, with their email addresses.
 *
 * Shows: personal access token auth, typed `where`/`include`/`order`, automatic pagination with
 * `all()`, reading side-loaded resources with `related()`, and `count()`.
 *
 * Run it:
 *
 *     export PCO_APP_ID=...   # from https://api.planningcenteronline.com/oauth/applications
 *     export PCO_SECRET=...   # (Personal Access Tokens section)
 *     npx tsx examples/list-people.ts
 *
 * `tsx` is only needed here because this example imports the library's TypeScript sources
 * directly. In your own project, import from '@mackenly/planningcenterkit' and run with plain
 * `node` (22+), Bun, or Deno.
 */
import process from 'node:process';
import { PlanningCenter, PcoAuthenticationError, type People } from '../src/index.js';

const applicationId = process.env.PCO_APP_ID;
const secret = process.env.PCO_SECRET;
if (!applicationId || !secret) {
    console.error('Set PCO_APP_ID and PCO_SECRET to a personal access token first.');
    process.exit(1);
}

const pco = new PlanningCenter({
    auth: { applicationId, secret },
    userAgent: 'planningcenterkit-example/1.0',
});

// Builders are immutable, so a base query can be reused.
const active = pco.people.people.where('status', 'active');

async function main(): Promise<void> {
    const total = await active.count();
    console.log(`${total} active people\n`);

    // pages() follows pagination (100 per page by default) and keeps each page's `included`,
    // which is what related() reads side-loaded emails from.
    let printed = 0;
    for await (const page of active.include('emails').order('last_name', 'first_name').pages()) {
        for (const person of page.data) {
            const emails: People.Email[] = page.related(person, 'emails');
            const addresses = emails.map((email) => email.attributes.address).filter(Boolean);
            console.log(`${person.attributes.name ?? '(no name)'}  ${addresses.join(', ')}`);
            printed++;
        }
    }

    // all() yields one resource at a time when you don't need `included`.
    let children = 0;
    for await (const person of active.where('child', true).all()) {
        if (person.attributes.birthdate) children++;
    }
    console.log(`\nPrinted ${printed} people; ${children} children have a birthdate on file.`);
}

main().catch((error: unknown) => {
    if (error instanceof PcoAuthenticationError) {
        console.error(`Authentication failed (${error.status}). Check PCO_APP_ID and PCO_SECRET.`);
    } else {
        console.error(error);
    }
    process.exit(1);
});
