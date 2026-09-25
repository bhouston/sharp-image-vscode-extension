#!/usr/bin/env node
// Prepares a universal build: bundles sharp plus every platform-specific
// sharp binary package into dist/node_modules, where Node's module
// resolution finds them automatically from dist/extension.js (it checks
// <dir>/node_modules before walking up to the project root).
//
// Versions are read from sharp's own optionalDependencies to stay in sync
// automatically whenever sharp is upgraded.
//
// npm (not pnpm) is used to resolve these packages, and in an isolated
// scratch directory rather than this project's own node_modules: npm's
// arborist crashes ("Cannot read properties of null (reading 'matches')")
// when it dedupes against pnpm's symlinked node_modules layout, and pnpm
// itself refuses to place binaries for platforms other than the current
// one. The result is real, non-symlinked directories.
//
// Packaging (see package.json's `package` script) uses `vsce package
// --no-dependencies`: vsce's own npm-based dependency detection
// (`npm list --production`) reliably returns zero files in this repo's
// sandboxed environment (verified: identical `npm list`/glob calls work
// fine standalone, but return nothing when vsce's collectAllFiles runs
// them) -- `--no-dependencies` avoids that codepath entirely and packages
// dist/** (including dist/node_modules) directly.

'use strict';

const { execSync } = require('child_process');
const { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync, mkdirSync } = require('fs');
const { resolve, join } = require('path');
const { tmpdir } = require('os');

const projectRoot = resolve(__dirname, '..');
const sharpPkg = JSON.parse(readFileSync(resolve(projectRoot, 'node_modules/sharp/package.json'), 'utf8'));
const optDeps = sharpPkg.optionalDependencies ?? {};

// The platforms we want bundled. Covers Windows x64, macOS arm64/x64, Linux x64/arm64.
const desiredImgPackages = [
  '@img/sharp-darwin-arm64',
  '@img/sharp-libvips-darwin-arm64',
  '@img/sharp-darwin-x64',
  '@img/sharp-libvips-darwin-x64',
  '@img/sharp-linux-x64',
  '@img/sharp-libvips-linux-x64',
  '@img/sharp-linux-arm64',
  '@img/sharp-libvips-linux-arm64',
  '@img/sharp-win32-x64',
].filter((pkg) => optDeps[pkg]);

const installSpecs = [`sharp@${sharpPkg.version}`, ...desiredImgPackages.map((pkg) => `${pkg}@${optDeps[pkg]}`)];

console.log('Installing sharp + platform-specific packages for a universal build:');
installSpecs.forEach((pkg) => console.log(`  ${pkg}`));

const scratchDir = mkdtempSync(join(tmpdir(), 'sharp-platform-install-'));
writeFileSync(join(scratchDir, 'package.json'), '{}\n');

const bundledModulesDir = resolve(projectRoot, 'dist/node_modules');
rmSync(bundledModulesDir, { recursive: true, force: true });
mkdirSync(bundledModulesDir, { recursive: true });

try {
  execSync(`npm install --force --no-save ${installSpecs.join(' ')}`, { cwd: scratchDir, stdio: 'inherit' });
  // Skip node_modules/.bin: CLI shims aren't needed (sharp is required
  // programmatically) and confuse vsce's packaging/secret-scanning step.
  cpSync(join(scratchDir, 'node_modules'), bundledModulesDir, {
    recursive: true,
    filter: (src) => !src.includes(`${join('node_modules', '.bin')}`),
  });
} finally {
  rmSync(scratchDir, { recursive: true, force: true });
}

console.log(`\nsharp and all platform packages are bundled at ${bundledModulesDir}.`);
