import { describe, expectTypeOf, it } from 'vitest';
import type { AnyResource, PcoResource } from '../../src/core/jsonapi.js';
import { createProductClient, type ProductClient } from '../../src/core/product.js';
import type { Collection, CreatableCollection, ItemRef, ItemResult, ListResult, SingleRef } from '../../src/core/query.js';
import { fixtureGraph, mockTransport, type FixtureRoot, type FixtureSchema } from './fixture.js';

type S = FixtureSchema;
const pco = createProductClient<S, FixtureRoot>(fixtureGraph, mockTransport().transport);

describe('product client', () => {
    it('has one property per root edge, typed by many/create', () => {
        expectTypeOf(pco).toEqualTypeOf<ProductClient<S, FixtureRoot>>();
        expectTypeOf(pco.people).toEqualTypeOf<CreatableCollection<S, 'person', 'admins' | 'organization_admins'>>();
        expectTypeOf(pco.emails).toEqualTypeOf<Collection<S, 'email', never>>();
        // `get` collides with the method; reachable through edge().
        expectTypeOf(pco.get).toBeFunction();
        expectTypeOf(pco.edge('get')).toEqualTypeOf<Collection<S, 'email', never>>();
        // @ts-expect-error unknown root edge
        pco.edge('nope');
        // @ts-expect-error unknown root edge property
        void pco.nope;
    });

    it('types the root resource', async () => {
        const { data } = await pco.get();
        expectTypeOf(data).toEqualTypeOf<PcoResource<S['organization']>>();
        expectTypeOf(data.attributes.name).toEqualTypeOf<string | null>();
    });
});

describe('where', () => {
    it('accepts known fields with the right value types', () => {
        pco.people.where('first_name', 'Tim%');
        pco.people.where('status', 'active');
        pco.people.where('child', true);
        pco.people.where('created_at', 'gte', '2026-01-01').where('created_at', 'lte', '2026-02-01');
        pco.people.where('remote_id', 'gt', 5);
    });

    it('rejects invalid fields, values, and operators', () => {
        // @ts-expect-error unknown where field
        pco.people.where('nickname', 'x');
        // @ts-expect-error wrong value type
        pco.people.where('child', 'yes');
        // @ts-expect-error value not in the enum
        pco.people.where('status', 'deleted');
        // @ts-expect-error operator on a non-comparable field
        pco.people.where('first_name', 'gte', 'A');
        // @ts-expect-error operator not supported by this field
        pco.people.where('remote_id', 'gte', 5);
        // @ts-expect-error wrong value type with operator
        pco.people.where('remote_id', 'gt', '5');
        // @ts-expect-error email has no comparable fields
        pco.emails.where('address', 'gt', 'a');
    });

    it('preserves the builder type, including create', () => {
        expectTypeOf(pco.people.where('status', 'active')).toEqualTypeOf(pco.people);
        expectTypeOf(pco.people.where('status', 'active').perPage(5).create).toBeFunction();
    });
});

describe('filter, include, order', () => {
    it('accepts valid names', () => {
        pco.people.filter('admins', 'organization_admins');
        pco.people.include('emails', 'primary_campus');
        pco.people.order('created_at');
        pco.people.order('-created_at', 'last_name');
        pco.people.id('1').households.filter('active');
    });

    it('rejects invalid names', () => {
        // @ts-expect-error unknown filter
        pco.people.filter('nope');
        // @ts-expect-error emails edge has no filters
        pco.people.id('1').emails.filter('active');
        // @ts-expect-error unknown include
        pco.people.include('addresses');
        // @ts-expect-error email has no includes
        pco.emails.include('person');
        // @ts-expect-error unknown order field
        pco.people.order('nickname');
        // @ts-expect-error double prefix
        pco.people.order('--created_at');
        // @ts-expect-error campus has no order fields
        pco.campuses.order('name');
    });
});

