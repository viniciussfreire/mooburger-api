import { flushPgTables } from "./postgres";

beforeEach(async () => {
	await flushPgTables();
});
