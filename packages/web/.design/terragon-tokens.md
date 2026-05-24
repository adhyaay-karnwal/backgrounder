# Terragon Design Tokens (audited from `terragon-labs/terragon-oss@83142a1`)

Source of truth: `apps/www/src/app/globals.css` + `apps/www/src/components/ui/*` (shadcn "new-york" style on Radix).

## Stack

- **Framework**: Next.js 15 App Router + Tailwind v4 (`@tailwindcss/postcss`)
- **Primitives**: shadcn/ui (`components.json` → `style: "new-york"`, `baseColor: "neutral"`)
- **Radix**: full set — `dialog`, `dropdown-menu`, `popover`, `select`, `scroll-area`, `tabs`, `tooltip`, `avatar`, `separator`, `slot`, `label`, `checkbox`, `switch`, `progress`, `radio-group`, `collapsible`
- **Helpers**: `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`
- **Icons**: `lucide-react`
- **Animation**: `tw-animate-css` (for `animate-in/out/fade-in-0/zoom-in-95/...`) + `framer-motion` for complex
- **Toasts**: `sonner` (themed via CSS vars)
- **Drawer**: `vaul` (mobile only)
- **Command**: `cmdk`
- **Fonts**: Google Fonts — `Geist` (sans, 100-900), `Geist Mono` (mono), `Cabin` (display, dark mode accent), `Merriweather` (serif)

## Color tokens (raw hex)

### Light (default)
| Token | Value | Notes |
|---|---|---|
| `--background` | `#f8f5f0` | warm cream |
| `--foreground` | `#3e2723` | deep brown text |
| `--card` | `#f8f5f0` | same as bg |
| `--card-foreground` | `#3e2723` | |
| `--popover` | `#f8f5f0` | |
| `--popover-foreground` | `#3e2723` | |
| `--primary` | `#2e7d32` | forest green |
| `--primary-foreground` | `#ffffff` | |
| `--secondary` | `#e8f5e9` | pale mint |
| `--secondary-foreground` | `#1b5e20` | |
| `--muted` | `#f0e9e0` | warm beige |
| `--muted-foreground` | `#6d4c41` | warm brown |
| `--disabled` | `#d4cec4` | |
| `--accent` | `#c8e6c9` | mint accent |
| `--accent-foreground` | `#1b5e20` | |
| `--destructive` | `#c62828` | |
| `--destructive-foreground` | `#ffffff` | |
| `--border` | `#e0d6c9` | warm tan |
| `--input` | `#e0d6c9` | same as border |
| `--ring` | `#2e7d32` | focus ring |
| `--sidebar` | `#fcfaf8` | slightly lighter than bg |
| `--sidebar-foreground` | `#3e2723` | |
| `--sidebar-primary` | `#2e7d32` | |
| `--sidebar-accent` | `#f5f2ed` | hover |
| `--sidebar-border` | `#e8e0d6` | |
| `--chart-1..5` | `#4caf50`, `#388e3c`, `#2e7d32`, `#1b5e20`, `#0a1f0c` | green ramp |

### Dark
| Token | Value |
|---|---|
| `--background` | `#1a1a1a` |
| `--foreground` | `#f0ebe5` |
| `--card` / `--popover` | `#242424` |
| `--primary` | `#4caf50` |
| `--primary-foreground` | `#0a1f0c` |
| `--secondary` | `#333333` |
| `--secondary-foreground` | `#d7e0d6` |
| `--muted` | `#2a2a2a` |
| `--muted-foreground` | `#d7cfc4` |
| `--accent` | `#2e7d32` |
| `--accent-foreground` | `#ffffff` |
| `--destructive` | `#dc2626` |
| `--border` / `--input` | `#4a4a4a` |
| `--ring` | `#4caf50` |
| `--sidebar` | `#161616` |
| `--sidebar-accent` | `#202020` |
| `--sidebar-border` | `#4a4a4a` |
| `--chart-1..5` | `#81c784`, `#66bb6a`, `#4caf50`, `#43a047`, `#388e3c` |

## Typography

- `--font-sans` → `Geist`
- `--font-mono` → `Geist Mono`
- `--font-serif` → `Merriweather`
- `--font-cabin` → `Cabin` (dark mode display accent)
- Body: `font-sans antialiased`
- Numerics & code: `font-mono`

## Radius

- `--radius` = `0.5rem` (8px)
- `--radius-sm` = `calc(var(--radius) - 4px)` → 4px
- `--radius-md` = `calc(var(--radius) - 2px)` → 6px
- `--radius-lg` = `var(--radius)` → 8px
- `--radius-xl` = `calc(var(--radius) + 4px)` → 12px
- `Card` uses `rounded-xl`; buttons/inputs use `rounded-md`; badges `rounded-full`; small affordances `rounded-sm`/`rounded-xs`

## Shadows

