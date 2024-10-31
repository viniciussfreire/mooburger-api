import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    globals: true,
    root: "./",

    passWithNoTests: true,

    coverage: {
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
      exclude: ["./dist", "**/index.ts", "**/*.module.ts", "*vitest*", "**/__tests__"],
    },
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
    tsConfigPaths(),
  ],
});
