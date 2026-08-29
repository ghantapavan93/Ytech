import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Vitest resolves the same `@/` alias the app does.
 *
 * Until now every test sat in lib/ and imported its subject relatively, so
 * this never came up. The moment a test covered a component, the alias
 * inside that component failed to resolve and the suite would not even load.
 * Mirroring tsconfig's paths here keeps the two in step.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