describe('results', () => {
    it('types list and get results', async () => {
        const page = await pco.people.list();
        expectTypeOf(page).toEqualTypeOf<ListResult<S, 'person'>>();
        expectTypeOf(page.data).toEqualTypeOf<PcoResource<S['person']>[]>();
        expectTypeOf(page.data[0]!.attributes.first_name).toEqualTypeOf<string | null>();
        expectTypeOf(page.included).toEqualTypeOf<AnyResource[]>();
        expectTypeOf(page.totalCount).toEqualTypeOf<number | undefined>();

        const item = await pco.people.get('1', { include: ['emails'] });
        expectTypeOf(item).toEqualTypeOf<ItemResult<S, 'person'>>();
        expectTypeOf(item.data.type).toEqualTypeOf<'Person'>();
        // @ts-expect-error unknown include
        await pco.people.get('1', { include: ['nope'] });

        expectTypeOf(pco.people.all()).toEqualTypeOf<AsyncIterable<PcoResource<S['person']>>>();
        expectTypeOf(pco.people.pages()).toEqualTypeOf<AsyncIterable<ListResult<S, 'person'>>>();
        expectTypeOf(pco.people.toArray({ max: 5 })).resolves.toEqualTypeOf<PcoResource<S['person']>[]>();
        expectTypeOf(pco.people.first()).resolves.toEqualTypeOf<PcoResource<S['person']> | undefined>();
        expectTypeOf(pco.people.count()).resolves.toEqualTypeOf<number>();
    });

    it('types related() from the vertex related map', async () => {
        const { data, related } = await pco.people.include('emails').list();
        const p = data[0]!;
        expectTypeOf(related(p, 'emails')).toEqualTypeOf<PcoResource<S['email']>[]>();
        expectTypeOf(related(p, 'emails')[0]!.attributes.address).toEqualTypeOf<string | null>();
        expectTypeOf(related(p, 'primary_campus')).toEqualTypeOf<PcoResource<S['campus']>[]>();
        expectTypeOf(related(p, 'something_else')).toEqualTypeOf<AnyResource[]>();
    });

    it('types single-ref results as nullable', async () => {
        expectTypeOf(pco.people.id('1').primary_campus).toEqualTypeOf<SingleRef<S, 'campus'>>();
        const { data } = await pco.people.id('1').primary_campus.get();
        expectTypeOf(data).toEqualTypeOf<PcoResource<S['campus']> | null>();
    });
});

describe('writes', () => {
    it('types create attributes and refuses create on non-creatable edges', async () => {
        const created = await pco.people.create({ first_name: 'Ada', last_name: 'Lovelace' });
        expectTypeOf(created.data).toEqualTypeOf<PcoResource<S['person']>>();
        await pco.people.id('1').emails.create({ address: 'ada@example.com', primary: true });
        // @ts-expect-error unknown create attribute
        await pco.people.create({ nickname: 'Ada' });
        // @ts-expect-error wrong attribute type
        await pco.people.create({ first_name: 1 });
        // @ts-expect-error root emails edge is not creatable
        await pco.emails.create({ address: 'x' });
        // @ts-expect-error households edge is not creatable
        await pco.people.id('1').households.create({});
    });

    it('types update attributes and hides update when not updatable', async () => {
        await pco.people.id('1').update({ nickname: 'Ada' });
        // @ts-expect-error status is not updatable
        await pco.people.id('1').update({ status: 'active' });
        // @ts-expect-error wrong type
        await pco.people.id('1').update({ nickname: 3 });
        // @ts-expect-error household has no update attributes
        await pco.people.id('1').households.id('2').update({});
    });

    it('types action names', async () => {
        await pco.people.id('1').action('merge', { data: {} });
        // @ts-expect-error unknown action
        await pco.people.id('1').action('explode');
        // @ts-expect-error email has no actions
        await pco.people.id('1').emails.id('2').action('merge');
    });
});

describe('navigation', () => {
    it('types nested edges', () => {
        expectTypeOf(pco.people.id('1')).toEqualTypeOf<ItemRef<S, 'person'>>();
        expectTypeOf(pco.people.id('1').emails).toEqualTypeOf<CreatableCollection<S, 'email', never>>();
        expectTypeOf(pco.people.id('1').households).toEqualTypeOf<Collection<S, 'household', 'active' | 'primary'>>();
        expectTypeOf(pco.people.id('1').households.id('2').people.id('3').emails).toEqualTypeOf<
            CreatableCollection<S, 'email', never>
        >();
        expectTypeOf(pco.people.id('1').emails.id('2').person).toEqualTypeOf<SingleRef<S, 'person'>>();
        // @ts-expect-error person has no addresses edge
        void pco.people.id('1').addresses;
    });

    it('reserved-name edges are only reachable via edge()', () => {
        const ref = pco.people.id('1');
        expectTypeOf(ref.update).toBeFunction();
        expectTypeOf(ref.edge('update')).toEqualTypeOf<Collection<S, 'email', never>>();
        expectTypeOf(ref.edge('then')).toEqualTypeOf<Collection<S, 'email', never>>();
        expectTypeOf(ref).not.toHaveProperty('then');
        // @ts-expect-error unknown edge
        ref.edge('nope');
    });
});

describe('delete availability', () => {
    it('exposes delete only on deletable resources', () => {
        const client = createProductClient<FixtureSchema, FixtureRoot>(fixtureGraph, mockTransport().transport);
        expectTypeOf(client.people.id('1').delete).toBeFunction();
        // @ts-expect-error households can't be deleted
        client.people.id('1').households.id('2').delete();
    });
});

describe('creatable single edges', () => {
    it('exposes create() only on creatable single edges', () => {
        const client = createProductClient<FixtureSchema, FixtureRoot>(fixtureGraph, mockTransport().transport);
        // @ts-expect-error primary_campus is not creatable
        client.people.id('1').primary_campus.create({});
    });
});
