// Smoke-tests the built docs site (site/dist) as the deployed Worker serves it.
//
//   npm run docs:build && npm run docs:smoke
//   node scripts/docs-smoke.ts --url http://127.0.0.1:8787   # test a server that's already running
//
// Without --url it starts `wrangler dev` on the build (fully local: no Cloudflare account is
// needed) and stops it at the end. Pages render on request, so a passing `astro build` doesn't
// prove they work; this does. It checks:
//
// - every page in the sitemap returns HTML with one <h1>, and its Markdown version (`index.md`
//   and `Accept: text/markdown`) is served;
// - every same-site link, script, stylesheet and image on those pages resolves, including
//   `#fragment` targets on other pages;
// - the agent surface: llms.txt, llms-full.txt, Agent Skills, and the MCP server at /mcp;
// - search assets, robots.txt, the OG image, and a real 404 for a missing page.
//
// Exits 1 and lists every failure if anything is wrong.

import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SITE_DIR = fileURLToPath(new URL('../site/', import.meta.url));
// The production origin. Absolute links to it are checked against the local server instead.
const PROD_ORIGIN = 'https://planningcenterkit.mackenly.com';
const CONCURRENCY = 16;

const failures: string[] = [];
function fail(message: string): void {
	failures.push(message);
}

function argValue(name: string): string | undefined {
	const i = process.argv.indexOf(name);
	return i === -1 ? undefined : process.argv[i + 1];
}

async function startWrangler(port: number): Promise<{ base: string; child: ChildProcess }> {
	const child = spawn('npx', ['wrangler', 'dev', '--port', String(port), '--ip', '127.0.0.1'], {
		cwd: SITE_DIR,
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
		detached: true,
	});
	let log = '';
	child.stdout?.on('data', (d: Buffer) => (log += d.toString()));
	child.stderr?.on('data', (d: Buffer) => (log += d.toString()));
	const base = `http://127.0.0.1:${port}`;
	const deadline = Date.now() + 90_000;
	while (Date.now() < deadline) {
		if (child.exitCode !== null) throw new Error(`wrangler dev exited early:\n${log}`);
		try {
			await fetch(base + '/', { signal: AbortSignal.timeout(2_000) });
			return { base, child };
		} catch {
			await new Promise((r) => setTimeout(r, 500));
		}
	}
	stop(child);
	throw new Error(`wrangler dev didn't start within 90s:\n${log}`);
}

function stop(child: ChildProcess): void {
	// Kill the whole process group: npx -> wrangler -> workerd.
	try {
		if (child.pid) process.kill(-child.pid, 'SIGTERM');
	} catch {
		child.kill('SIGTERM');
	}
}

async function mapLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
	let next = 0;
	const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (next < items.length) await fn(items[next++]!);
	});
	await Promise.all(workers);
}

/** Decodes the few entities Astro emits in attribute values. */
function decodeAttr(value: string): string {
	return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

/** Same-site URLs referenced by href/src/srcset on a page, without their fragment. */
function references(html: string, pageUrl: URL, base: string): { url: string; fragment: string }[] {
	const out: { url: string; fragment: string }[] = [];
	const attrs = html.matchAll(/\s(?:href|src|srcset)="([^"]*)"/g);
	for (const [, raw] of attrs) {
		for (const candidate of decodeAttr(raw!).split(',')) {
			const ref = candidate.trim().split(/\s+/)[0];
			if (!ref || ref.startsWith('data:') || ref.startsWith('mailto:') || ref.startsWith('javascript:')) continue;
			let url: URL;
			try {
				url = new URL(ref.startsWith(PROD_ORIGIN) ? base + ref.slice(PROD_ORIGIN.length) : ref, pageUrl);
			} catch {
				fail(`${pageUrl.pathname}: unparseable link "${ref}"`);
				continue;
			}
			if (url.origin !== base) continue;
			const fragment = decodeURIComponent(url.hash.slice(1));
			url.hash = '';
			out.push({ url: url.href, fragment });
		}
	}
	return out;
}

