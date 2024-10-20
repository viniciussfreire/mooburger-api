import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Envs } from "../envs";

@Injectable()
export class GetEnvService {
	constructor(private configService: ConfigService<Envs, true>) {}

	get<T extends keyof Envs>(key: T) {
		return this.configService.get(key, { infer: true });
	}
}
