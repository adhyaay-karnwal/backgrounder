# Design System

This app uses a Terragon-styled design system. Every visual choice — colors,
type, spacing, radius, motion, primitive components — flows from this file
and the tokens defined in `app/globals.css`.

**Audience**: contributors (human and AI) editing UI in `packages/web/`.

**Source of truth**:
- Tokens: [`app/globals.css`](./app/globals.css)
- Primitives: [`components/ui/*`](./components/ui)
- Layout primitives: [`components/layout/*`](./components/layout)
- Terragon audit reference: [`.design/terragon-tokens.md`](./.design/terragon-tokens.md)

---

## Principles

1. **Tokens, not hex.** Reach for `bg-primary`, `text-muted-foreground`,
   `border-border`, `bg-card`, `text-destructive`. Never write `bg-blue-600`,
   `#1e88e5`, or `rgb(...)` in JSX or CSS files outside `globals.css`.
2. **Primitives, not Radix.** Import from `@/components/ui/*`. Never import
   `@radix-ui/*` directly outside `components/ui/`.
3. **Hairline borders, restrained motion.** Surfaces lean on a single 1px
   `border-border` and `shadow-xs/sm`. Reserve heavier shadows for floating
   surfaces (popovers, dialogs).
4. **One typeface family.** `Geist` for everything except code (`Geist Mono`).
5. **Dark mode parity.** Every screen must look intentional in both themes.
   Use tokens; they invert correctly.

---

## Tokens

All tokens are defined in `:root` (light) and `.dark` blocks in `globals.css`,
then bridged into Tailwind v4 utilities via the `@theme inline` block.

### Color (semantic)

