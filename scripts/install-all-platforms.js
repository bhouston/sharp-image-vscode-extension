#!/usr/bin/env node
// Installs all major platform-specific sharp packages so that a single
// universal VSIX can be built and used on any platform.
//
// Versions are read from sharp's own optionalDependencies to stay in sync
// automatically whenever sharp is upgraded.

'use strict';

const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const sharpPkg = JSON.parse(
  readFileSync(resolve(__dirname, '../node_modules/sharp/package.json'), 'utf8')
);
const optDeps = sharpPkg.optionalDependencies ?? {};

// The platforms we want bundled. Covers Windows x64, macOS arm64/x64, Linux x64/arm64.
const desired = [
  '@img/sharp-darwin-arm64',
  '@img/sharp-libvips-darwin-arm64',
  '@img/sharp-darwin-x64',
  '@img/sharp-libvips-darwin-x64',
  '@img/sharp-linux-x64',
  '@img/sharp-libvips-linux-x64',
  '@img/sharp-linux-arm64',
  '@img/sharp-libvips-linux-arm64',
  '@img/sharp-win32-x64',
];

const packages = desired
  .filter((pkg) => optDeps[pkg])
  .map((pkg) => `${pkg}@${optDeps[pkg]}`);

console.log('Installing platform-specific sharp packages for universal build:');
packages.forEach((pkg) => console.log(`  ${pkg}`));

execSync(`npm install --force --no-save ${packages.join(' ')}`, { stdio: 'inherit' });

console.log('\nAll platform packages installed.');
