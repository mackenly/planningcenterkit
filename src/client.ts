/**
 * Configuration for the Planning Center API client with OAuth
 */
export interface PcoClientConfigOAuth {
    token: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    expiresAt: number;
    customApiBaseUrl?: string;
    version?: string;
}

/**
 * Configuration for the Planning Center API client with a personal access token
 */
export interface PcoClientConfigPersonalAccessToken {
    personalAccessToken: string;
    appId: string;
    customApiBaseUrl?: string;
    version?: string;
}

export abstract class PcoClient {
    private customApiBaseUrl: string | boolean;
    private version: string | undefined;
    private authentication: string;

    private includes: string[] = [];
    private filters: { [key: string]: any } = {};
    private order: { field: string, symbol: string } = { field: 'created_at', symbol: '' };
    private pagination: { limit: number, offset: number } = { limit: 10, offset: 0 };

    //
    // Constructors
    //

    /**
     * Create an instance of the Planning Center API client with a personal access token
     * @param personalAccessToken Personal access token - see {@link https://developer.planning.center/docs/#/overview/authentication}
     * @param appId Application ID - see {@link https://developer.planning.center/docs/#/overview/authentication}
     * @param customApiBaseUrl Custom API base URL (optional)
     * @param version API version (default: 2024-06-09) (optional) {@link https://developer.planning.center/docs/#/overview/versioning}
     * @example
     * ```typescript
     * const client = new ApiClient({
     *  personalAccessToken,
     *  appId
     * } as PcoClientConfigPersonalAccessToken);
     * ```
     * @link https://developer.planning.center/docs/#/overview/authentication
     */
    constructor({ personalAccessToken, appId, customApiBaseUrl, version }: PcoClientConfigPersonalAccessToken)

    /**
     * Create an instance of the Planning Center API client with OAuth
     * @param token Access token - see {@link https://developer.planning.center/docs/#/overview/authentication}
     * @param clientId Client ID - see {@link https://developer.planning.center/docs/#/overview/authentication}
     * @param clientSecret Client secret - see {@link https://developer.planning.center/docs/#/overview/authentication}
     * @param refreshToken Refresh token - see {@link https://developer.planning.center/docs/#/overview/authentication}
     * @param expiresAt Expiration time of the token - Use {@link PcoClient.getExpiration} to calculate
     * @param customApiBaseUrl Custom API base URL (optional)
     * @param version API version (default: 2024-06-09) (optional) {@link https://developer.planning.center/docs/#/overview/versioning}
     * @example
     * ```typescript
     * const client = new ApiClient({
     *  token,
     *  clientId,
     *  clientSecret,
     *  refreshToken,
     *  expiresAt
     * } as PcoClientConfigOAuth);
     * ```
     * @link https://developer.planning.center/docs/#/overview/authentication
     */
    constructor({ token, clientId, clientSecret, refreshToken, expiresAt, customApiBaseUrl, version }: PcoClientConfigOAuth)

    /**
     * Implements the overloads for the constructor
     */
    constructor(config: PcoClientConfigPersonalAccessToken | PcoClientConfigOAuth) {
        if ('version' in config && config.version) {
            if (!config.version.match(/^\d{4}-\d{2}-\d{2}$/)) {
                throw new Error('Invalid version format');
            }
            this.version = config.version;
        }
        if ('personalAccessToken' in config) {
            this.authentication = `Basic ${btoa(config.appId + ':' + config.personalAccessToken)}`;
            this.customApiBaseUrl = config.customApiBaseUrl ?? false;
        } else if ('token' in config) {
            if (!PcoClient.validateToken(config.token)) {
                throw new Error('Invalid token format');
            }
            this.authentication = `Bearer ${config.token}`;
            this.customApiBaseUrl = config.customApiBaseUrl ?? false;
        } else {
            throw new Error('Invalid configuration');
        }
    }

    //
    // Static and internal methods
    //

    /**
     * Get the expiration time for a token when given a lifespan
     * @param expiresIn Time in seconds until the token expires
     * @returns The expiration time in milliseconds
     * @example
     * ```typescript
     * const expiration = ApiClient.getExpiration(7200);
     * const client = new ApiClient({
     *  ... 
     *  expiresAt: expiration
     * } as PcoClientConfigOAuth);
     * ```
     */
    public static getExpiration(expiresIn: number): number {
        return Date.now() + expiresIn * 1000;
    }

    /**
     * Format a date to be used in a request
     * @param date Date to format
     * @returns Formatted date string
     * @example
     * ```typescript
     * const date = new Date();
     * const formattedDate: string = ApiClient.formatDate(date);
     * ```
     */
    protected static formatDate(date: Date): string {
        // Nothing much going on here, but may be useful in the future
        return date.toISOString();
    }

    /**
     * Validate a token to ensure it is in the correct format
     * There's two formats for tokens:
     * Legacy: 64 hexadecimal digits, 0-9 and a-f
     * Current: prefix like pco_tok_, followed by 72 hexadecimal digits; 80 characters total
     * TODO: Remove support for legacy tokens by 2025. It should end September 23, 2024
     * @param token Token to validate
     * @returns Whether the token is valid
     */
    protected static validateToken(token: string): boolean {
        return token.match(/^[0-9a-f]{64}$|^pco_tok_[0-9a-f]{72}$/) !== null;
    }

