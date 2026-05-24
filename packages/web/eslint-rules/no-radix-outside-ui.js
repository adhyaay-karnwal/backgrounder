/**
 * Custom ESLint rule: forbid direct imports of low-level UI libraries outside
 * `components/ui/`. All consumers must use the canonical primitives.
 *
 * Forbidden imports outside `components/ui/`:
 *   - @radix-ui/*
 *   - cmdk
 *   - vaul
 *   - sonner
 *
 * Use instead:
 *   import { Dialog, DialogContent, … } from "@/components/ui/dialog"
 *   import { Button } from "@/components/ui/button"
 *   import { toast } from "sonner" // toast() itself is fine; only Toaster
 *                                  // must be the one from @/components/ui/sonner
 */
"use strict";

const FORBIDDEN = [
  /^@radix-ui\//,
  /^cmdk$/,
  /^vaul$/,
];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow direct imports of @radix-ui/*, cmdk, and vaul outside components/ui/. Use the canonical primitives.",
    },
    messages: {
      forbidden:
        "Do not import `{{ name }}` outside components/ui. Use the corresponding primitive from @/components/ui/* instead. See DESIGN_SYSTEM.md.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename();
    // Only enforce outside components/ui/ and components/modals/
    // (the latter contains legacy modal scaffolding still being migrated to
    // the canonical Dialog primitive).
    if (
      filename.includes("/components/ui/") ||
      filename.includes("\\components\\ui\\") ||
      filename.includes("/components/modals/") ||
      filename.includes("\\components\\modals\\") ||
      filename.includes("/eslint-rules/") ||
      filename.includes("/components/scheduled-jobs/ScheduledJobForm.")
    ) {
      return {};
    }

    function check(node, name) {
      if (typeof name !== "string") return;
      for (const re of FORBIDDEN) {
        if (re.test(name)) {
          context.report({ node, messageId: "forbidden", data: { name } });
          return;
        }
      }
    }

    return {
      ImportDeclaration(node) {
        check(node.source, node.source.value);
      },
      CallExpression(node) {
        // require("@radix-ui/...")
        if (
          node.callee &&
          node.callee.name === "require" &&
          node.arguments[0] &&
          node.arguments[0].type === "Literal"
        ) {
          check(node.arguments[0], node.arguments[0].value);
        }
      },
    };
  },
};
