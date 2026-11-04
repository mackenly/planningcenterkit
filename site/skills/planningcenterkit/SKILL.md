---
name: planningcenterkit
description: Use @mackenly/planningcenterkit, the typed TypeScript client for every Planning Center (PCO) API. Covers creating a client, authentication, querying with where/filter/include/order, pagination, nested resources, creates/updates/deletes/actions, errors, retries and rate limits, and finding exact resource and field names in the reference.
---

# Unofficial Planning Center Kit

`@mackenly/planningcenterkit` is an unofficial, zero-dependency client for every Planning Center API (People, Services, Check-Ins, Groups, Giving, Calendar, Registrations, Publishing, Current, Webhooks, API). The typed clients are generated from Planning Center's API documentation, so every name is `snake_case` exactly as in Planning Center's docs. Node 22+, Bun, Deno, Cloudflare Workers, Vercel.

Docs: https://planningcenterkit.mackenly.com (Markdown of any page: append `index.md` to its URL, e.g. https://planningcenterkit.mackenly.com/guides/querying/index.md; index: https://planningcenterkit.mackenly.com/llms.txt).

## Create one client and reuse it

```ts
import { PlanningCenter } from '@mackenly/planningcenterkit';

const pco = new PlanningCenter({
    auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! }, // personal access token
    userAgent: 'my-app/1.0',
});
```

- Products are properties: `pco.people`, `pco.services`, `pco.checkIns`, `pco.groups`, `pco.giving`, `pco.calendar`, `pco.registrations`, `pco.publishing`, `pco.webhooks`, `pco.api`, `pco.current`. They share one transport (credentials, rate limiter, concurrency).
- `auth` is exactly one of: `{ applicationId, secret }`; OAuth `{ accessToken, refreshToken, expiresAt, clientId, clientSecret, onTokenRefresh }`; or `{ getAccessToken }`. For OAuth use the `planningcenterkit-oauth` skill. Never ship secrets or tokens to a browser.
- One product only: `import { createPeopleClient } from '@mackenly/planningcenterkit/people'` (subpaths: `api`, `calendar`, `check-ins`, `current`, `giving`, `groups`, `people`, `publishing`, `registrations`, `services`, `webhooks-api`).
- In multi-tenant apps, create one client per organization or user.

## Query

Root collections are named after their URL: `/people/v2/people` is `pco.people.people`, `/services/v2/service_types` is `pco.services.service_types`. Builders are immutable; each method returns a new builder.

```ts
const page = await pco.people.people
    .where('created_at', 'gte', '2026-01-01') // operators gt | gte | lt | lte, only on comparable fields
    .where('status', 'active')                // equality
    .filter('admins')                         // named filters, typed per edge
    .include('emails', 'phone_numbers')       // side-load
    .order('-created_at')                     // '-' = descending
    .perPage(25)                              // 1-100
    .list();

for (const person of page.data) {
    const emails = page.related(person, 'emails'); // People.Email[]; always an array
    console.log(person.id, person.attributes.name, emails[0]?.attributes.address);
}
```

- `where` values: `%` is a wildcard (`'Tim%'`); pass it unencoded. `null`/`undefined` throws instead of dropping the condition.
- Extra filter parameters and anything untyped: `.param('after', '2026-12-01')`.
- Terminal methods: `list()` (one page: `data`, `included`, `meta`, `links`, `totalCount`, `nextOffset`, `related()`), `all()` (async iterator over every resource, 100 per page), `pages()` (iterator of pages, `{ maxPages }`), `toArray({ max })`, `first()`, `count()`, `get(id, { include })`. All accept `{ signal }`.
- Nested resources: `.id(id)` then any edge, as deep as the URLs go: `pco.services.service_types.id('1').plans.id('2').items.list()`. Edges named like methods (`get`, `update`, `delete`, `action`, `edge`, `path`, `then`) use `.edge('name')`.
- Single-resource edges have `get()` (e.g. `pco.people.me.get()`, `pco.groups.groups.id('5').enrollment.get()`). Many to-one links are documented as collections (`primary_campus`, `song`): use `list()` or `first()`.
- Product root (usually the organization): `await pco.people.get()`.
- Undocumented endpoints: `pco.request({ method: 'GET', path: '/people/v2/...', query, version })` (still authenticated, rate limited, retried; sends no API version unless given).

