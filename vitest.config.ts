import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // tests/e2e/** are Playwright specs, not Vitest — Vitest's default
    // glob (**/*.spec.ts) picks them up too, and Playwright's test()
    // can't run inside Vitest's runner. Keep the two suites apart.
    exclude: ["**/node_modules/**", "tests/e2e/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
