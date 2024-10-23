import { flushPgTables } from "./postgres";

beforeAll(async () => {
	await flushPgTables();
});
