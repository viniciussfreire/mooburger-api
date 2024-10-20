import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { GetEnvService } from "./shared/config/env/services";

async function bootstrap() {
	const logger = new Logger("ServerBootstrap");

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	const envs = await app.resolve(GetEnvService);

	app.enableVersioning({
		type: VersioningType.URI,
	});

	await app.listen(
		{
			host: envs.get("HOST"),
			port: envs.get("PORT"),
		},
		() => logger.log(`🚀 Server started on port ${envs.get("PORT")}`),
	);
}

bootstrap();
