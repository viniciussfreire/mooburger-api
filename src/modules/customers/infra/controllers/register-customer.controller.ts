import { Body, Controller, HttpException, Post, Version } from "@nestjs/common";

import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterCustomerUseCase } from "../../domain/application/use-cases";
import { RegisterCustomerDto } from "./dtos";

@ApiTags("Customers")
@Controller("customers")
export class RegisterCustomerController {
	constructor(private readonly useCase: RegisterCustomerUseCase) {}

	@Post()
	@Version("1")
	@ApiBody({ type: RegisterCustomerDto })
	@ApiResponse({
		status: 201,
		description: "The customer has been successfully created.",
	})
	@ApiResponse({
		status: 400,
		description: "The customer could not be created.",
	})
	async handle(@Body() body: RegisterCustomerDto): Promise<void> {
		const resultOrError = await this.useCase.perform(body);

		if (resultOrError.isLeft()) {
			throw new HttpException(resultOrError.value.message, 400);
		}
	}
}
