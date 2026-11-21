import { defineConfig } from 'vitest/config';

/**
 * Live tests against a real Planning Center organization. Read-only. They skip unless
 * PCO_TEST_CLIENT_ID and PCO_TEST_SECRET (a personal access token) are set.
 *
 *     PCO_TEST_CLIENT_ID=... PCO_TEST_SECRET=... npm run test:live
 */
export default defineConfig({
    test: {
        include: ['test/live/**/*.live.ts'],
        testTimeout: 180_000,
        hookTimeout: 60_000,
        // One file at a time so the whole run shares the organization's rate limit politely.
        fileParallelism: false,
    },
});
