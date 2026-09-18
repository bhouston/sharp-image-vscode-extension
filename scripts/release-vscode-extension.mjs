import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Pin package.json to the version semantic-release computed for this release.
export function setVersion(version) {
  const pkgFile = resolve('package.json');
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
  pkg.version = version;
  writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`);
}

// Build, package, and publish the extension to both the VS Code Marketplace
// and Open VSX (the registry Cursor and other VS Code-compatible editors
// use). Requires VSCE_PAT / OVSX_PAT in the environment.
export function publish() {
  // "pnpm run package" already runs compile + install-all-platforms + vsce package.
  execFileSync('pnpm', ['run', 'package'], { stdio: 'inherit' });
  const { name, version } = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
  const vsix = resolve(`${name}-${version}.vsix`);
  execFileSync('npx', ['vsce', 'publish', '--packagePath', vsix, '--pat', process.env.VSCE_PAT], {
    stdio: 'inherit',
  });
  execFileSync('npx', ['ovsx', 'publish', vsix, '--pat', process.env.OVSX_PAT], { stdio: 'inherit' });
}
