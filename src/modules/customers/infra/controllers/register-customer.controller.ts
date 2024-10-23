import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Version,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RegisterCustomerUseCase } from "../../domain/application/use-cases";
import { RegisterCustomerDto } from "./dtos";

@ApiTags("Customers")
@Controller("customers")
export class RegisterCustomerController {
	constructor(private readonly useCase: RegisterCustomerUseCase) {}

	@Post()
	@Version("1")
	@ApiOperation({
		description: "This endpoint is used to create a new customer",
		summary: "Create a new customer",
	})
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
			throw new BadRequestException(resultOrError.value.message);
		}
	}
}
