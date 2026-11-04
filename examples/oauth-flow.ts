/**
 * A complete Planning Center OAuth flow with PKCE, using only node:http.
 *
 * Shows: `createPkceChallenge()`, `getAuthorizationUrl()` with `state`, `exchangeCodeForToken()`,
 * persisting tokens, and a client that refreshes (and rotates) tokens automatically through
 * `onTokenRefresh`.
 *
 * Set up:
 *
 *     1. Create an OAuth application at https://api.planningcenteronline.com/oauth/applications
 *        with the redirect URI http://localhost:3000/auth/complete
 *     2. export PCO_CLIENT_ID=...  PCO_CLIENT_SECRET=...
 *     3. npx tsx examples/oauth-flow.ts
 *     4. Open http://localhost:3000 and authorize.
 *
 * Tokens are saved to .pco-tokens.json in the current directory (git-ignore it). A real app
 * would store them per user in a database, and keep `state`/`codeVerifier` in a session.
 *
 * In your own project, import from '@mackenly/planningcenterkit' and
 * '@mackenly/planningcenterkit/oauth' instead of '../src/...'.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import process from 'node:process';
import { PlanningCenter } from '../src/index.js';
import {
    createPkceChallenge,
    exchangeCodeForToken,
    getAuthorizationUrl,
    type OAuthTokens,
} from '../src/entries/oauth.js';

const clientId = process.env.PCO_CLIENT_ID ?? '';
const clientSecret = process.env.PCO_CLIENT_SECRET ?? '';
const port = 3000;
const redirectUri = `http://localhost:${port}/auth/complete`;
const tokenFile = '.pco-tokens.json';

if (!clientId || !clientSecret) {
    console.error('Set PCO_CLIENT_ID and PCO_CLIENT_SECRET first.');
    process.exit(1);
}

/** Pending authorizations, keyed by `state`. Use a session store in a real app. */
const pending = new Map<string, { codeVerifier: string }>();

/** Only what is needed to rebuild the client later. */
interface StoredTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
}

async function saveTokens(tokens: OAuthTokens): Promise<void> {
    const stored: StoredTokens = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
    };
    await writeFile(tokenFile, JSON.stringify(stored, null, 2), { mode: 0o600 });
}

async function loadTokens(): Promise<StoredTokens | undefined> {
    try {
        return JSON.parse(await readFile(tokenFile, 'utf8')) as StoredTokens;
    } catch {
        return undefined;
    }
}

/** Builds a client from stored tokens. Refresh tokens rotate, so every refresh is persisted. */
function clientFor(tokens: StoredTokens): PlanningCenter {
    return new PlanningCenter({
        auth: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt,
            clientId,
            clientSecret,
            onTokenRefresh: saveTokens,
        },
    });
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`);
    const html = (status: number, body: string) => {
        res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(body);
    };

    try {
        if (url.pathname === '/') {
            const stored = await loadTokens();
            if (stored) {
                const { data: me } = await clientFor(stored).request<{ data: { attributes: { name: string } } }>({
                    method: 'GET',
                    path: '/people/v2/me',
                });
                return html(200, `<p>Signed in as ${escapeHtml(me.attributes.name)}.</p><p><a href="/login">Re-authorize</a></p>`);
            }
            return html(200, '<p><a href="/login">Connect Planning Center</a></p>');
        }

        if (url.pathname === '/login') {
            const { codeVerifier, codeChallenge } = await createPkceChallenge();
            const state = crypto.randomUUID();
            pending.set(state, { codeVerifier });
            const location = getAuthorizationUrl({
                clientId,
                redirectUri,
                scopes: ['people', 'services'],
                state,
                codeChallenge,
            });
            res.writeHead(302, { Location: location });
            return res.end();
        }

        if (url.pathname === '/auth/complete') {
            const error = url.searchParams.get('error');
            if (error) return html(400, `<p>Authorization was denied: ${escapeHtml(error)}</p>`);
            const state = url.searchParams.get('state') ?? '';
            const code = url.searchParams.get('code') ?? '';
            const session = pending.get(state);
            if (!session || !code) return html(400, '<p>Unknown or expired login attempt. <a href="/login">Try again</a>.</p>');
            pending.delete(state);

            const tokens = await exchangeCodeForToken({
                clientId,
                clientSecret,
                code,
                redirectUri,
                codeVerifier: session.codeVerifier,
            });
            await saveTokens(tokens);
            res.writeHead(302, { Location: '/' });
            return res.end();
        }

        html(404, '<p>Not found</p>');
    } catch (err) {
        console.error(err);
        html(500, `<pre>${escapeHtml(String(err))}</pre>`);
    }
});

server.listen(port, () => console.log(`Open http://localhost:${port}`));

function escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
