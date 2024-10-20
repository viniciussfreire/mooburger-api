import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

import { AppHealthIndicator } from "../indicators";

@ApiTags("Health")
@Controller("readiness")
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private healthIndicator: AppHealthIndicator,
	) {}

	@Get("")
	@HealthCheck({
		noCache: true,
		swaggerDocumentation: true,
	})
	handle() {
		return this.health.check([() => this.healthIndicator.isHealthy("API")]);
	}
}
