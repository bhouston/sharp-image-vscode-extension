import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fsModuleCache: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
    },
  },
});
