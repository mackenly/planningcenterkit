import { describe, expectTypeOf, it } from 'vitest';
import type { People, Services } from '../../src/generated/index.js';
import type { PeopleRoot, PeopleSchema } from '../../src/generated/people.js';

describe('generated types', () => {
    it('types attributes as nullable values', () => {
        expectTypeOf<People.Person['attributes']['first_name']>().toEqualTypeOf<string | null>();
        expectTypeOf<People.PersonAttributes['grade']>().toEqualTypeOf<number | null>();
        expectTypeOf<People.PersonAttributes['child']>().toEqualTypeOf<boolean | null>();
        expectTypeOf<People.Person['type']>().toEqualTypeOf<'Person'>();
    });

    it('types includes, where, order', () => {
        expectTypeOf<'emails'>().toMatchTypeOf<PeopleSchema['person']['includes']>();
        expectTypeOf<'nope'>().not.toMatchTypeOf<PeopleSchema['person']['includes']>();
        expectTypeOf<Date>().toMatchTypeOf<PeopleSchema['person']['where']['created_at']>();
        expectTypeOf<string>().toMatchTypeOf<PeopleSchema['person']['where']['created_at']>();
        expectTypeOf<PeopleSchema['person']['whereOps']['created_at']>().toEqualTypeOf<'gt' | 'gte' | 'lt' | 'lte'>();
        expectTypeOf<'created_at'>().toMatchTypeOf<PeopleSchema['person']['order']>();
        expectTypeOf<PeopleSchema['person']['related']['emails']>().toEqualTypeOf<'email'>();
    });

    it('types edges and root', () => {
        expectTypeOf<PeopleRoot['people']['many']>().toEqualTypeOf<true>();
        expectTypeOf<PeopleRoot['people']['vertex']>().toEqualTypeOf<'person'>();
        expectTypeOf<PeopleSchema['person']['edges']['emails']['vertex']>().toEqualTypeOf<'email'>();
        expectTypeOf<Services.ServicesSchema['service_type']['edges']['plans']['vertex']>().toEqualTypeOf<'plan'>();
    });

    it('types writes', () => {
        expectTypeOf<{ first_name: string }>().toMatchTypeOf<PeopleSchema['person']['create']>();
        expectTypeOf<PeopleSchema['person']['update']['nickname']>().toEqualTypeOf<string | null | undefined>();
        expectTypeOf<PeopleSchema['person']['delete']>().toEqualTypeOf<true>();
        expectTypeOf<PeopleSchema['person']['actions']>().toEqualTypeOf<never>();
        expectTypeOf<PeopleSchema['list']['actions']>().toMatchTypeOf<string>();
    });
});
