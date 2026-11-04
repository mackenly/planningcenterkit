/**
 * The contract between the query/product runtime and the HTTP layer.
 * `createTransport()` in `http.ts` implements it; tests can supply their own.
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/** Query parameter values. Arrays are joined with commas (e.g. `include=a,b`). */
export type QueryValue = string | number | boolean | Date | readonly (string | number)[] | undefined | null;

export interface PcoRequest {
    method: HttpMethod;
    /**
     * Path beginning with `/` (e.g. `/people/v2/people`), resolved against the configured base
     * URL, or an absolute `https://` URL (used to follow `links.next`).
     */
    path: string;
    /**
     * Query parameters, keys used verbatim (e.g. `where[created_at][gte]`, `include`, `per_page`).
     * `undefined`/`null` values are skipped. Dates are sent as ISO 8601.
     */
    query?: Record<string, QueryValue>;
    /** JSON body; serialized with `JSON.stringify`. */
    body?: unknown;
    /** Extra headers. */
    headers?: Record<string, string>;
    /** API version for this request, sent as `X-PCO-API-Version` when set. */
    version?: string;
    /** Cancels the request. */
    signal?: AbortSignal;
}

/** Options for {@link PcoTransport.upload}. */
export interface UploadOptions {
    /** File name to send. Defaults to the `File` name or `upload`. */
    filename?: string;
    /** MIME type. Defaults to the `Blob` type or `application/octet-stream`. */
    contentType?: string;
    signal?: AbortSignal;
}

/** A file uploaded to Planning Center's upload service. Pass `id` to an attribute that accepts a file. */
export interface UploadedFile {
    /** File UUID, e.g. `us1-16207df7-...`. */
    id: string;
    name: string;
    content_type: string;
    file_size: number;
    md5: string;
    expires_at: string;
    source_ip?: string;
}

export interface PcoTransport {
    /**
     * Sends an authenticated request and returns the parsed JSON body (`undefined` for 204).
     * Throws a `PcoApiError` subclass for non-2xx responses after retries.
     */
    request<T = unknown>(req: PcoRequest): Promise<T>;
    /** Uploads a file to `https://upload.planningcenteronline.com/v2/files`. */
    upload(file: Blob | ArrayBuffer | Uint8Array, options?: UploadOptions): Promise<UploadedFile>;
}
