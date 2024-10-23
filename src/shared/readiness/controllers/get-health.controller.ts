import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	HealthCheck,
	HealthCheckService,
	PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaClient } from "@prisma/client";

import { AppHealthIndicator } from "../indicators";

@ApiTags("Health")
@Controller("readiness")
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private appIndicator: AppHealthIndicator,
		private prismaIndicator: PrismaHealthIndicator,
	) {}

	@Get("")
	@HealthCheck({
		noCache: true,
		swaggerDocumentation: true,
	})
	@ApiOperation({
		description: "This endpoint is used to check the health of the application",
		summary: "Check the health of the application",
	})
	handle() {
		return this.health.check([
			() => this.appIndicator.isHealthy("API"),
			() => this.prismaIndicator.pingCheck("Database", new PrismaClient()),
		]);
	}
}