    /**
     * Make a request to the Planning Center API
     * @param endpoint The endpoint to request
     * @param method The HTTP method to use (default: GET)
     * @param body The body of the request (optional)
     * @param options Request options (optional)
     * @returns The response from the API
     * @throws Error if the request fails
     */
    protected async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        if (this.version) {
            options.headers = {
                ...options.headers,
                'X-PCO-API-Version': this.version
            };
        }
        const apiBaseUrl = this.customApiBaseUrl ? this.customApiBaseUrl : 'https://api.planningcenteronline.com';
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                Authorization: this.authentication
            },

        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}\n${response.statusText}\nMore details: https://developer.planning.center/docs/#/overview/errors`);
        }

        return await response.json();
    }

    //
    // Client methods for manual requests
    //

    /**
     * Get a custom endpoint from the API. This is useful for endpoints that are not covered by the client methods
     * @param endpoint The endpoint to request with the base slash
     * @returns The response from the API
     * @example
     * ```typescript
     * const data = await client.get('/people/v2');
     * ```
     * @link https://developer.planning.center/docs/#/overview/authentication
     * @link https://developer.planning.center/docs/#/overview/errors
     * @link https://developer.planning.center/docs/#/overview/versioning
     */
    public get(endpoint: string) {
        return this.request(`${endpoint}${this.buildQuery()}`);
    }

    /**
     * Create a new record in the API at the given endpoint. This is useful for POST requests not covered by the client methods
     * @param endpoint The endpoint to request with the base slash
     * @param body The body of the request
     * @returns The response from the API
     * @example
     * ```typescript
     * const data = await client.post('/people/v2', { name: 'John Doe' });
     * ```
     * @link https://developer.planning.center/docs/#/overview/authentication
     * @link https://developer.planning.center/docs/#/overview/errors
     * @link https://developer.planning.center/docs/#/overview/versioning
     */
    public post(endpoint: string, body: any) {
        return this.request(`${endpoint}${this.buildQuery()}`, { method: 'POST', body: JSON.stringify(body) });
    }

    /**
     * Update a record in the API at the given endpoint. This is useful for PATCH requests not covered by the client methods
     * @param endpoint The endpoint to request with the base slash
     * @param body The body of the request
     * @returns The response from the API
     * @example
     * ```typescript
     * const data = await client.patch('/people/v2/1', { name: 'Jane Doe' });
     * ```
     * @link https://developer.planning.center/docs/#/overview/authentication
     * @link https://developer.planning.center/docs/#/overview/errors
     * @link https://developer.planning.center/docs/#/overview/versioning
     */
    public patch(endpoint: string, body: any) {
        return this.request(`${endpoint}${this.buildQuery()}`, { method: 'PATCH', body: JSON.stringify(body) });
    }

    /**
     * Delete a record in the API at the given endpoint. This is useful for DELETE requests not covered by the client methods
     * @param endpoint The endpoint to request with the base slash
     * @returns The response from the API
     * @example
     * ```typescript
     * const data = await client.delete('/people/v2/1');
     * ```
     * @link https://developer.planning.center/docs/#/overview/authentication
     * @link https://developer.planning.center/docs/#/overview/errors
     * @link https://developer.planning.center/docs/#/overview/versioning
     */
    public delete(endpoint: string) {
        return this.request(`${endpoint}${this.buildQuery()}`, { method: 'DELETE' });
    }

    //
    // Query builder methods
    //

    /**
     * Include related records in the response
     * @param relations The relations to include
     * @returns The client instance
     * @example
     * ```typescript
     * const data = await client.include(['emails']).getPerson();
     * ```
     */
    public include(relations: string[]) {
        this.includes = relations;
        return this;
    }

    /**
     * Filter the response by a field
     * @param field The field to filter by
     * @param operator The operator to use in the filter
     * @param value The value to filter by
     * @returns The client instance
     * @example
     * ```typescript
     * const data = await client.where('search_name_or_email', '=', 'hello@example.com').getPerson();
     * ```
     */
    public where(field: string, operator: string, value: any) {
        this.filters[field] = { operator, value };
        return this;
    }

    /**
     * Order the response by a field
     * @param field The field to order by
     * @param direction The direction to order in (default: desc)
     * @returns The client instance
     * @example
     * ```typescript
     * const data = await client.orderBy('created_at', 'asc').getPerson();
     * ```
     */
    public orderBy(field: string, direction: 'asc' | 'desc' = 'desc') {
        let symbol = '';
        switch (direction) {
            case 'asc':
                symbol = '-';
                break;
            case 'desc':
                symbol = '';
                break;
        }
        this.order = { field, symbol };
        return this;
    }

    /**
     * Paginate the response
     * @param limit The number of records to return
     * @param offset The number of records to skip
     * @returns The client instance
     * @example
     * ```typescript
     * const data = await client.paginate(10, 0).getPerson();
     * ```
     */
    public paginate(limit: number, offset: number) {
        this.pagination = { limit, offset };
        return this;
    }

    /**
     * Build the query string from the includes, filters, order, and pagination
     * @returns The query string
     */
    protected buildQuery() {
        let query = `?include=${this.includes.join(',')}`;
        for (let field in this.filters) {
            const filter = this.filters[field];
            query += `&where[${field}]${filter.operator}${filter.value}`;
        }
        query += `&order=${this.order.symbol}${this.order.field}`;
        query += `&limit=${this.pagination.limit}&offset=${this.pagination.offset}`;

        // clean up the attributes
        this.includes = [];
        this.filters = {};
        this.order = { field: 'created_at', symbol: '' };
        this.pagination = { limit: 10, offset: 0 };

        return query;
    }
}
