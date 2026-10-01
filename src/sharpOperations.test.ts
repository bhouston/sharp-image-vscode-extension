import fs from 'node:fs';
import Module, { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';

// Runs the compiled dist/ output (what ships), not the TS source, so a tsc
// interop misconfiguration like `sharp_1.default is not a function` is caught.
type Loader = { _load: (...args: unknown[]) => unknown };
const M = Module as unknown as Loader;

it('applyEdit works from the compiled build', async () => {
  const errors: unknown[] = [];
  const load = M._load;
  M._load = function (this: unknown, request: unknown, ...rest: unknown[]) {
    if (request === 'vscode') {
      return {
        workspace: { getConfiguration: () => ({ get: (_k: string, d: unknown) => d }) },
        window: { showErrorMessage: (m: unknown) => errors.push(m), showInformationMessage: () => undefined },
      };
    }
    return load.call(this, request, ...rest);
  };
  try {
    const require = createRequire(import.meta.url);
    const sharp = require('sharp');
    const ops = require(path.resolve(__dirname, '../dist/sharpOperations.js'));
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sharp-')), 'a.png');
    await sharp({ create: { width: 4, height: 4, channels: 3, background: 'red' } }).toFile(file);
    await ops.applyEdit({ fsPath: file }, 'flip');
    expect(errors).toEqual([]);
  } finally {
    M._load = load;
  }
});
