import { DatabasesModule } from "@/shared/databases";
import { Module } from "@nestjs/common";

import { CustomersRepository } from "./domain/application/protocols/repositories";
import {
	FetchCustomersUseCase,
	RegisterCustomerUseCase,
} from "./domain/application/use-cases";
import {
	FetchCustomersController,
	RegisterCustomerController,
} from "./infra/controllers";
import { PrismaCustomersRepository } from "./infra/gateways/repositories";

@Module({
	imports: [DatabasesModule],
	controllers: [RegisterCustomerController, FetchCustomersController],
	providers: [
		RegisterCustomerUseCase,
		FetchCustomersUseCase,
		{ provide: CustomersRepository, useClass: PrismaCustomersRepository },
	],
})
export class CustomersModule {}
