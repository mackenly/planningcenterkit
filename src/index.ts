/**
 * Planning Center Kit: a fully typed, zero-dependency client for every Planning Center API.
 *
 * @example
 * ```ts
 * import { PlanningCenter } from '@mackenly/planningcenterkit';
 *
 * const pco = new PlanningCenter({ auth: { applicationId: '...', secret: '...' } });
 * const { data } = await pco.people.people.where('first_name', 'Ada').list();
 * ```
 *
 * @module @mackenly/planningcenterkit
 */

export { PlanningCenter } from './client.js';
export type { ApiVersions, PlanningCenterOptions, PlanningCenterTransportOptions } from './client.js';

// Errors
export * from './core/errors.js';

// Transport and auth
export { createTransport, encodeQuery, DEFAULT_BASE_URL, DEFAULT_UPLOAD_URL, DEFAULT_USER_AGENT } from './core/http.js';
export type {
    RateLimitOptions,
    RequestInfo,
    ResponseInfo,
    RetryInfo,
    RetryOptions,
    ThrottleInfo,
    TransportHooks,
    TransportOptions,
} from './core/http.js';
export { validateAuth } from './core/auth.js';
export type { OAuthAuth, PcoAuth, PersonalAccessTokenAuth, TokenProviderAuth } from './core/auth.js';
export type * from './core/transport.js';

// OAuth helpers
export * from './core/oauth.js';

// Query builder and product clients
export { createProductClient } from './core/product.js';
export type { ProductClient, ProductClientBase, ProductClientOptions, ProductReservedName, ProductRootResource } from './core/product.js';
export type {
    Collection,
    CreatableCollection,
    CreatableSingleRef,
    Deletable,
    EdgeBuilder,
    GetOptions,
    ItemEdges,
    ItemRef,
    ItemRefBase,
    ItemReservedName,
    ItemResult,
    IterateOptions,
    ListResult,
    OrderValue,
    PagesOptions,
    RelatedName,
    RelatedResource,
    RelatedSource,
    RequestOptions,
    ResourceId,
    ResultBase,
    SingleRef,
    Updatable,
    WriteOptions,
} from './core/query.js';

// Shared types
export type * from './core/jsonapi.js';
export type * from './core/graph.js';

// Generated per-product graphs and resource types, e.g. `People.Person`, `Services.Plan`
export * from './generated/index.js';
