import { Module } from "@nestjs/common";

import { EnvsModule } from "./config/env";
import { DatabasesModule } from "./databases";
import { ReadinessModule } from "./readiness";

@Module({
	imports: [DatabasesModule, EnvsModule, ReadinessModule],
})
export class SharedModule {}