function hasId(html: string, id: string): boolean {
	const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return new RegExp(`\\s(?:id|name)="${escaped}"`).test(html);
}

async function get(url: string, init?: RequestInit): Promise<Response> {
	return fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30_000), ...init });
}

async function checkPages(base: string): Promise<void> {
	const index = await (await get(`${base}/sitemap-index.xml`)).text();
	const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(PROD_ORIGIN, base));
	const pages: string[] = [];
	for (const sitemap of sitemaps) {
		const res = await get(sitemap);
		if (!res.ok) {
			fail(`${sitemap}: ${res.status}`);
			continue;
		}
		for (const m of (await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) pages.push(m[1]!.replace(PROD_ORIGIN, base));
	}
	if (pages.length < 50) fail(`sitemap lists only ${pages.length} pages; expected the guides plus ~280 reference pages`);
	for (const required of ['/', '/guides/getting-started/', '/reference/']) {
		if (!pages.includes(base + required)) fail(`sitemap is missing ${required}`);
	}

	// Fetched HTML, kept so fragment links can be checked against their target page.
	const html = new Map<string, string>();
	// url -> pages that reference it, plus the fragments they point at.
	const refs = new Map<string, { from: Set<string>; fragments: Map<string, string> }>();

	await mapLimit(pages, CONCURRENCY, async (page) => {
		const path = new URL(page).pathname;
		const res = await get(page);
		const type = res.headers.get('content-type') ?? '';
		if (res.status !== 200 || !type.includes('text/html')) {
			fail(`${path}: ${res.status} ${type}`);
			return;
		}
		const body = await res.text();
		html.set(page, body);
		const h1s = body.match(/<h1[\s>]/g)?.length ?? 0;
		if (h1s !== 1) fail(`${path}: ${h1s} <h1> elements, expected 1`);
		if (!/<title>[^<]+<\/title>/.test(body)) fail(`${path}: missing <title>`);
		for (const { url, fragment } of references(body, new URL(page), base)) {
			let entry = refs.get(url);
			if (!entry) refs.set(url, (entry = { from: new Set(), fragments: new Map() }));
			entry.from.add(path);
			if (fragment) entry.fragments.set(fragment, path);
		}

		const md = await get(new URL('index.md', page.endsWith('/') ? page : page + '/').href);
		if (md.status !== 200 || !md.headers.get('content-type')?.includes('text/markdown')) {
			fail(`${path}index.md: ${md.status} ${md.headers.get('content-type')}`);
		}
		await md.body?.cancel();
	});

	await mapLimit([...refs.keys()], CONCURRENCY, async (url) => {
		const entry = refs.get(url)!;
		const where = `(linked from ${[...entry.from].slice(0, 3).join(', ')}${entry.from.size > 3 ? ', ...' : ''})`;
		let body = html.get(url);
		if (body === undefined) {
			const res = await get(url);
			if (res.status >= 300 && res.status < 400) {
				// A redirect is fine as long as its target resolves.
				const location = res.headers.get('location');
				const target = location ? await get(new URL(location, url).href) : undefined;
				await target?.body?.cancel();
				if (!target?.ok) fail(`${new URL(url).pathname}: redirects to a broken target ${where}`);
				return;
			}
			if (!res.ok) {
				fail(`${new URL(url).pathname}: ${res.status} ${where}`);
				await res.body?.cancel();
				return;
			}
			body = entry.fragments.size > 0 && res.headers.get('content-type')?.includes('text/html') ? await res.text() : '';
			if (!body) await res.body?.cancel();
		}
		if (!body) return;
		for (const [fragment, from] of entry.fragments) {
			if (fragment === 'main-content' || fragment === 'top') continue;
			if (!hasId(body, fragment)) fail(`${new URL(url).pathname}#${fragment}: no element with that id (linked from ${from})`);
		}
	});

	console.log(`Checked ${pages.length} pages and ${refs.size} same-site links.`);
}

