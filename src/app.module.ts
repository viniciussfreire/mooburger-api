import { Module } from "@nestjs/common";

import { CustomersModule } from "./modules/customers";
import { SharedModule } from "./shared";

@Module({
	imports: [CustomersModule, SharedModule],
})
export class AppModule {}
