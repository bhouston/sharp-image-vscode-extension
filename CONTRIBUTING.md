# Contributing

Shared workflow for human contributors and coding agents (Claude, Codex).
`AGENTS.md` and `CLAUDE.md` point here; keep the standard in this file only.

## Issue → branch → PR

1. Before implementing a feature or fix, open a GitHub issue (or reuse a
   matching existing one). Include a description, motivation, and acceptance
   criteria.
2. Branch from current `origin/main`, named `<type>/<issue>-<short-description>`,
   e.g. `feat/12-avif-quality-option`. Never commit directly to `main`.
3. Use Conventional Commits for every commit: `type(scope): description`.
   Types: `feat`, `fix`, `perf`, `docs`, `chore`, `refactor`, `test`, `style`,
   `build`, `ci`, `revert`. Husky's `commit-msg` hook checks this locally via
   commitlint; CI does not re-check it.
4. Run the checks below and fix any failures before requesting review.
5. Push the branch and open a PR against `main`, with a Conventional Commit
   title and `Closes #<issue>` in the body. PRs are merged with merge commits
   (`gh pr merge --merge`); never squash or rebase-merge.

`feat` triggers a minor release; `fix` and `perf` trigger a patch. A `!` after
the type/scope or a `BREAKING CHANGE:` footer triggers a major release.
Other types do not release on their own.

## Local checks

Use pnpm (version pinned in `package.json`'s `packageManager` field), then
install dependencies. This enables Husky's pre-commit and commit-msg hooks.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm tsc
pnpm lint
```

There is no test script in this repo yet.

## Releases

Releases are cut manually from `main` via
`gh workflow run release.yml --ref main`, never automatically on push or
merge. Semantic Release analyzes Conventional Commits since the last tag,
then builds, packages, and publishes the `.vsix` to the VS Code Marketplace
and Open VSX Registry. See [RELEASING.md](RELEASING.md) for setup and
mechanics.
