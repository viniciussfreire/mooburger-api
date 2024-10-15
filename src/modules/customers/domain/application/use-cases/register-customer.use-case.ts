import { Injectable, Logger } from "@nestjs/common";

import { Either, left, right } from "@/core";
import { Customer } from "../../enterprise/entities";
import {
	InvalidDocumentError,
	InvalidEmailError,
} from "../../enterprise/entities/errors";
import { CustomerRepository } from "../protocols/repositories";
import { CustomerAlreadyExistsError } from "./errors";

type RegisterCustomerUseCasePayload = {
	name: string;
	email: string;
	document: string;
};

type RegisterCustomerUseCaseResult = Either<
	InvalidDocumentError | InvalidEmailError,
	void
>;

@Injectable()
export class RegisterCustomerUseCase {
	#logger = new Logger(RegisterCustomerUseCase.name);

	constructor(private readonly customerRepository: CustomerRepository) {}

	async perform(
		params: RegisterCustomerUseCasePayload,
	): Promise<RegisterCustomerUseCaseResult> {
		this.#logger.log("🤖 - Registering new customer...");

		const customerOrError = Customer.create({
			name: params.name,
			email: params.email,
			document: params.document,
		});
		if (customerOrError.isLeft()) {
			return left(customerOrError.value);
		}

		const customer = customerOrError.value as Customer;

		this.#logger.log("🤖 - Check if customer already exists...");

		const customerWithDocumentAlreadyExists =
			await this.customerRepository.fetch({
				document: customer.document,
			});
		if (customerWithDocumentAlreadyExists.length) {
			return left(new CustomerAlreadyExistsError());
		}

		const customerWithEmailAlreadyExists = await this.customerRepository.fetch({
			email: customer.email,
		});
		if (customerWithEmailAlreadyExists.length) {
			return left(new CustomerAlreadyExistsError());
		}

		this.#logger.log("🤖 - Saving new customer...");
		await this.customerRepository.save(customer);

		return right(void 0);
	}
}
