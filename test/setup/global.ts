import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

import { createPgContainer, runPgMigrations } from "./postgres";

let pgContainer: StartedPostgreSqlContainer;

const startPgContainer = async (): Promise<void> => {
	console.log("🤖 - Starting Postgres container...");

	const container = await createPgContainer();

	pgContainer = container;
	process.env.DATABASE_URL = pgContainer
		.getConnectionUri()
		.concat("?connection_limit=1");

	console.log("🤖 - Postgres container started");
};

const stopPgContainer = async (): Promise<void> => {
	console.log("🤖 - Stopping Postgres container...");

	await pgContainer.stop();

	console.log("🤖 - Postgres container stopped");
};

export async function setup(): Promise<void> {
	await Promise.all([startPgContainer()]);

	await runPgMigrations();
}

export async function teardown(): Promise<void> {
	await Promise.all([stopPgContainer()]);
}
