import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

import { ApiTags } from "@nestjs/swagger";
import { AppHealthIndicator } from "../indicators";

@ApiTags("Health")
@Controller("health")
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private healthIndicator: AppHealthIndicator,
	) {}

	@Get("readiness")
	@HealthCheck({
		noCache: true,
		swaggerDocumentation: true,
	})
	handle() {
		return this.health.check([
			() => this.healthIndicator.isHealthy({ key: "API" }),
			() => this.healthIndicator.isHealthy({ key: "Database" }),
		]);
	}
}
