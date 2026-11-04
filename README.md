# Planning Center Kit

A fully typed, zero-dependency TypeScript client for every Planning Center API.

[![npm version](https://img.shields.io/npm/v/@mackenly/planningcenterkit?logo=npm)](https://www.npmjs.com/package/@mackenly/planningcenterkit)
[![CI](https://github.com/mackenly/planningcenterkit/actions/workflows/ci-publish.yml/badge.svg?branch=main)](https://github.com/mackenly/planningcenterkit/actions/workflows/ci-publish.yml)
[![License: Apache-2.0](https://img.shields.io/npm/l/@mackenly/planningcenterkit)](./LICENSE)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](./package.json)
[![npm provenance](https://img.shields.io/badge/npm-provenance-blue?logo=npm)](https://www.npmjs.com/package/@mackenly/planningcenterkit#provenance)

```ts
import { PlanningCenter } from '@mackenly/planningcenterkit';

const pco = new PlanningCenter({
    auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! },
});

for await (const person of pco.people.people.where('status', 'active').order('last_name').all()) {
    console.log(person.attributes.name); // string | null
}
```

**[Documentation](https://planningcenterkit.mackenly.com/)** · **[Guides](https://planningcenterkit.mackenly.com/guides/getting-started/)** · **[Reference](https://planningcenterkit.mackenly.com/reference/)** · **[Examples](https://github.com/mackenly/planningcenterkit/tree/main/examples)** · **[Changelog](./CHANGELOG.md)**

## Contents

- [Why Planning Center Kit](#why-planning-center-kit)
- [Install](#install)
- [Quick start](#quick-start)
- [Authentication](#authentication)
- [Querying](#querying)
- [Navigating nested resources](#navigating-nested-resources)
- [Creating, updating, deleting, and actions](#creating-updating-deleting-and-actions)
- [Errors](#errors)
- [Rate limits, retries, timeouts, and logging](#rate-limits-retries-timeouts-and-logging)
- [Receiving webhooks](#receiving-webhooks)
- [File uploads](#file-uploads)
- [Raw requests](#raw-requests)
- [Per-product imports](#per-product-imports)
- [TypeScript](#typescript)
- [API versions](#api-versions)
- [Supported runtimes](#supported-runtimes)
- [Contributing](#contributing)
- [Sponsors](#sponsors)
- [Disclaimer](#disclaimer)

## Why Planning Center Kit

- **Every product, every resource.** All 11 Planning Center products (API, Calendar, Check-Ins,
  Current, Giving, Groups, People, Publishing, Registrations, Services, Webhooks) are generated
  from Planning Center's own published API documentation, so every resource, edge, include,
  `where` field, `order` field, filter, and action is there.
- **Types for everything.** Attribute types, create/update payloads, valid query names, and the
  resources you pull out of `included` are all typed and autocompleted. Typos fail at compile time.
- **Names match the docs.** Edges and attributes are `snake_case` exactly as in Planning Center's
  reference, so what you read there is what you type.
- **Handles the hard parts.** Automatic pagination, rate limiting from Planning Center's headers,
  `Retry-After`, retries with backoff, timeouts, and `AbortSignal` support.
- **OAuth done right.** Automatic token refresh with rotating refresh tokens, an `onTokenRefresh`
  hook to persist them, and helpers for the authorization flow with PKCE.
- **Webhooks.** Constant-time signature verification (WebCrypto) and typed event parsing.
- **Runs anywhere.** Node 22+, Bun, Deno, Cloudflare Workers, Vercel, and any runtime with `fetch`.
- **Zero dependencies, signed releases.** ESM and CommonJS builds, tree-shakeable per-product
  imports, and npm packages published with [provenance](https://docs.npmjs.com/generating-provenance-statements).

This is version 1.0. The public API follows [semantic versioning](https://semver.org): breaking
changes only in major versions. Coming from 0.x? See the [migration guide](https://planningcenterkit.mackenly.com/guides/migrating-from-0-x/).

## Install

```bash
npm install @mackenly/planningcenterkit
# or
pnpm add @mackenly/planningcenterkit
yarn add @mackenly/planningcenterkit
bun add @mackenly/planningcenterkit
```

## Quick start

Create a personal access token at
[api.planningcenteronline.com/oauth/applications](https://api.planningcenteronline.com/oauth/applications),
then:

```ts
import { PlanningCenter } from '@mackenly/planningcenterkit';

const pco = new PlanningCenter({
    auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! },
});

// One page, with filters, side-loaded emails, and sorting.
const page = await pco.people.people
    .where('created_at', 'gte', '2026-01-01')
    .include('emails')
    .order('-created_at')
    .perPage(25)
    .list();

for (const person of page.data) {
    const emails = page.related(person, 'emails').map((email) => email.attributes.address);
    console.log(person.attributes.name, emails);
}

// Follow nested edges exactly like the URLs do.
const plans = await pco.services.service_types.id('123').plans.filter('future').list();

// Writes are typed against the attributes Planning Center accepts.
const { data: ada } = await pco.people.people.create({ first_name: 'Ada', last_name: 'Lovelace' });
await pco.people.people.id(ada.id).emails.create({ address: 'ada@example.com', location: 'Home' });
```

More in [Getting started](https://planningcenterkit.mackenly.com/guides/getting-started/).

## Authentication

Pass exactly one strategy as `auth`. Full details: [Authentication guide](https://planningcenterkit.mackenly.com/guides/authentication/).

**Personal access token** (scripts and servers that act for your own organization):

```ts
const pco = new PlanningCenter({ auth: { applicationId: '...', secret: '...' } });
```

**OAuth** (apps used by many organizations). With `refreshToken`, `clientId`, and `clientSecret`
set, the client refreshes the access token shortly before `expiresAt` and once after any `401`.
Planning Center refresh tokens **rotate**: each refresh invalidates the previous one, so persist
the new tokens in `onTokenRefresh`:

```ts
const pco = new PlanningCenter({
    auth: {
        accessToken: saved.accessToken,
        refreshToken: saved.refreshToken,
        expiresAt: saved.expiresAt, // ms since epoch, or a Date
        clientId: process.env.PCO_CLIENT_ID!,
        clientSecret: process.env.PCO_CLIENT_SECRET!,
        onTokenRefresh: (tokens) => db.saveTokens(userId, tokens),
    },
});
```

**Token provider** (you own storage and refresh):

```ts
const pco = new PlanningCenter({ auth: { getAccessToken: () => tokenStore.getFreshToken(userId) } });
```

**OAuth flow helpers** live in `@mackenly/planningcenterkit/oauth` and work without a client:

```ts
import { createPkceChallenge, exchangeCodeForToken, getAuthorizationUrl } from '@mackenly/planningcenterkit/oauth';

// 1. Redirect the user to Planning Center.
const { codeVerifier, codeChallenge } = await createPkceChallenge();
const state = crypto.randomUUID(); // store state + codeVerifier in the session
const url = getAuthorizationUrl({
    clientId: process.env.PCO_CLIENT_ID!,
    redirectUri: 'https://example.com/auth/complete',
    scopes: ['people', 'services'],
    state,
    codeChallenge,
});

// 2. On the redirect back, check `state`, then exchange the code.
const tokens = await exchangeCodeForToken({
    clientId: process.env.PCO_CLIENT_ID!,
    clientSecret: process.env.PCO_CLIENT_SECRET!,
    code: callbackUrl.searchParams.get('code')!,
    redirectUri: 'https://example.com/auth/complete',
    codeVerifier,
});
await db.saveTokens(userId, tokens); // { accessToken, refreshToken, expiresAt, scope, ... }
```

`refreshAccessToken`, `revokeToken`, `introspectToken`, and `normalizeTokens` are there too. A
runnable server: [examples/oauth-flow.ts](./examples/oauth-flow.ts).

## Querying

Every collection is an immutable builder; each method returns a new builder, so you can share a
base query. Full details: [Querying guide](https://planningcenterkit.mackenly.com/guides/querying/).

```ts
const people = pco.people.people
    .where('first_name', 'Tim%')                 // where[first_name]=Tim%  (% is a wildcard)
    .where('created_at', 'gte', '2026-01-01')    // where[created_at][gte]=2026-01-01
    .where('created_at', 'lt', new Date('2026-02-01')) // Dates are sent as ISO 8601
    .filter('created_since')                     // filter=created_since
    .include('emails', 'phone_numbers')          // include=emails,phone_numbers
    .order('last_name', '-created_at')           // order=last_name,-created_at
    .perPage(50)                                 // per_page=50 (1-100)
    .offset(100);                                // offset=100
```

`where` operators (`gt`, `gte`, `lt`, `lte`) are only accepted on fields Planning Center lets you
compare (dates, times, some numbers); everything else is equality. Field names, value types,
filters, includes, and order fields are all checked against the docs for that resource.

Running a query:

| Method | Returns |
| --- | --- |
| `list()` | One page: `{ data, included, meta, links, totalCount, nextOffset, related() }` |
| `all()` | Async iterator over every matching resource, following pagination (100 per page) |
| `pages()` | Async iterator over pages, each with its own `included` and `related()` |
| `toArray({ max })` | Every matching resource (or the first `max`) in an array |
| `first()` | The first resource, or `undefined` |
| `count()` | `meta.total_count` for the query |
| `get(id, { include })` | One resource by id |

Side-loaded resources are read with `related()`, which is typed from the relationship name:

```ts
const { data, related } = await pco.people.people.include('emails', 'primary_campus').list();
for (const person of data) {
    const emails = related(person, 'emails');         // People.Email[]
    const [campus] = related(person, 'primary_campus'); // People.Campus | undefined
}
```

## Navigating nested resources

`id()` gives you a reference to one resource; every edge Planning Center documents for it is a
property you can follow, as deep as the URLs go:

```ts
// GET /people/v2/people/1/emails
const emails = await pco.people.people.id('1').emails.list();

// GET /services/v2/service_types/1/plans/2?include=plan_times
const { data: plan, related } = await pco.services.service_types.id('1').plans.id('2').get({ include: ['plan_times'] });

// GET /services/v2/service_types/1/plans/2/items
const items = await pco.services.service_types.id('1').plans.id('2').items.toArray();

// The product root (usually the organization)
const { data: org } = await pco.people.get();
```

An edge whose name collides with a builder method is reachable with `.edge('name')`.

## Creating, updating, deleting, and actions

`create` exists only on collections Planning Center lets you `POST` to, `update` and `delete`
only on resources that support them, and `action` only accepts the resource's documented actions.
Full details: [Writing data guide](https://planningcenterkit.mackenly.com/guides/writing-data/).

```ts
const { data: person } = await pco.people.people.create({ first_name: 'Ada', last_name: 'Lovelace' });
await pco.people.people.id(person.id).update({ nickname: 'Ada' });
await pco.people.people.id(person.id).emails.create({ address: 'ada@example.com', location: 'Home' });
await pco.people.people.id(person.id).delete();

// Actions: POST /people/v2/lists/1/run
await pco.people.lists.id('1').action('run');
```

## Errors

Every error extends `PcoError`. Non-2xx responses become a `PcoApiError` subclass chosen by status.
Full details: [Errors and retries guide](https://planningcenterkit.mackenly.com/guides/errors-and-retries/).

| Class | When | Extras |
| --- | --- | --- |
| `PcoError` | Base class; also invalid arguments (bad id, unknown action) | |
| `PcoApiError` | Any non-2xx response | `status`, `method`, `url`, `errors`, `hint`, `headers`, `body` |
| `PcoBadRequestError` | 400 | |
| `PcoAuthenticationError` | 401 | `hint`, e.g. `BABOON` (expired token) |
| `PcoForbiddenError` | 403 | |
| `PcoNotFoundError` | 404 | |
| `PcoConflictError` | 409 | |
| `PcoValidationError` | 422 | `fieldErrors`: messages keyed by attribute |
| `PcoRateLimitError` | 429 after retries | `retryAfter` (seconds) |
| `PcoServerError` | 5xx after retries | |
| `PcoNetworkError` | No response (DNS, reset, ...) | `cause` |
| `PcoTimeoutError` | Exceeded `timeoutMs` | `cause` |
| `PcoOAuthError` | OAuth exchange/refresh/revoke failed | `status`, `error` (e.g. `invalid_grant`), `errorDescription` |
| `PcoWebhookVerificationError` | Bad webhook signature | `status` = 401 |
| `PcoWebhookParseError` | Malformed webhook body | `status` = 400 |

```ts
import { PcoAuthenticationError, PcoValidationError } from '@mackenly/planningcenterkit';

try {
    await pco.people.people.create({ first_name: '' });
} catch (err) {
    if (err instanceof PcoValidationError) console.log(err.fieldErrors); // { first_name: ["can't be blank"] }
    else if (err instanceof PcoAuthenticationError && err.hint === 'BABOON') console.log('token expired');
    else throw err;
}
```

## Rate limits, retries, timeouts, and logging

Defaults that work for most apps, all configurable:

```ts
const pco = new PlanningCenter({
    auth,
    timeoutMs: 30_000,                // per attempt
    maxConcurrency: 10,               // requests in flight at once
    retry: { maxRetries: 3, retryServerErrors: true, maxRetryAfterSeconds: 60 },
    rateLimit: { throttle: true },    // pace from X-PCO-API-Request-Rate-* headers
    userAgent: 'my-app/1.0',
    hooks: {
        onResponse: ({ method, url, status, durationMs }) => console.log(method, url, status, `${durationMs}ms`),
        onRetry: ({ reason, attempt, delayMs }) => console.warn(`retry #${attempt + 1} (${reason}) in ${delayMs}ms`),
        onThrottle: ({ delayMs }) => console.warn(`rate limit: waiting ${delayMs}ms`),
    },
});

// Cancel any request.
const controller = new AbortController();
await pco.people.people.list({ signal: controller.signal });
```

- **429** responses wait for `Retry-After` and retry (any method, since the request wasn't processed).
- **5xx, network errors, and timeouts** are retried with jittered exponential backoff for `GET`
  and `DELETE` only. `POST` and `PATCH` are never retried for these, since they may have applied.
- All products on one client share a transport, so rate limiting is coordinated across them.
- Hooks never receive credentials.

## Receiving webhooks

`@mackenly/planningcenterkit/webhooks` verifies the `X-PCO-Webhooks-Authenticity` signature
against the raw body and parses deliveries into typed events. Full details:
[Webhooks guide](https://planningcenterkit.mackenly.com/guides/webhooks/).

> **Two different "webhooks".** `@mackenly/planningcenterkit/webhooks` is for *receiving* webhooks
> on your server. `pco.webhooks` (or `@mackenly/planningcenterkit/webhooks-api`) is the Webhooks
> *product API*, for managing subscriptions and listing available events.

```ts
import { handleWebhook, isEvent, PcoWebhookError } from '@mackenly/planningcenterkit/webhooks';

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            // Each subscription has its own secret: pass all of them, or a function of the event name.
            const events = await handleWebhook(request, { secret: [env.PCO_CREATED_SECRET, env.PCO_UPDATED_SECRET] });
            ctx.waitUntil(Promise.all(events.map(async (event) => {
                if (isEvent(event, 'people.v2.events.person.created')) await onNewPerson(event.payload.data.id);
            })));
            return new Response('ok'); // respond 200 fast; anything else is retried
        } catch (err) {
            const status = err instanceof PcoWebhookError && 'status' in err ? Number(err.status) : 500;
            return new Response('Rejected', { status }); // 401 or 400; never 410 (deactivates the subscription)
        }
    },
};
```

`handleWebhook` takes a standard `Request` (Workers, Next.js App Router, Bun, Deno, Hono). For
Express, use `express.raw({ type: 'application/json' })` with `verifyWebhookSignature` and
`parseWebhook`; see the guide. A full Worker: [examples/cloudflare-worker-webhooks.ts](./examples/cloudflare-worker-webhooks.ts).

## File uploads

Upload to Planning Center's upload service, then pass the returned id to an attribute that takes a file:

```ts
import { readFile } from 'node:fs/promises';

const file = await pco.uploadFile(await readFile('avatar.png'), { filename: 'avatar.png', contentType: 'image/png' });
await pco.people.people.id('123').update({ avatar: file.id });
```

Accepts a `Blob`/`File`, `ArrayBuffer`, or `Uint8Array` (a Node `Buffer` works).

## Raw requests

For anything the typed clients don't cover, `request()` is still authenticated, rate limited, and retried:

```ts
import type { JsonApiDocument } from '@mackenly/planningcenterkit';

const me = await pco.request<JsonApiDocument>({ method: 'GET', path: '/people/v2/me' });
const page = await pco.request<JsonApiDocument>({
    method: 'GET',
    path: '/people/v2/people',
    query: { 'where[search_name_or_email]': 'ada', per_page: 10 },
    version: '2026-10-05', // raw requests send no X-PCO-API-Version unless you set one
});
```

On a builder, `.param(key, value)` adds any raw query parameter.

## Per-product imports

`PlanningCenter` gives you every product. If you only need one, each product has its own entry
point (the package is `sideEffects: false`, so bundlers drop the rest):

```ts
import { createPeopleClient } from '@mackenly/planningcenterkit/people';

const people = createPeopleClient({ auth: { applicationId: '...', secret: '...' } });
const { data } = await people.people.where('status', 'active').list();
```

| Import | Exports |
| --- | --- |
| `@mackenly/planningcenterkit` | `PlanningCenter`, errors, OAuth helpers, all types |
| `@mackenly/planningcenterkit/{product}` | `create{Product}Client` and that product's types, for `api`, `calendar`, `check-ins`, `current`, `giving`, `groups`, `people`, `publishing`, `registrations`, `services` |
| `@mackenly/planningcenterkit/webhooks-api` | `createWebhooksClient` (the Webhooks product API: subscriptions, deliveries) |
| `@mackenly/planningcenterkit/webhooks` | Receiving webhooks: `handleWebhook`, `verifyWebhookSignature`, `parseWebhook`, ... |
| `@mackenly/planningcenterkit/oauth` | OAuth helpers only |

See [Products](https://planningcenterkit.mackenly.com/guides/products/) and the [reference](https://planningcenterkit.mackenly.com/reference/) for every product's client property, import, and root collections.

## TypeScript

Every resource has a named type in its product namespace, and the result types are exported:

```ts
import type { ListResult, People, Services } from '@mackenly/planningcenterkit';

function greet(person: People.Person) {
    return `Hello, ${person.attributes.first_name ?? 'friend'}`;
}

type PlanTitle = Services.PlanAttributes['title'];          // string | null
type PeoplePage = ListResult<People.PeopleSchema, 'person'>; // what pco.people.people.list() resolves to
type NewPerson = People.PeopleSchema['person']['create'];    // accepted create attributes
```

More in the [TypeScript guide](https://planningcenterkit.mackenly.com/guides/typescript/). Plain JavaScript works too; you just don't get the checking.

## API versions

Planning Center versions each product's API by date. Each product client sends the version its
types were generated from in `X-PCO-API-Version`, so responses always match the types:

| Product | Version |
| --- | --- |
| API | 2026-09-24 |
| Calendar | 2026-06-22 |
| Check-Ins | 2025-05-28 |
| Current | 2018-08-01 |
| Giving | 2019-10-18 |
| Groups | 2023-07-10 |
| People | 2026-10-05 |
| Publishing | 2024-03-25 |
| Registrations | 2025-05-01 |
| Services | 2018-11-01 |
| Webhooks | 2022-10-20 |

Override per product with `new PlanningCenter({ auth, versions: { people: '2025-11-10' } })` (the
types won't follow). A scheduled workflow regenerates the types when Planning Center publishes new
versions; adopting a new version is called out in the changelog.

## Supported runtimes

Node.js 22+, Bun, Deno, Cloudflare Workers, Vercel (Node and Edge), and any runtime with `fetch`,
`AbortSignal`, and WebCrypto. The library uses only web-standard globals and no Node built-ins.
Keep secrets and tokens on the server: don't ship personal access tokens or client secrets to a browser.

## Contributing

Issues and pull requests are welcome. The code that covers Planning Center's resources is generated,
so fixes to resource types usually belong in `scripts/` rather than `src/generated/`.

| Script | What it does |
| --- | --- |
| `npm run spec:fetch` | Downloads Planning Center's API documentation into `spec/` |
| `npm run generate` | Regenerates `src/generated/` from `spec/` |
| `npm test` | Unit and type tests (Vitest) |
| `npm run typecheck` | `tsc` over sources, tests, scripts, and examples |
| `npm run build` | Builds ESM and CommonJS output into `dist/` |
| `npm run check` | Typecheck, test, and build |
| `npm run docs:dev` | Generates the reference pages and runs the docs site locally (`site/`, Nimbus) |
| `npm run docs:build` | Generates the reference pages from `spec/` and builds the docs site |

## Sponsors

[<img alt="Tricities Media Group" src="https://tricitiesmediagroup.com/TMG-black-1080x247.png" width="250" style="background-color: white">](https://tricitiesmediagroup.com?utm_source=planningcenterkit&utm_medium=github&utm_campaign=sponsorship)

*Interested in getting your company's logo displayed here and supporting the project? [Contact me](https://tricitiesmediagroup.com/contact) to discuss sponsorship opportunities.*

## Disclaimer

This project is not supported by or affiliated with Planning Center. It is an independent,
community-maintained project, and continued development depends on the maintainer's availability,
financial support, and interest. If you'd like to see it maintained and further developed, please
contribute code or support it through [GitHub Sponsors](https://github.com/sponsors/mackenly). If
you work at Planning Center and would like to support this project, I'd be happy to discuss ways
we could work together.

Copyright 2024-2026 Tricities Media Group LLC
