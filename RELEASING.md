# Releases

## Running a release

Releases are never triggered by pushes or merges to `main`. When ready to publish, the maintainer dispatches the workflow:

```sh
gh workflow run release.yml --ref main
```

Add `-f dry_run=true` to validate versioning and the changelog without publishing or tagging. The workflow refuses to run against any ref other than `main`. If there are no release-worthy commits since the last tag, the run succeeds as a no-op and says so in the run summary.

## One-time activation

The workflow is installed in `.github/workflows/release.yml` and requires two repository secrets:

- `VSCE_PAT` — an Azure DevOps personal access token for the `benhouston3d` publisher, used to publish to the VS Code Marketplace.
- `OVSX_PAT` — an Open VSX access token, used to publish to the Open VSX Registry (the registry Cursor and other VS Code-compatible editors use).

Both are already configured. Dispatch `Release` on `main` (see above) when ready to publish.

## Versioning and artifacts

Semantic-release analyzes [Conventional Commits](https://www.conventionalcommits.org/) since the last `v*` tag. `feat` produces a minor release, `fix`/`perf` a patch, and `!` or `BREAKING CHANGE:` a major. The highest change wins. A docs/chore-only integration produces no release. There is no prior `v*` tag in this repository, so the first release establishes the baseline version from the commit history.

`release.config.mjs` pins `package.json`'s `version` to the release version, then builds, packages (`vsce package`, via the existing `pnpm run package`), and publishes the resulting `.vsix` to the VS Code Marketplace and Open VSX Registry (`scripts/release-vscode-extension.mjs`). The extension is not published to npm — there is no npm package in this repository.

Each GitHub Release contains generated release notes and the `.vsix`. Releases never write back to `main`; the [GitHub Releases page](https://github.com/bhouston/sharp-image-vscode-extension/releases) is the changelog of record — there is no `CHANGELOG.md`.

The release job waits for the complete CI suite (`ci.yml`, reused via `workflow_call`) and only runs from a manual dispatch against `main`.

## Validation

Dispatching `release.yml` with `dry_run=true` runs the full workflow — including CI — and previews what semantic-release would do, without publishing or tagging.

## Commit messages

Commits on `main` should follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) — this is enforced locally by a Husky `commit-msg` hook running `commitlint` (`commitlint.config.mjs`).
