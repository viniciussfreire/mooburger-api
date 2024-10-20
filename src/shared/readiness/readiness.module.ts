import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./controllers";
import { AppHealthIndicator } from "./indicators";

@Module({
	imports: [TerminusModule],
	controllers: [HealthController],
	providers: [AppHealthIndicator],
})
export class ReadinessModule {}
