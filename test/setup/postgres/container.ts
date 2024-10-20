import {
	PostgreSqlContainer,
	type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import { findOpenPort } from "@test/utils";

export const createPgContainer =
	async (): Promise<StartedPostgreSqlContainer> => {
		const openPort = await findOpenPort();

		return await new PostgreSqlContainer()
			.withDatabase("mooburger")
			.withUsername("admin")
			.withPassword("admin")
			.withExposedPorts({
				host: openPort,
				container: 5432,
			})
			.start();
	};
