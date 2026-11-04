# Releasing

Every release is cut by the **Node.js CI/CD** workflow (`.github/workflows/ci-publish.yml`) on
`main`. Its `publish` job builds the package, bumps the version in `package.json` with
[phips28/gh-action-bump-version](https://github.com/phips28/gh-action-bump-version) (commit
`ci: version bump to vX.Y.Z` plus a `vX.Y.Z` tag), publishes to GitHub Packages and to npm (npm
trusted publishing with provenance, no token), and creates a GitHub release with generated notes.

Releases run one at a time (concurrency group `release-main`, shared with the spec refresh), so a
release and a spec refresh never push to `main` at the same moment.

There are three ways a release starts.

## 1. Pushing to `main` (human commits)

Any push to `main` that touches something other than Markdown files releases. The bump level comes
from keywords in the pushed commit messages (substring match, case-sensitive):

| Level | Triggered by |
| --- | --- |
| major | `BREAKING CHANGE` or `bump-major` anywhere in a message, or a conventional `type!:` / `type(scope)!:` subject |
| minor | `feat:`, `feat(` or `bump-minor` anywhere in a message |
| patch | anything else (the default) |

Major wins over minor, minor over patch, across all commits in the push. Write messages with
that in mind:

- Keywords match as substrings, which is why minor needs `feat:` or `feat(` rather than bare
  `feat` (that would also match `feature`, e.g. a merge commit saying `from mackenly/feature/x`).
  Use squash merges with a deliberate title when the level matters.
- Commits containing `ci: version bump to v...` are skipped (that's the bump commit itself).
- Docs-only pushes (`**/*.md`) don't run the workflow at all.

## 2. Running the workflow manually

Actions > **Node.js CI/CD** > **Run workflow** on `main`, with `version_type`:

- `auto` (default): same keyword rules as above, but a manual run has no pushed commits to read, so
  `auto` always means **patch**.
- `patch`, `minor`, `major`: releases exactly that level, ignoring keywords.

Use this to fix a release that got the wrong level from its commit messages (release again with the
right level), or to release something that was pushed with `GITHUB_TOKEN` and therefore didn't
trigger the workflow.

From the command line: `gh workflow run ci-publish.yml --ref main -f version_type=minor`.

## 3. The automatic spec refresh

**Refresh Planning Center spec** (`.github/workflows/refresh-spec.yml`) runs every Monday (and on
demand). It downloads Planning Center's API documentation into `spec/`, regenerates
`src/generated/`, and runs `npm run check` (typecheck, tests, build). If the check fails, or if
anything outside `spec/` and `src/generated/` changed, the run fails and nothing is committed or
released.

Then `scripts/spec-diff.ts` compares the committed spec (`HEAD:spec/`) with the fresh one and
classifies the change by its effect on the generated TypeScript API:

| Level | Meaning |
| --- | --- |
| major | Something consumers may rely on was removed or changed: a product, resource, root edge or edge; an attribute or its type; an include, where field or operator, order field, filter, or action; a writable (create/update) field or its type; a capability going from allowed to not (`canCreate`/`canUpdate`/`canDelete`); an edge switching between a single resource and a collection; an exported type name; a request path; or a product's pinned API version (that changes the `X-PCO-API-Version` header sent, so responses can change). |
| minor | Only additions. |
| patch | Only documentation (descriptions, notes, deprecation flags, examples) or spec metadata that doesn't reach the generated API. |
| none | No difference. |

What happens next depends on the level:

- **none**: the run ends.
- **patch / minor**: the workflow commits `spec/` and `src/generated/` straight to `main` as
  `chore(spec): refresh Planning Center API spec (<level>)` and then dispatches **Node.js CI/CD**
  with `version_type=<level>` and the **Docs** workflow. (Pushes made with `GITHUB_TOKEN` don't
  trigger `push` workflows, so the workflow dispatches them explicitly; `workflow_dispatch` is
  allowed.) If `main` moved while the refresh ran, the push fails and nothing is released; the
  next run tries again.
- **major**: never released automatically. The workflow force-pushes branch
  `chore/refresh-pco-spec` and opens (or updates) a pull request titled
  `chore(spec)!: refresh Planning Center API spec (BREAKING CHANGE)` whose body lists the changes.
  To release it:
  1. Close and reopen the PR so CI runs (PRs opened by `GITHUB_TOKEN` don't trigger CI).
  2. Review the breaking changes and add a CHANGELOG.md entry.
  3. **Squash-merge, keeping the title.** `BREAKING CHANGE` (and the `!:`) in the commit message
     makes the push release a major version.
  4. If the merge commit lost the keyword, run **Node.js CI/CD** manually with
     `version_type=major`.

Run `npm run spec:diff` locally after `npm run spec:fetch` to see the same classification
(`--json` or `--markdown` for machine or PR-ready output; `--base <dir>` / `--head <dir>` to compare
two snapshot directories).

The classifier models what `scripts/generate.ts` emits. When the generator starts exposing
something new from the spec, teach `scripts/spec-diff.ts` about it too;
`test/scripts/spec-diff.test.ts` checks the model against the committed `src/generated/` output.

### Repository settings the refresh needs

- Settings > Actions > General > Workflow permissions: allow GitHub Actions to create and approve
  pull requests (for the major path).
- `main` must accept pushes from `github-actions[bot]` (it isn't branch-protected today). If you
  protect `main` later, the patch/minor path will fail to push; either allow the bot to bypass the
  rule or switch that path to a pull request.

## Cutting 1.0.0

`feature/v1-rewrite` replaces the 0.x API, so its first release must be a major (0.4.x -> 1.0.0).
Either:

- merge it with a commit message (squash title or merge commit body) that contains `bump-major`
  (or `BREAKING CHANGE`), for example `feat!: v1 rewrite (bump-major)`; or
- merge it however you like, then immediately run **Node.js CI/CD** manually with
  `version_type=major`. Note that the merge push itself releases first (a patch, unless the
  message has a keyword), so prefer the keyword route if you want 1.0.0 to be the first release
  from the new code.

After 1.0.0, the weekly refresh takes over for Planning Center changes and keywords for everything
else.
