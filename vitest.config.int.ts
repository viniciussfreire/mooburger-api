import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.test.ts"],
		globals: true,
		root: "./",

		passWithNoTests: true,
	},
	plugins: [
		swc.vite({
			module: { type: "es6" },
		}),
		tsConfigPaths(),
	],
});
