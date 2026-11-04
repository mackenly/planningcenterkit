# Changelog

All notable changes to this project are documented here. The project follows
[semantic versioning](https://semver.org) from 1.0.0 on.

## Unreleased (1.0.0)

A ground-up rewrite. See [Migrating from 0.x](https://planningcenterkit.mackenly.com/guides/migrating-from-0-x/).

### Added

- **Every Planning Center product**: API, Calendar, Check-Ins, Current, Giving, Groups, People,
  Publishing, Registrations, Services, and Webhooks, generated from Planning Center's published
  API documentation (`npm run spec:fetch && npm run generate`).
- **`PlanningCenter` client** with one property per product (`pco.people`, `pco.services`,
  `pco.checkIns`, ...), and per-product subpath entries (`@mackenly/planningcenterkit/people`,
  ...) exporting `create{Product}Client()` for smaller bundles.
- **Typed, immutable query builder** for every collection and nested edge: `where` (with `gt`,
  `gte`, `lt`, `lte` on comparable fields), `filter`, `include`, `order`, `perPage`, `offset`,
  `param`; `list()`, `all()`, `pages()`, `toArray()`, `first()`, `count()`, `get()`; and
  `related()` for typed access to side-loaded resources.
- **Typed writes**: `create()`, `update()`, `delete()`, and `action()`, present only where the API
  supports them, with payloads typed from the documented assignable attributes.
- **Resource types** for every resource, e.g. `People.Person`, `Services.Plan`, `CheckIns.CheckIn`.
- **Authentication**: personal access tokens, OAuth with automatic (single-flight) refresh and an
  `onTokenRefresh` hook for persisting rotated refresh tokens, and custom token providers.
- **OAuth helpers** (`@mackenly/planningcenterkit/oauth`): `getAuthorizationUrl`,
  `createPkceChallenge`, `exchangeCodeForToken`, `refreshAccessToken`, `revokeToken`,
  `introspectToken`, `normalizeTokens`.
- **Resilience**: rate limiting from `X-PCO-API-Request-Rate-*` headers, `Retry-After` handling,
  retries with jittered backoff for idempotent requests, per-attempt timeouts, `AbortSignal`
  support, a concurrency limit, and logging hooks (`onRequest`, `onResponse`, `onRetry`,
  `onThrottle`).
- **Typed errors** per status (`PcoNotFoundError`, `PcoValidationError` with `fieldErrors`,
  `PcoRateLimitError` with `retryAfter`, ...) with Planning Center error hints decoded (e.g.
  `BABOON` for an expired token).
- **Webhooks** (`@mackenly/planningcenterkit/webhooks`): `handleWebhook()` for standard `Request`
  objects, `verifyWebhookSignature()` (WebCrypto, constant time), `parseWebhook()`, `isEvent()`,
  `parseEventName()`, and `signWebhookBody()` for tests.
- **File uploads** with `pco.uploadFile()`, and **raw requests** with `pco.request()`.
- **API version pinning**: each product sends the version its types were generated from;
  override per product with `versions`.
- Dual ESM and CommonJS builds, zero runtime dependencies, provenance-signed npm releases.
- A documentation site at https://planningcenterkit.mackenly.com with guides, a reference generated
  from Planning Center's API documentation, and Agent Skills; runnable `examples/`.

### Breaking changes

- The `PcoPeople` class, the `PcoClient` base class, and the `PcoClientConfigOAuth` /
  `PcoClientConfigPersonalAccessToken` types are removed. Use `new PlanningCenter({ auth })`.
- Credentials are passed as `auth`: `appId`/`personalAccessToken` became
  `applicationId`/`secret`; OAuth `token` became `accessToken`. `customApiBaseUrl` became `baseUrl`.
- `getPerson()` is replaced by `pco.people.people.list()` / `.all()` / `.get(id)`.
- `include([...])` takes names as arguments: `include('a', 'b')`.
- `where(field, operator, value)` now takes `where(field, value)` or `where(field, 'gte', value)`.
- `orderBy(field, direction)` is replaced by `order(field)` / `order('-field')`. Note that 0.x
  sent the opposite direction from the one requested.
- `paginate(limit, offset)` is replaced by `perPage()` and `offset()`; queries no longer default
  to `order=created_at&limit=10`.
- `get`/`post`/`patch`/`delete(endpoint)` are replaced by `pco.request({ method, path, query, body })`.
- The single `version` option (default `2024-06-09`) is replaced by per-product pinned versions.
- Failed requests throw `PcoApiError` subclasses instead of a plain `Error`.
- Requires Node.js 22 or newer.

## 0.4.42 and earlier

Pre-1.0 development releases with a partial People client. See the
[GitHub releases](https://github.com/mackenly/planningcenterkit/releases) for details.
