import { afterEach, describe, expect, it, vi } from 'vitest';
import { PcoApiError, PcoRateLimitError, PcoValidationError } from '../../src/core/errors.js';

const rateLimited = (retryAfter: string) =>
    PcoApiError.from({ status: 429, method: 'GET', url: '/x', headers: new Headers({ 'Retry-After': retryAfter }) }) as PcoRateLimitError;

describe('PcoRateLimitError.retryAfter', () => {
    afterEach(() => vi.useRealTimers());

    it('reads seconds', () => {
        expect(rateLimited('19').retryAfter).toBe(19);
    });

    it('reads an HTTP date', () => {
        vi.useFakeTimers({ now: new Date('2026-11-02T12:00:00Z') });
        expect(rateLimited('Mon, 02 Nov 2026 12:00:30 GMT').retryAfter).toBe(30);
    });

    it('ignores garbage', () => {
        expect(rateLimited('soon').retryAfter).toBeUndefined();
    });
});

describe('PcoValidationError.fieldErrors', () => {
    it('groups messages by attribute', () => {
        const error = PcoApiError.from({
            status: 422,
            method: 'POST',
            url: '/people/v2/people',
            errors: [
                { detail: "can't be blank", source: { pointer: '/data/attributes/first_name' } },
                { detail: 'is too long', source: { pointer: '/data/attributes/first_name' } },
                { detail: 'is invalid' },
            ],
        });
        expect(error).toBeInstanceOf(PcoValidationError);
        expect((error as PcoValidationError).fieldErrors).toEqual({ first_name: ["can't be blank", 'is too long'], base: ['is invalid'] });
    });
});

describe('error hints', () => {
    it('decodes Planning Center hints into the message', () => {
        const error = PcoApiError.from({ status: 401, method: 'GET', url: '/x', errors: [{ title: 'Unauthorized', detail: 'BABOON' }] });
        expect(error.hint).toBe('BABOON');
        expect(error.message).toContain('expired');
    });
});
