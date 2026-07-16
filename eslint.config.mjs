import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The Laravel API has no published types: boundary normalizers
      // (lib/orders.ts, lib/products.ts, …) accept `any` then return typed models.
      '@typescript-eslint/no-explicit-any': 'off',
      // French UI copy is dense with apostrophes (l', d', n', aujourd'hui…).
      // JSX renders a literal `'` correctly, so escaping every one adds noise
      // without benefit. Keep the rule for the genuinely ambiguous characters.
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    },
  },
  {
    // React-Compiler-oriented rules (eslint-plugin-react-hooks v6, newly enabled
    // by eslint-config-next 16) flag long-standing patterns in vendored shadcn/ui
    // primitives and pre-existing back-office screens. New marketplace code must
    // satisfy them as errors; these legacy/vendored files — outside the scope of
    // this change — are grandfathered to warnings to avoid risky rewrites.
    files: [
      'components/ui/**',
      'hooks/use-mobile.ts',
      'app/admin/**',
      'app/**/checkout/confirmation/**',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