| Utility | Meaning | When to use |
|---|---|---|
| `bg-background` / `text-foreground` | App canvas | Body, page surfaces |
| `bg-card` / `text-card-foreground` | Card surface | Boxes, panels |
| `bg-popover` / `text-popover-foreground` | Floating surface | Dropdowns, popovers, dialogs |
| `bg-primary` / `text-primary-foreground` | Brand | Primary actions, links, focus rings |
| `bg-secondary` / `text-secondary-foreground` | Tonal | Tags, soft chips |
| `bg-muted` / `text-muted-foreground` | Quiet | Helper text, placeholders, inactive |
| `bg-accent` / `text-accent-foreground` | Hover/active | Menu item hover, selected state |
| `bg-destructive` / `text-destructive-foreground` | Danger | Delete/discard CTA |
| `bg-success` `bg-warning` `bg-info` | Status | Tags, banners |
| `border-border`, `border-input`, `ring-ring` | Edges | Hairlines, focus rings |
| `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, `bg-sidebar-accent` | Sidebar chrome | Side navigation |
| `bg-chart-1..5` | Categorical | Recharts series |

### Radius

- `rounded-sm` (4px) — small affordances
- `rounded-md` (6px) — buttons, inputs, menu items
- `rounded-lg` (8px) — dialogs, prominent containers
- `rounded-xl` (12px) — Cards, command palettes
- `rounded-full` — Badges, avatars, dot indicators

### Shadow / elevation

- `shadow-xs` — flat controls (inputs, buttons baseline)
- `shadow-sm` — Cards
- `shadow-md` — Popovers, dropdowns
- `shadow-lg` — Dialogs, sheets
- Do not use `drop-shadow-*` or arbitrary hsl shadows.

### Typography

- Body / UI → `font-sans` (Geist)
- Code, IDs, kbd → `font-mono` (Geist Mono)
- Sizes: `text-xs`, `text-sm` (default), `text-base` (mobile inputs),
  `text-lg` (dialog titles), `text-xl/2xl` (page headings)
- Weights: `font-medium` (default), `font-semibold` (titles, active tab)

### Motion

- `transition-colors` (default), `transition-[color,box-shadow]` (inputs)
- Use the `animate-in / animate-out / fade-*` / `zoom-*` / `slide-in-from-*`
  utilities provided by `tw-animate-css` for entry/exit (already imported
  globally).
- Custom keyframes in `globals.css`: `animate-fade-in`, `animate-blink`,
  `animate-shine`, `animate-shimmer`, `animate-slide-down`, etc.
- Durations: `--duration-fast` (120ms), `--duration-base` (200ms),
  `--duration-slow` (320ms). Use the matching Tailwind `duration-200` etc.

---

## Primitives

All live under `@/components/ui/`. Import only from there.

| Component | Use for |
|---|---|
| `Button` | Any clickable that performs an action |
| `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) | Bounded surface |
| `Badge` | Small status / tag chips |
| `Input`, `Textarea`, `Label` | Form fields |
| `Select` (+ `SelectTrigger`, `SelectContent`, `SelectItem`, …) | Single-value dropdown |
| `Dialog` (+ `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, …) | Modal |
| `Sheet` | Side drawer (desktop / mobile) |
| `Popover` | Anchored floating content |
| `DropdownMenu` | Action menu |
| `Command` (+ `CommandDialog`, `CommandInput`, `CommandList`, …) | Command palette / search |
| `Tooltip` | Optional helper hint on hover |
| `Tabs` | Horizontal tab navigation |
| `Skeleton` | Loading placeholder |
| `Avatar`, `AvatarImage`, `AvatarFallback` | User pictures |
| `Separator` | Divider |
| `ScrollArea` | Styled scroll viewport |
| `Kbd` | Keyboard hint chip |
| `Toaster` (sonner) | Toasts — mounted once in `app/layout.tsx`; trigger with `import { toast } from "sonner"` |

### Button

```tsx
<Button>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon"><X /></Button>
<Button asChild><Link href="/...">Open</Link></Button>
```

Variants: `default | destructive | outline | secondary | ghost | link`
Sizes: `default | xs | sm | lg | icon`

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Usage</CardTitle>
    <CardDescription>This month's activity.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter className="border-t"><Button>View all</Button></CardFooter>
</Card>
```

### Dialog

Compose with `DialogContent` rather than wiring a Radix `Dialog.Root` inline.
For modals that share the "header with close X + content + footer" pattern,
use the canonical `DialogContent` — it includes the close button and ESC
handling for free.

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    …content…
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Layout primitives

Live under `@/components/layout/`.

```tsx
<AppShell>
  <AppShell.Sidebar>…</AppShell.Sidebar>
  <AppShell.Main>
    <PageHeader title="Jobs" description="…" actions={<Button>New</Button>} />
    {jobs.length === 0 ? (
      <EmptyState title="No jobs yet" action={<Button>Create job</Button>} />
    ) : (
      <DataTable … />
    )}
  </AppShell.Main>
</AppShell>
```

Loading patterns: `LoadingList`, `LoadingMessages`, `LoadingTable`.

---

## Do / don't

| ❌ Don't | ✅ Do |
|---|---|
| `className="bg-blue-600 text-white"` | `<Button variant="default">` |
| `className="bg-white dark:bg-zinc-900 border border-gray-200"` | `<Card>` or `className="bg-card border border-border"` |
| `className="text-gray-500"` | `className="text-muted-foreground"` |
| `style={{ color: "#2e7d32" }}` | `className="text-primary"` |
| `import * as Dialog from "@radix-ui/react-dialog"` outside `components/ui/` | `import { Dialog, DialogContent } from "@/components/ui/dialog"` |
| `<button className="px-3 py-1.5 bg-primary …">Save</button>` | `<Button>Save</Button>` |
| Adding `@tailwindcss/forms` or a third-party UI kit | Extend a primitive in `components/ui/` |
| Adding a new top-level color in JSX | Add a token in `globals.css` (both modes) + `@theme inline`, then use the utility |

---

## Accessibility checklist

- All interactive elements have visible `focus-visible:ring-ring/50 ring-[3px]` (built into primitives).
- Touch targets are ≥ 44×44 (add the `touch-target` utility for atypical hits).
- Provide `aria-label` on icon-only buttons (`<Button size="icon" aria-label="Close">`).
- Color is never the only signal — pair status colors with icon or text.
- Test contrast: foreground on background, primary-foreground on primary, etc. (axe DevTools).

---

## Adding a new primitive

Only do this when an existing primitive can't be composed. Steps:

1. Justify in PR description what couldn't be done with existing primitives.
2. Match Terragon's shadcn "new-york" style if a parallel exists upstream.
3. Use CVA for variants; `cn` for class merging.
4. Document the variants here.
5. Add a JSDoc summary at the top of the file.

---

## Adding a new token

1. Add the CSS variable to **both** `:root` and `.dark` in `globals.css`.
2. Add the matching `--color-…` (or `--shadow-…`, `--radius-…`) to the
   `@theme inline` block so Tailwind generates the utility.
3. Document it in the table above.

Never reference an OKLCH/hex literal outside `globals.css`.

---

## Enforcement

- `npm run lint` runs ESLint (rules in `eslint.config.mjs`).
- `npm run lint:design` runs only the design-system rules (raw colors,
  Radix-outside-ui). Run before pushing UI changes.
- CI rejects PRs that violate these rules.
