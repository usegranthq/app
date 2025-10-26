import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: './tests/setup.ts',
    exclude: [...configDefaults.exclude, '.next/**'],
  },
});
