// Flat ESLint config — design-system enforcement.
//
// Two custom rules:
//   - design/no-raw-colors        — forbid hex, rgb(), hsl(), and raw
//                                   Tailwind palette utilities (bg-zinc-700)
//   - design/no-radix-outside-ui  — forbid @radix-ui / cmdk / vaul imports
//                                   outside components/ui/ and components/modals/
//
// Plugin stubs (react-hooks, next) are loaded only so existing
// `// eslint-disable-next-line` directives don't error. The rules are off —
// this config is design-only; full TS/React linting is out of scope for now.

import tsParser from "@typescript-eslint/parser"
import reactHooks from "eslint-plugin-react-hooks"
import next from "@next/eslint-plugin-next"

import designRules from "./eslint-rules/index.js"

export default [
  {
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

      // Tokens — these MUST contain raw colors.
      "app/globals.css",

      // Native canvas / xterm APIs require literal hex.
      "lib/file-preview/PdfPreview.tsx",
      "lib/file-preview/TextThumbnail.tsx",
      "lib/file-preview/MarkdownPreview.tsx",
      "lib/plugins/panels/terminal.tsx",

      // Recharts tooltip styles are inline JS objects (CSS-var migration TBD).
      "components/admin/charts/**",

      // OAuth callback HTML pages return literal HTML/CSS strings.
      "app/api/auth/electron-callback/route.ts",
      "app/api/mcp/connect/github/callback/route.ts",
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
      "react-hooks": reactHooks,
      "@next/next": next,
    },
    rules: {
      "design/no-raw-colors": "error",
      "design/no-radix-outside-ui": "error",
      // Defined as off so existing `eslint-disable-next-line` comments are valid.
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
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
    // `themeColor` literals required by the PWA spec.
    files: ["app/layout.tsx"],
    rules: {
      "design/no-raw-colors": "off",
    },
  },
  {
    files: ["eslint-rules/**/*.js"],
    rules: {
      "design/no-raw-colors": "off",
    },
  },
]