```css
--shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-xs:  0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-sm:  0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow:     0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow-md:  0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
--shadow-lg:  0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
--shadow-xl:  0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
--shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
```

Buttons, inputs, cards: `shadow-xs` baseline. Modals/popovers: `shadow-md`/`shadow-lg`.

## Breakpoints

- `--breakpoint-xs: 24rem` (extra small) added; rest are Tailwind defaults.

## Component shape (key signatures)

### Button
- Base: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all`
- Focus: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Disabled: `disabled:bg-disabled disabled:text-muted-foreground disabled:opacity-50`
- Variants: `default | destructive | outline | secondary | ghost | link`
- Sizes: `default(h-9 px-4) | xs(h-7 px-2.5) | sm(h-8 px-3) | lg(h-10 px-6) | icon(size-9)`
- Hover treatment is `bg-primary/90` (etc.) — soft, not full color shift
- Outline variant special-cases dark: `dark:bg-input/30 dark:border-input dark:hover:bg-input/50`

### Card
- `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`
- `CardHeader` uses `@container/card-header` queries + `[.border-b]:pb-6` trick
- Subparts: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`

### Badge
- `rounded-full border px-2.5 py-0.5 text-xs font-semibold`
- Variants: `default | secondary | destructive | outline`

### Input/Textarea
- `border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow]`
- Focus: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Invalid: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`
- Dark: `dark:bg-input/30`
- iOS-zoom-safe: `text-base md:text-sm` (16px ≥ on mobile)

### Dialog
- Overlay: `fixed inset-0 z-50 bg-black/50` + `fade-in/out` animation
- Content: `fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg overflow-hidden`
- Built-in close button top-right with `XIcon`; opt-out via `hideCloseButton`
- ESC handling stops propagation (so global ESC handlers don't fire)

### Tooltip
- `bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs`
- Disabled entirely on touch devices via `useTouchDevice()` hook

### Tabs
- Underline style: `border-b-2 border-b-transparent ... data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:font-bold`

### Sheet
- 4 sides; `bg-background border` + slide-in-from-{side} animations

### Sonner toaster
```tsx
style={{
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
}}
```

## Layout & feel

- **Light is the default** (warm cream/brown), **dark is grayscale-warm**
- Dense but breathable — `gap-2/4`, `px-3/4/6` are the workhorses
- Hairline borders everywhere (no heavy shadows on chrome); shadows reserved for floating surfaces
- Rounded `xl` on cards, `md` on controls — feels modern, not playful
- Subtle: `animate-in fade-in-0 zoom-in-95 slide-in-from-*` on every popover/dialog/sheet/dropdown
- Mono is used sparingly (kbd, ids, code) — sans (Geist) is the default voice

## Custom animations (worth porting)

- `fade-in` (entry, 0.5s)
- `loading-progress` (10s linear infinite — for top progress bars)
- `loading-complete` (snap to 100%)
- `blink` (1s ease, for cursors)
- `shimmer-once` (hover flash, 0.6s)
- `animate-shine` (text gradient sweep, 2s linear infinite, uses `color-mix`)
- `rotate-in-from-top` (0.5s, for cycling text headlines)
- `infinite-scroll-col1/2/3` (35/40/45s, marquees)
- `slide-down`/`slide-up` (0.3s, accordions)

## Base layer

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  html { @apply bg-background; }
  body {
    @apply bg-background text-foreground;
    padding-top: env(safe-area-inset-top);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
  }
  /* Standalone PWA tweaks */
  @media (display-mode: standalone) {
    .chat-prompt-box { padding-bottom: 2rem; }
    .sidebar-footer-pwa { padding-bottom: calc(0.5rem + env(safe-area-inset-bottom)); }
  }
  /* Hard focus outlines */
  button:focus-visible,
  [role="combobox"]:focus-visible,
  [role="button"]:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    @apply outline-2 outline-offset-2 outline-primary;
  }
}
```

## Decisions for our app

1. **Adopt Terragon's palette wholesale**, including light-cream-as-default + dark mode. Replace all OKLCH tokens.
2. **Add `tw-animate-css`** to power `animate-in/out` utilities (required for shadcn-style animations).
3. **Add new Radix peers**: `react-tooltip`, `react-tabs`, `react-avatar`, `react-separator`, `react-slot`.
4. **Add `sonner`** for toasts (replaces ad-hoc patterns).
5. **Keep fonts as Google web fonts (Geist + Geist Mono)** for parity — drop Inter / JetBrains Mono.
6. **Preserve our load-bearing mobile/iOS CSS** (lines 244-401 of current `globals.css`).
7. **Drop `--card`/`--popover` from being the same as `--background`** as Terragon does for light, but keep slight elevation tint for dark (`#242424`).
8. **Use `font-cabin` only if needed for a display headline** — likely skip for now.
