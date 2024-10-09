import { Injectable } from "@nestjs/common";
import { HealthIndicator, type HealthIndicatorResult } from "@nestjs/terminus";

type Payload = {
	key: string;
};

@Injectable()
export class AppHealthIndicator extends HealthIndicator {
	async isHealthy({ key }: Payload): Promise<HealthIndicatorResult> {
		const result = this.getStatus(key, true);

		return result;
	}
}
