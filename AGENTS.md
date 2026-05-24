# Agent instructions

Primary reference for coding agents working in this repo.

- **Tests** (unit tests, database for E2E, Playwright): [TESTING.md](./TESTING.md)
- **Development server** (`npm run dev`): [DEVELOPMENT.md](./DEVELOPMENT.md)
- **UI / design system** (`packages/web`): [`packages/web/DESIGN_SYSTEM.md`](./packages/web/DESIGN_SYSTEM.md) and [`packages/web/CLAUDE.md`](./packages/web/CLAUDE.md)

For **architecture, deployment, and production configuration**, see the root [README.md](./README.md).

## After editing code

Before running typecheck for the first time (or after pulling new changes), ensure dependencies are installed:

```bash
npm install
cd packages/web && npx prisma generate
```

Then run `npm run typecheck` to verify there are no type errors. This is much faster than a full build (~5 seconds vs 2-3 minutes).

## When editing UI in `packages/web`

The design system is dark/light token-driven and modeled on Terragon Labs OSS. Hard rules — enforced by ESLint:

1. **Use primitives**, never Radix directly. Import from `@/components/ui/*` and `@/components/layout/*`. `import * as Dialog from "@radix-ui/react-dialog"` outside `components/ui/` will fail lint.
2. **Use tokens**, never raw colors. `bg-primary`, `text-muted-foreground`, `border-border` — not `bg-blue-600` / `text-gray-500` / `#1e88e5`.
3. **Adding a new color requires editing `app/globals.css`** (both `:root` and `.dark`) plus the `@theme inline` block — never inline.
4. Run `npm run lint:design` in `packages/web/` before pushing UI changes.

Full reference: [`packages/web/DESIGN_SYSTEM.md`](./packages/web/DESIGN_SYSTEM.md).
