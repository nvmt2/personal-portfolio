import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin, so only add its recommended rules.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // Keep last so it turns off every rule that conflicts with Prettier.
  prettier,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'pnpm-lock.yaml']),
]);
