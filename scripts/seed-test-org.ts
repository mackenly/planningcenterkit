/**
 * Seeds a Planning Center test organization with people whose single-record links are set
 * (marital status, name prefix and suffix, school, primary campus, inactive reason), so the live
 * tests can check those URLs for real. Safe to run repeatedly: it reuses existing options and
 * updates the two test people (last name `PCK-Test`) instead of creating duplicates.
 *
 * This WRITES to the organization. Point it at a test organization.
 *
 *     PCO_TEST_CLIENT_ID=... PCO_TEST_SECRET=... npm run seed:test-org
 *
 * Credentials are read from the environment and never printed.
 */

// Runs against the built package (npm run seed:test-org builds first): Node's type stripping
// can't follow src/'s `.js` import specifiers to `.ts` files.
const { PlanningCenter, PcoApiError } = (await import(
    new URL('../dist/esm/index.js', import.meta.url).href
)) as typeof import('../src/index.ts');

const MARKER = 'PCK-Test';

const applicationId = process.env.PCO_TEST_CLIENT_ID;
const secret = process.env.PCO_TEST_SECRET;
if (!applicationId || !secret) {
    console.error('Set PCO_TEST_CLIENT_ID and PCO_TEST_SECRET (a personal access token) to seed a test organization.');
    process.exit(1);
}

async function main(auth: { applicationId: string; secret: string }): Promise<void> {
    const pco = new PlanningCenter({ auth });

    interface Option {
        label: string;
        find: () => Promise<{ id: string } | undefined>;
        create: () => Promise<{ data: { id: string } }>;
    }

    /** Returns the id of an existing option, or creates one. */
    async function ensure(option: Option): Promise<string> {
        const existing = await option.find();
        if (existing) {
            console.log(`  ${option.label}: using existing ${existing.id}`);
            return existing.id;
        }
        const { data } = await option.create();
        console.log(`  ${option.label}: created ${data.id}`);
        return data.id;
    }

    console.log('Options:');
    const maritalStatusId = await ensure({
        label: 'marital status',
        find: () => pco.people.marital_statuses.first(),
        create: () => pco.people.marital_statuses.create({ value: 'Married' }),
    });
    const namePrefixId = await ensure({
        label: 'name prefix',
        find: () => pco.people.name_prefixes.first(),
        create: () => pco.people.name_prefixes.create({ value: 'Dr.' }),
    });
    const nameSuffixId = await ensure({
        label: 'name suffix',
        find: () => pco.people.name_suffixes.first(),
        create: () => pco.people.name_suffixes.create({ value: 'Jr.' }),
    });
    const schoolId = await ensure({
        label: 'school',
        find: () => pco.people.school_options.first(),
        create: () => pco.people.school_options.create({ value: 'Test Elementary', beginning_grade: '1', ending_grade: '5' }),
    });
    const inactiveReasonId = await ensure({
        label: 'inactive reason',
        find: () => pco.people.inactive_reasons.first(),
        create: () => pco.people.inactive_reasons.create({ value: 'Moved' }),
    });
    const campusId = await ensure({
        label: 'campus',
        find: () => pco.people.campuses.first(),
        create: () => pco.people.campuses.create({ name: 'Test Campus' }),
    });

    type PersonWrite = Parameters<typeof pco.people.people.create>[0];

    const people: Array<{ first_name: string; attributes: PersonWrite }> = [
        {
            first_name: 'Active',
            attributes: {
                status: 'active',
                marital_status_id: maritalStatusId,
                name_prefix_id: namePrefixId,
                name_suffix_id: nameSuffixId,
                school_id: schoolId,
                primary_campus_id: campusId,
            },
        },
        {
            first_name: 'Inactive',
            attributes: { status: 'inactive', inactive_reason_id: inactiveReasonId },
        },
    ];

    console.log('People:');
    for (const person of people) {
        const attributes = { first_name: person.first_name, last_name: MARKER, ...person.attributes };
        const existing = await pco.people.people.where('last_name', MARKER).where('first_name', person.first_name).first();
        if (existing) {
            await pco.people.people.id(existing.id).update(attributes);
            console.log(`  ${person.first_name} ${MARKER}: updated ${existing.id}`);
        } else {
            const { data } = await pco.people.people.create(attributes);
            console.log(`  ${person.first_name} ${MARKER}: created ${data.id}`);
        }
    }

    // Read back what Planning Center actually stored, so a silently ignored field shows up here.
    console.log('Check:');
    const links = ['marital_status', 'name_prefix', 'name_suffix', 'school', 'primary_campus', 'inactive_reason'] as const;
    const { data: seeded, related } = await pco.people.people.where('last_name', MARKER).include(...links).list();
    let missing = 0;
    for (const link of links) {
        const holder = seeded.find((p) => related(p, link).length > 0);
        console.log(`  ${link}: ${holder ? `set on ${holder.attributes.first_name} ${MARKER}` : 'NOT SET'}`);
        if (!holder) missing++;
    }

    if (missing) {
        console.error(`${missing} link(s) didn't stick; Planning Center may have ignored those fields.`);
        process.exit(1);
    }
}

main({ applicationId, secret }).catch((error: unknown) => {
    // Planning Center errors carry the URL and Planning Center's message, never credentials.
    console.error(error instanceof PcoApiError ? error.message : error);
    process.exit(1);
});

export {};
