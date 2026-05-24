# UI rules for `packages/web`

Read [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) before editing UI code.

## Must follow

1. **Import primitives from `@/components/ui/*` only.** Never import from
   `@radix-ui/*`, `cmdk`, `vaul`, or `sonner` directly outside that folder.
   ESLint will flag it.
2. **Never use raw colors** in JSX `className` or in `.css` files (except
   `globals.css`). Reach for tokens: `bg-card`, `text-muted-foreground`,
   `border-border`, `bg-primary`, `text-destructive`, etc.
   - ❌ `bg-zinc-900`, `text-gray-500`, `#1e88e5`, `rgb(…)`, `bg-blue-600`
   - ✅ `bg-card`, `text-muted-foreground`, `bg-primary`
3. **Adding a color requires adding a token**, not inlining a hex. Edit
   both `:root` and `.dark` in `globals.css` plus the `@theme inline` block.
4. **Replace inline `<button>` with `<Button>`.** If a clickable element is
   currently `<button className="px-3 py-1.5 bg-…">…</button>`, swap it
   for the canonical `Button` primitive from `@/components/ui/button`.
5. **Run `npm run lint:design` before pushing UI changes.**

## Layout primitives

Use `@/components/layout`:
- `AppShell` (+ `.Sidebar`, `.Main`) — root layout chrome.
- `PageHeader` — page title + actions row.
- `EmptyState` — empty list / no-data screens.
- `LoadingList`, `LoadingMessages`, `LoadingTable` — loading skeletons.

## When unsure

Look at how an existing primitive does it (`components/ui/dialog.tsx`,
`components/ui/button.tsx`) and copy that pattern. The design language is
modeled on the Terragon Labs OSS repo — see `.design/terragon-tokens.md`
for the full audit.
