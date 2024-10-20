import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { schema } from "./envs";
import { GetEnvService } from "./services";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (envs) => schema.parse(envs),
			isGlobal: true,
		}),
	],
	providers: [GetEnvService],
	exports: [GetEnvService],
})
export class EnvsModule {}
