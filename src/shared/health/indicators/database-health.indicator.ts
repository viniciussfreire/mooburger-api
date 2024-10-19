import { Injectable } from "@nestjs/common";
import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";

import { PrismaService } from "@/shared/databases";

type Payload = {
	key: string;
};

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async isHealthy({ key }: Payload): Promise<HealthIndicatorResult> {
		const dbStatus = await this.prisma.$executeRaw`SELECT 1`;

		return this.getStatus(key, dbStatus > 0);
	}
}
