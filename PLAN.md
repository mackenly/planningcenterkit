# Planning Center Kit v1 plan

Goal: the most complete, best-typed, dependency-free way to use the Planning Center API from
JavaScript/TypeScript, on Node, Bun, Deno, Cloudflare Workers, or any runtime with `fetch`.

## Key insight: generate from Planning Center's own docs

Planning Center publishes its entire API reference as public JSON:

- `https://api.planningcenteronline.com/{product}/v2/documentation` lists versions
- `https://api.planningcenteronline.com/{product}/v2/documentation/{version}/vertices/{vertex}`
  describes each resource: attributes and their types, relationships, `can_include`, `can_query`
  (where), `can_order`, filters on each edge, create/update-assignable attributes, actions
- `https://api.planningcenteronline.com/{product}/v2/open_api/{version}` is an OpenAPI 3.1 spec

So instead of hand-writing a few endpoints, we snapshot those docs into `spec/` and generate typed
coverage of **every resource in all 11 products** (api, calendar, check-ins, current, giving,
groups, people, publishing, registrations, services, webhooks). A scheduled workflow keeps them
fresh.

## Target developer experience

```ts
import { PlanningCenter } from '@mackenly/planningcenterkit';

const pco = new PlanningCenter({
  auth: { applicationId: process.env.PCO_APP_ID!, secret: process.env.PCO_SECRET! },
});

// Typed where/include/order/filter, autocompleted from the API docs
const { data, included } = await pco.people.people
  .where('created_at', 'gte', '2026-01-01')
  .where('first_name', 'Tim%')
  .include('emails', 'phone_numbers')
  .order('-created_at')
  .perPage(50)
  .list();

data[0].attributes.first_name; // string | null

// Pagination handled for you
for await (const person of pco.people.people.where('status', 'active').all()) { /* ... */ }

// Navigate the graph the same way the URLs do
const emails = await pco.people.people.id('123').emails.list();
const plan = await pco.services.service_types.id('1').plans.id('2').get({ include: ['plan_times'] });

// Writes are typed against the attributes the API accepts
await pco.people.people.create({ first_name: 'Ada', last_name: 'Lovelace' });
await pco.people.people.id('123').update({ nickname: 'Ada' });
await pco.people.people.id('123').delete();
```

Naming rule: product properties are camelCase (`pco.checkIns`), everything that comes from the API
(edges, attributes, includes, query fields) stays snake_case exactly as in Planning Center's docs,
so the docs and the code always match.

## Features

| Area | What we ship |
| --- | --- |
| Coverage | Every resource, edge, include, where field, order field, filter, and action in all products, generated |
| Types | Attribute types, nullable values, create/update payload types, typed `included` lookups |
| Auth | Personal access tokens; OAuth with automatic refresh + `onTokenRefresh` callback; custom token provider |
| OAuth helpers | Authorization URL builder, code exchange, refresh, revoke |
| Rate limits | Honors `Retry-After` on 429, paces itself from `X-PCO-API-Request-Rate-*` headers |
| Resilience | Retries idempotent requests on 5xx/network errors with backoff; per-request timeout and `AbortSignal` |
| Errors | Typed error classes per status (`PcoNotFoundError`, `PcoValidationError`, ...) with PCO error hints decoded (`BABOON` = expired token) |
| Versioning | Each product pinned to the API version its types were generated from (overridable) |
| Pagination | `list()`, `all()` async iterator, `toArray()`, `first()`, `count()` |
| Webhooks | HMAC signature verification (WebCrypto, timing safe) and typed delivery parsing; `Request` helper for Workers/Next/Bun |
| Uploads | `pco.uploadFile()` for upload.planningcenteronline.com |
| Escape hatch | `pco.request()` for anything, still authenticated, retried, and rate-limited |
| Packaging | Zero dependencies, ESM + CJS, tree-shakeable per-product subpath imports, provenance-signed releases |
| Docs | README quick start, guides, examples, generated API reference on GitHub Pages |

## Architecture

```
spec/                    snapshot of PCO documentation JSON (committed, trimmed)
scripts/fetch-spec.ts    downloads the docs into spec/
scripts/generate.ts      spec/ -> src/generated/
src/core/errors.ts       error classes (shared contract)
src/core/graph.ts        generated-metadata contract (runtime + type-level)
src/core/jsonapi.ts      JSON:API document/resource types
src/core/http.ts         transport: auth, retries, rate limiting, timeouts, uploads
src/core/auth.ts         auth strategies + OAuth refresh
src/core/oauth.ts        public OAuth helpers
src/core/query.ts        immutable query builder, pagination, include resolution
src/core/product.ts      builds a product client from a ProductGraph
src/generated/<product>/ generated graph metadata + schema types per product
src/webhooks/            signature verification + delivery parsing
src/client.ts            PlanningCenter class wiring it all together
src/index.ts             public entry; src/<product>.ts subpath entries
test/                    vitest unit tests with a mocked fetch; optional live smoke test
docs/                    guides; TypeDoc output published to GitHub Pages
examples/                runnable examples (Node script, Cloudflare Worker webhook, OAuth flow)
```

## Phases

1. **Foundation** (done first, sequentially): branch, build config (dual ESM/CJS), shared contracts
   in `src/core/{errors,graph,jsonapi}.ts`, this plan.
2. **Parallel build** (subagents, disjoint files):
   - A: transport, auth, OAuth helpers, uploads (`src/core/{http,auth,oauth}.ts`)
   - B: spec fetcher + code generator (`scripts/`, `spec/`, `src/generated/`)
   - C: query builder, pagination, product runtime (`src/core/{query,product}.ts`)
   - D: webhooks (`src/webhooks/`)
3. **Integration**: `PlanningCenter` client, entry points, subpath exports, cross-area tests.
4. **Docs and polish** (subagent): README, guides, examples, TypeDoc + Pages workflow,
   spec-refresh workflow, CHANGELOG.
5. **Review**: independent code review, fix findings, full build/typecheck/test.
6. **Release**: PR from `feature/v1-rewrite`; merging publishes via trusted publishing. This is a
   breaking rewrite of the 0.x API, so release it as 1.0.0 (or 0.5.0 if you want more soak time).

## Later

- React hooks package (`@mackenly/planningcenterkit-react`) built on this client
- Live integration test suite against a sandbox org in CI (needs a PAT secret)
- Typed webhook event names once Planning Center exposes them publicly
