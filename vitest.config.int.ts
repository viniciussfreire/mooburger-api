import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"@": "./src",
			"@test": "./test",
		},
		include: ["**/*.test.ts"],
		globals: true,
		root: "./",
	},
	plugins: [swc.vite()],
	resolve: {
		alias: {
			"@": "./src",
			"@test": "./test",
		},
	},
});
