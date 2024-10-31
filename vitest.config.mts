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
				statements: 80,
				branches: 80,
				functions: 80,
				lines: 80,
			},
			exclude: ["**/index.ts", "**/*.module.ts", "*vitest*"],
		},
	},
	plugins: [
		swc.vite({
			module: { type: "es6" },
		}),
		tsConfigPaths(),
	],
});
