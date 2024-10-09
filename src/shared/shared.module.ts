import { Module } from "@nestjs/common";

import { EnvModule } from "./config/env";
import { HealthModule } from "./health";

@Module({
	imports: [EnvModule, HealthModule],
})
export class SharedModule {}