async function expect(base: string, path: string, status: number, type: string, contains?: string, init?: RequestInit): Promise<string> {
	const res = await get(base + path, init);
	const body = await res.text();
	const got = res.headers.get('content-type') ?? '';
	if (res.status !== status) fail(`${path}: status ${res.status}, expected ${status}`);
	else if (!got.includes(type)) fail(`${path}: content-type "${got}", expected ${type}`);
	else if (contains && !body.includes(contains)) fail(`${path}: response doesn't contain "${contains}"`);
	return body;
}

async function checkSurface(base: string): Promise<void> {
	await expect(base, '/llms.txt', 200, 'text/plain', '/guides/llms.txt');
	await expect(base, '/llms-full.txt', 200, 'text/plain', 'planningcenterkit');
	await expect(base, '/robots.txt', 200, 'text/plain', 'Sitemap:');
	await expect(base, '/og.png', 200, 'image/png');
	await expect(base, '/pagefind/pagefind.js', 200, 'javascript');
	await expect(base, '/this-page-does-not-exist/', 404, 'text/html');
	await expect(base, '/guides/getting-started/', 200, 'text/markdown', '# ', { headers: { accept: 'text/markdown' } });

	const skills = await expect(base, '/.well-known/agent-skills/index.json', 200, 'json');
	try {
		const names = JSON.stringify(JSON.parse(skills));
		for (const name of ['planningcenterkit', 'planningcenterkit-oauth', 'planningcenterkit-webhooks']) {
			if (!names.includes(name)) fail(`agent-skills/index.json doesn't list ${name}`);
			else await expect(base, `/.well-known/agent-skills/${name}/SKILL.md`, 200, '', 'name:');
		}
	} catch {
		fail('agent-skills/index.json is not valid JSON');
	}

	// The remote MCP server: list its tools, then fetch a page through it.
	const rpc = async (id: number, method: string, params: unknown): Promise<any> => {
		const res = await get(`${base}/mcp`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
			body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
		});
		const text = await res.text();
		if (!res.ok) throw new Error(`${method}: ${res.status} ${text.slice(0, 200)}`);
		// Either a JSON body or a single SSE `data:` event.
		const json = text.trimStart().startsWith('{') ? text : (text.match(/^data: (.*)$/m)?.[1] ?? '');
		const message = JSON.parse(json);
		if (message.error) throw new Error(`${method}: ${JSON.stringify(message.error)}`);
		return message.result;
	};
	try {
		const { tools } = await rpc(1, 'tools/list', {});
		const names: string[] = tools.map((t: { name: string }) => t.name);
		if (!names.includes('get_page')) fail(`/mcp: tools/list has no get_page tool (got ${names.join(', ')})`);
		else {
			const result = await rpc(2, 'tools/call', { name: 'get_page', arguments: { url: '/guides/getting-started/' } });
			if (result.isError || !JSON.stringify(result.content ?? result).includes('planningcenterkit')) {
				fail(`/mcp: get_page for /guides/getting-started/ returned ${JSON.stringify(result).slice(0, 200)}`);
			}
		}
	} catch (err) {
		fail(`/mcp: ${(err as Error).message}`);
	}
}

const given = argValue('--url');
const server = given ? undefined : await startWrangler(Number(argValue('--port') ?? 8799));
const base = (given ?? server!.base).replace(/\/$/, '');
try {
	console.log(`Smoke-testing the docs at ${base}`);
	await checkSurface(base);
	await checkPages(base);
} finally {
	if (server) stop(server.child);
}

if (failures.length) {
	console.error(`\n${failures.length} problem(s):`);
	for (const f of failures.sort()) console.error(`  - ${f}`);
	process.exit(1);
}
console.log('Docs smoke test passed.');
