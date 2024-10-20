import { Module } from "@nestjs/common";

import { EnvsModule } from "./config/env";

@Module({
	imports: [EnvsModule],
})
export class SharedModule {}
