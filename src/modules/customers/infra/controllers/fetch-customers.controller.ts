import {
	Controller,
	Get,
	NotFoundException,
	Query,
	Version,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { IPaginationResult } from "@/core/types";
import { FetchCustomersUseCase } from "../../domain/application/use-cases";
import { FetchCustomersDto } from "./dtos";
import { FetchCustomersPresenter } from "./presenters";

export type FetchCustomersResponse = IPaginationResult<{
	id: string;
	name: string;
	document: string;
	email: string;
}>;

@ApiTags("Customers")
@Controller("customers")
export class FetchCustomersController {
	constructor(private readonly useCase: FetchCustomersUseCase) {}

	@Get()
	@Version("1")
	@ApiOperation({
		description: "This endpoint is used to fetch customers",
		summary: "Fetch customers",
	})
	@ApiResponse({
		status: 200,
		description: "The fetched customers.",
	})
	async handle(
		@Query() queries: FetchCustomersDto,
	): Promise<FetchCustomersResponse> {
		const resultOrError = await this.useCase.perform({
			filters: {
				id: queries.id,
				document: queries.document,
				email: queries.email,
				name: queries.name,
			},
			newestFirst:
				queries.newestFirst && queries.newestFirst === "true"
					? true
					: undefined,
			pageSize: queries.pageSize
				? Number.parseInt(queries.pageSize)
				: undefined,
			pageToken: queries.pageToken,
		});

		if (resultOrError.isLeft()) {
			throw new NotFoundException(resultOrError.value.message);
		}

		return FetchCustomersPresenter.toRest(resultOrError.value);
	}
}
