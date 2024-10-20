import { Logger } from "@nestjs/common";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

import { createPgContainer } from "./postgres";

const logger = new Logger("GlobalSetup");

// Containers
let pgContainer: StartedPostgreSqlContainer;

const startPgContainer = async () => {
	logger.log("🏗️ - Starting Postgres container!");

	const container = await createPgContainer();

	pgContainer = container;
	process.env.DATABASE_URL = pgContainer
		.getConnectionUri()
		.concat("?connection_limit=1");

	logger.log("🏗️ - Postgres container started!");
};

const stopPgContainer = async () => {
	logger.log("🏗️ - Stopping Postgres container!");

	await pgContainer.stop();

	logger.log("🏗️ - Postgres container stopped!");
};

export async function setup() {
	await Promise.all([startPgContainer()]);
}

export async function teardown() {
	await Promise.all([stopPgContainer()]);
}
