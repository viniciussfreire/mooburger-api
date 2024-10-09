import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { GetEnvService } from "./shared/config/env/services";

async function bootstrap() {
	const logger = new Logger("ServerBootstrap");

	const app = await NestFactory.create(AppModule);

	const envs = await app.resolve(GetEnvService);

	await app.listen(envs.get("PORT"), envs.get("HOST"), () =>
		logger.log(`Server running on port ${envs.get("PORT")}`),
	);
}
bootstrap();
