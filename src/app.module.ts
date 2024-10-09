import { Module } from "@nestjs/common";

import { SharedModule } from "./shared";

@Module({
	imports: [SharedModule],
	controllers: [],
})
export class AppModule {}
