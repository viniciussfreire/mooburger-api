import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"@": "./src",
			"@test": "./test",
		},
		include: ["**/*.spec.ts"],
		globals: true,
		root: "./",

		coverage: {
			reporter: ["text", "json", "html"],
			thresholds: {
				statements: 70,
				branches: 70,
				functions: 70,
				lines: 70,
			},
		},
	},
	plugins: [
		swc.vite({
			module: { type: "es6" },
		}),
	],
	resolve: {
		alias: {
			"@": "./src",
			"@test": "./test",
		},
	},
});
