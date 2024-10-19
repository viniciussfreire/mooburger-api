import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { GetEnvService } from "./shared/config/env/services";
import { swaggerConfig } from "./shared/config/swagger";

async function bootstrap() {
	const logger = new Logger("ServerBootstrap");

	const app = await NestFactory.create(AppModule);

	const envs = await app.resolve(GetEnvService);

	app.enableVersioning({
		type: VersioningType.URI,
	});

	const documentFactory = () =>
		SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("swagger", app, documentFactory, {
		jsonDocumentUrl: "swagger/json",
		yamlDocumentUrl: "swagger/yaml",
	});

	await app.listen(envs.get("PORT"), envs.get("HOST"), () =>
		logger.log(`Server running on port ${envs.get("PORT")}`),
	);
}
bootstrap();
