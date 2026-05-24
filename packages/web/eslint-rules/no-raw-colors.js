/**
 * Custom ESLint rule: forbid raw colors in JSX className strings and other
 * string literals in .tsx files.
 *
 * Flags:
 *   - Hex colors:    #abc, #aabbcc, #aabbccdd
 *   - rgb / rgba:    rgb(…), rgba(…)
 *   - hsl / hsla:    hsl(…), hsla(…)
 *   - Tailwind raw palette utilities in JSX: bg-zinc-700, text-gray-500,
 *     border-slate-300, ring-red-500, ... and their dark: variants.
 *
 * Allowed:
 *   - bg-black/X, bg-white/X (opacity overlays — used for backdrops)
 *   - text-white, text-black (legitimate for buttons on primary surface)
 *
 * Tokens to use instead (see DESIGN_SYSTEM.md):
 *   bg-background, bg-card, bg-popover, bg-muted, bg-accent,
 *   bg-primary, bg-secondary, bg-destructive, bg-success, bg-warning,
 *   text-foreground, text-muted-foreground, text-primary-foreground,
 *   border-border, border-input, ring-ring
 */
"use strict";

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const RGB_RE = /\brgba?\(/;
const HSL_RE = /\bhsla?\(/;
// Tailwind raw palette colors with explicit shades (avoiding token classes).
// Anchored to a word boundary or whitespace boundary, supports dark: variants.
const PALETTE_RE =
  /(?:(?:^|\s|:)|(?:hover|focus|active|disabled|group-hover|dark|md|sm|lg|xl|focus-visible):)(?:bg|text|border|ring|fill|stroke|from|via|to|placeholder|caret|accent|outline|decoration|divide)-(?:zinc|gray|slate|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

function hasRawColor(value) {
  if (typeof value !== "string") return false;
  if (HEX_RE.test(value)) return true;
  if (RGB_RE.test(value)) return true;
  if (HSL_RE.test(value)) return true;
  if (PALETTE_RE.test(value)) return true;
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw color values in JSX className and other string literals. Use design tokens instead (see DESIGN_SYSTEM.md).",
    },
    messages: {
      rawColor:
        "Raw color detected: `{{ snippet }}`. Use design tokens (bg-primary, text-muted-foreground, border-border, …). See DESIGN_SYSTEM.md.",
    },
    schema: [],
  },
  create(context) {
    function check(node, value) {
      if (typeof value !== "string") return;
      if (!hasRawColor(value)) return;
      const m =
        value.match(HEX_RE) ||
        value.match(RGB_RE) ||
        value.match(HSL_RE) ||
        value.match(PALETTE_RE);
      const snippet = (m && m[0]) || value.slice(0, 40);
      context.report({
        node,
        messageId: "rawColor",
        data: { snippet },
      });
    }

    return {
      Literal(node) {
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value && node.value.cooked);
      },
    };
  },
};
