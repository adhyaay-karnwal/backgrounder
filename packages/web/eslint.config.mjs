// Flat ESLint config for the design-system lint pass.
//
// Two custom rules enforce the design system in TSX/CSS:
//   - design/no-raw-colors        — forbid hex, rgb(), hsl(), and raw
//                                   Tailwind palette utilities (bg-zinc-700)
//   - design/no-radix-outside-ui  — forbid @radix-ui / cmdk / vaul imports
//                                   outside packages/web/components/ui/

import tsParser from "@typescript-eslint/parser"

import designRules from "./eslint-rules/index.js"

export default [
  {
    // Existing files contain `eslint-disable-next-line react-hooks/exhaustive-deps`
    // comments. We don't load that plugin in this config (this is the
    // design-system-only pass), so suppress the "rule not found" noise.
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "out/**",
      "playwright-report/**",
      "test-results/**",
      "prisma/generated/**",
      "**/*.d.ts",
      // Tokens live here — they MUST contain raw colors.
      "app/globals.css",
    ],
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      design: designRules,
    },
    rules: {
      "design/no-raw-colors": "error",
      "design/no-radix-outside-ui": "error",
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: {
      design: designRules,
    },
    rules: {
      "design/no-raw-colors": "error",
      "design/no-radix-outside-ui": "error",
    },
  },
  {
    // Don't run no-raw-colors on the eslint rule files themselves — they
    // contain the regexes for raw colors as string literals.
    files: ["eslint-rules/**/*.js"],
    rules: {
      "design/no-raw-colors": "off",
    },
  },
]