## Write

```ts
const { data: ada } = await pco.people.people.create({ first_name: 'Ada', last_name: 'Lovelace' });
await pco.people.people.id(ada.id).emails.create({ address: 'ada@example.com', location: 'Home', primary: true });
await pco.people.people.id(ada.id).update({ nickname: 'Ada' }); // null clears a value
await pco.people.people.id(ada.id).emails.id('456').delete();
await pco.people.lists.id('1').action('run'); // POST /people/v2/lists/1/run; bodies untyped
const file = await pco.uploadFile(bytes, { filename: 'a.png', contentType: 'image/png' }); // then pass file.id
```

`create`, `update`, `delete`, and `action` exist only where Planning Center supports them, typed against the documented assignable attributes. Related ids usually go in `*_id` attributes; JSON:API relationships via `{ relationships }` in the second argument. `create()`/`update()` accept `{ include }`.

## Errors, retries, rate limits

- Everything throws a `PcoError` subclass. Non-2xx: `PcoApiError` with `status`, `method`, `url`, `errors`, `hint`, `headers`, `body`; subclasses `PcoBadRequestError` 400, `PcoAuthenticationError` 401, `PcoForbiddenError` 403, `PcoNotFoundError` 404, `PcoConflictError` 409, `PcoValidationError` 422 (`fieldErrors` by attribute), `PcoRateLimitError` 429 (`retryAfter`), `PcoServerError` 5xx. Also `PcoNetworkError`, `PcoTimeoutError`, `PcoOAuthError`.
- `hint` is Planning Center's codename: `BABOON` expired token, `CAPUCHIN` revoked, `PELICAN` missing scope, `TRASH_PANDA` no access to the product (`PCO_ERROR_HINTS`).
- 429 is retried for any method after `Retry-After`; 5xx, network errors, and timeouts only for GET and DELETE. POST/PATCH are never retried on those, since they may have applied: check before retrying a create yourself.
- The client paces itself from `X-PCO-API-Request-Rate-*` headers (default 100 requests per 20 s per user), pauses everything after a 429, and caps concurrency (`maxConcurrency`, default 10). Options: `retry: { maxRetries, retryServerErrors, maxRetryAfterSeconds }`, `rateLimit: { throttle }`, `timeoutMs` (30000), `hooks: { onRequest, onResponse, onRetry, onThrottle }`. Several clients for the same credentials should share `createTransport(...)`.

## Find the right names

Do not guess resource, edge, attribute, filter, or order names. Look them up:

1. Reference, per product and resource, with client paths, attributes and TypeScript types, `where` fields and operators, `order` fields, includes, filters per edge, edges, create/update attributes, delete support, and actions: https://planningcenterkit.mackenly.com/reference/ (resource pages at `/reference/<product>/<resource-id-with-dashes>/`, e.g. `/reference/people/phone-number/`, `/reference/services/plan/`).
2. Types: `People.Person`, `People.PersonAttributes`, `People.PeopleSchema['person']['create' | 'update' | 'includes' | 'order' | 'where' | 'edges']`, `ListResult<People.PeopleSchema, 'person'>`. The compiler rejects unknown names, so run `tsc` after writing queries.
3. Planning Center's own docs (linked from each reference page) for action bodies and filter parameters.

Guides: [Getting started](https://planningcenterkit.mackenly.com/guides/getting-started/) · [Querying](https://planningcenterkit.mackenly.com/guides/querying/) · [Writing data](https://planningcenterkit.mackenly.com/guides/writing-data/) · [Errors and retries](https://planningcenterkit.mackenly.com/guides/errors-and-retries/) · [TypeScript](https://planningcenterkit.mackenly.com/guides/typescript/) · [Products](https://planningcenterkit.mackenly.com/guides/products/) · [Migrating from 0.x](https://planningcenterkit.mackenly.com/guides/migrating-from-0-x/)
