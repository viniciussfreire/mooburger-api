import { DatabasesModule } from "@/shared/databases";
import { Module } from "@nestjs/common";

import { CustomersRepository } from "./domain/application/protocols/repositories";
import { RegisterCustomerUseCase } from "./domain/application/use-cases";
import { RegisterCustomerController } from "./infra/controllers";
import { PrismaCustomersRepository } from "./infra/gateways/repositories";

@Module({
	imports: [DatabasesModule],
	controllers: [RegisterCustomerController],
	providers: [
		RegisterCustomerUseCase,
		{ provide: CustomersRepository, useClass: PrismaCustomersRepository },
	],
})
export class CustomersModule {}
