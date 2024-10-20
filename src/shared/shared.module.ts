import { Module } from "@nestjs/common";

import { EnvsModule } from "./config/env";
import { ReadinessModule } from "./readiness";

@Module({
	imports: [EnvsModule, ReadinessModule],
})
export class SharedModule {}
