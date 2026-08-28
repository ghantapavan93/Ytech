import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["node_modules/**", ".next/**", ".next-build/**", "next-env.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // no-duplicate-imports is type-import-unaware: it flags the
      // deliberate `import type {...}` / `import {...}` split as a
      // duplicate. TypeScript's own verbatim module syntax wants that split,
      // so the rule costs more than it catches here.
      "no-duplicate-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // `const { secret, ...rest } = obj` is how you omit a key. The
          // binding is meant to be unused.
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
