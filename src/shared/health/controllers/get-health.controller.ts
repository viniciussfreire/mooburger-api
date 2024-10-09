import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

import { AppHealthIndicator } from "../indicators";

@Controller("health")
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private dogHealthIndicator: AppHealthIndicator,
	) {}

	@Get("readiness")
	@HealthCheck()
	handle() {
		return this.health.check([
			() => this.dogHealthIndicator.isHealthy({ key: "API" }),
		]);
	}
}
