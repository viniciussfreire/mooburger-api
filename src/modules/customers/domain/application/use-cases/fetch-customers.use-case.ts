import { Injectable, Logger } from "@nestjs/common";

import { Either, left, right } from "@/core";
import { UniqueEntityId } from "@/core/entities";
import { IPaginationOptions, IPaginationResult } from "@/core/types";
import { Customer } from "../../enterprise/entities";
import {
	InvalidDocumentError,
	InvalidEmailError,
} from "../../enterprise/entities/errors";
import {
	CustomerDocument,
	CustomerEmail,
} from "../../enterprise/entities/value-objects";
import { CustomersRepository } from "../protocols/repositories";

type FetchCustomersUseCasePayload = IPaginationOptions<{
	id?: string;
	document?: string;
	email?: string;
	name?: string;
}>;
type FetchCustomersUseCaseResult = Either<
	InvalidDocumentError | InvalidEmailError,
	IPaginationResult<Customer>
>;

@Injectable()
export class FetchCustomersUseCase {
	#logger = new Logger(FetchCustomersUseCase.name);

	constructor(private readonly customerRepository: CustomersRepository) {}

	async perform({
		filters,
		newestFirst,
		pageSize,
		pageToken,
	}: FetchCustomersUseCasePayload): Promise<FetchCustomersUseCaseResult> {
		this.#logger.log("🤖 - Fetching customers...");

		let id: UniqueEntityId | undefined;
		if (filters.id) {
			id = new UniqueEntityId(filters.id);
		}

		let document: CustomerDocument | undefined;
		if (filters.document) {
			const documentOrError = CustomerDocument.create({
				value: filters.document,
			});

			if (documentOrError.isLeft()) {
				this.#logger.error(documentOrError.value);
				return left(documentOrError.value);
			}

			document = documentOrError.value;
		}

		let email: CustomerEmail | undefined;
		if (filters.email) {
			const emailOrError = CustomerEmail.create({ value: filters.email });

			if (emailOrError.isLeft()) {
				this.#logger.error(emailOrError.value);
				return left(emailOrError.value);
			}

			email = emailOrError.value;
		}

		const result = await this.customerRepository.fetch({
			filters: {
				id,
				document,
				email,
				name: filters.name,
			},
			newestFirst: newestFirst ?? true,
			pageSize: pageSize ?? 10,
			pageToken: pageToken ?? undefined,
		});

		this.#logger.log(`🤖 - Total of customer fetched: ${result.items.length}`);

		return right(result);
	}
}
