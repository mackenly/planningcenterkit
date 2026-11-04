---
name: planningcenterkit-oauth
description: Implement Planning Center OAuth with @mackenly/planningcenterkit. Covers the authorization code flow with PKCE (S256) and state, exchanging the code, scopes, persisting rotating refresh tokens with onTokenRefresh, automatic refresh, manual refresh, revoke and introspect, handling invalid_grant, and one client per user.
---

# Planning Center OAuth with Planning Center Kit

Use OAuth for apps that other organizations connect to; for your own organization's scripts, a personal access token (`{ applicationId, secret }`) is simpler. Keep client secrets and tokens on the server.

Full guide: https://planningcenterkit.mackenly.com/guides/authentication/

## 1. Redirect to Planning Center

```ts
import { createPkceChallenge, getAuthorizationUrl } from '@mackenly/planningcenterkit/oauth';

const { codeVerifier, codeChallenge } = await createPkceChallenge();
const state = crypto.randomUUID();
await saveSession({ state, codeVerifier }); // encrypted cookie, KV, database: never in the URL
const url = getAuthorizationUrl({
    clientId: process.env.PCO_CLIENT_ID!,
    redirectUri: 'https://example.com/auth/complete', // must match the app's settings exactly
    scopes: ['people', 'services'],
    state,
    codeChallenge, // S256 is the only method Planning Center supports
});
return Response.redirect(url, 302);
```

Scopes are product names: `api`, `calendar`, `check_ins`, `giving`, `groups`, `home`, `people`, `publishing`, `registrations`, `resources`, `services`, plus `openid` for an `id_token` (`PCO_OAUTH_SCOPES`). The Webhooks API needs no scope. Optional: `nonce`, `prompt: 'login' | 'select_account'`.

## 2. Handle the redirect

```ts
import { exchangeCodeForToken } from '@mackenly/planningcenterkit/oauth';

const params = new URL(request.url).searchParams;
const session = await loadSession(params.get('state')); // reject an unknown or missing state
if (!session) return new Response('Unknown login attempt', { status: 400 });
const tokens = await exchangeCodeForToken({
    clientId: process.env.PCO_CLIENT_ID!,
    clientSecret: process.env.PCO_CLIENT_SECRET!, // public apps (no secret) must use PKCE and omit this
    code: params.get('code')!,
    redirectUri: 'https://example.com/auth/complete',
    codeVerifier: session.codeVerifier,
});
await saveTokens(userId, tokens); // { accessToken, refreshToken, expiresAt (ms), scope, tokenType, idToken, raw }
```

## 3. Use the tokens, and persist every rotation

```ts
import { PlanningCenter } from '@mackenly/planningcenterkit';

const pco = new PlanningCenter({
    auth: {
        accessToken: saved.accessToken,
        refreshToken: saved.refreshToken,
        expiresAt: saved.expiresAt, // ms since epoch, or a Date
        clientId: process.env.PCO_CLIENT_ID!,
        clientSecret: process.env.PCO_CLIENT_SECRET!,
        onTokenRefresh: (fresh) => saveTokens(userId, fresh),
    },
});
```

- `refreshToken`, `clientId`, and `clientSecret` go together (all three or none). The client refreshes about a minute before `expiresAt` and once after a `401`, then replays the request; concurrent requests share one refresh.
- **Refresh tokens rotate**: each refresh invalidates the previous refresh token. Always persist the new tokens in `onTokenRefresh`, or the next process start holds a dead token and the user must authorize again. If `onTokenRefresh` throws, the triggering request fails with that error.
- Access tokens last 2 hours; refresh tokens up to 90 days.
- Create one client per user or organization and cache it; with several processes, serialize refreshes per user (for example with a lock) so two processes don't both spend the same refresh token.

## Failures and other helpers

```ts
import { PcoOAuthError } from '@mackenly/planningcenterkit';
import { introspectToken, refreshAccessToken, revokeToken } from '@mackenly/planningcenterkit/oauth';

try {
    await pco.people.people.list();
} catch (err) {
    if (err instanceof PcoOAuthError && err.error === 'invalid_grant') {
        // refresh token used or revoked: send the user through the flow again
    }
    throw err;
}

const fresh = await refreshAccessToken({ clientId, clientSecret, refreshToken }); // persist it: the old refresh token is dead
await revokeToken({ clientId, clientSecret, token: fresh.refreshToken!, tokenTypeHint: 'refresh_token' }); // disconnect
const { active, scope } = await introspectToken({ clientId, clientSecret, token: fresh.accessToken });
```

`normalizeTokens(raw)` converts a stored raw token response (`access_token`, `expires_in`, `created_at`, ...). Every helper accepts `fetch`, `baseUrl`, and `signal`. An error hint of `PELICAN` means a missing scope (re-authorize with it); `CAPUCHIN` means the user revoked access.

Runnable server: https://github.com/mackenly/planningcenterkit/blob/main/examples/oauth-flow.ts
