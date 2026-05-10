import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Pre-existing imperative style in BookClient/CheckoutClient/ProfileClient
      // hits these every other line — keep visible but non-blocking until the
      // BookClient -> JSX migration tracked in SECURITY_REVIEW.md lands.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      // Security — eval-style sinks (always errors)
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      // Security — defensive defaults
      "no-prototype-builtins": "error",
      "no-restricted-globals": [
        "error",
        {
          name: "eval",
          message: "Avoid eval — security and CSP risk.",
        },
      ],

      // Force devs to think before opening new innerHTML usage. The
      // existing imperative renderers in BookClient/CheckoutClient are
      // grandfathered via inline-disable comments, but no NEW innerHTML
      // assignments should land without review.
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "AssignmentExpression[left.property.name='innerHTML']",
          message:
            "Avoid assigning to innerHTML. Use JSX or escapeHtml() from src/lib/escapeHtml.ts.",
        },
        {
          selector: "CallExpression[callee.name='setTimeout'][arguments.0.type='Literal']",
          message: "setTimeout with a string argument is implied eval.",
        },
        {
          selector: "CallExpression[callee.name='setInterval'][arguments.0.type='Literal']",
          message: "setInterval with a string argument is implied eval.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/legacy/**",
  ]),
]);

export default eslintConfig;
