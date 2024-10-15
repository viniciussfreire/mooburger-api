import { InMemoryCustomerRepository } from "@test/repositories";
import { Customer } from "../../enterprise/entities";
import {
	InvalidDocumentError,
	InvalidEmailError,
} from "../../enterprise/entities/errors";
import { CustomerRepository } from "../protocols/repositories";
import { CustomerAlreadyExistsError } from "./errors";
import { RegisterCustomerUseCase } from "./register-customer.use-case";

describe("RegisterCustomerUseCase", () => {
	let customerRepository: CustomerRepository;
	let sut: RegisterCustomerUseCase;

	beforeAll(() => {
		customerRepository = new InMemoryCustomerRepository();
	});

	beforeEach(() => {
		sut = new RegisterCustomerUseCase(customerRepository);
	});

	it("should be able to register a new customer", async () => {
		// Arrange
		const request = {
			name: "John Doe",
			email: "john.doe@mail.com",
			document: "29524942070",
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isRight()).toBeTruthy();

		const result = resultOrError.value as void;

		expect(result).toBeUndefined();
	});

	it("should not be able to register a customer with invalid document", async () => {
		// Arrange
		const request = {
			name: "John Doe",
			email: "john.doe@mail.com",
			document: "2952494207",
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isLeft()).toBeTruthy();

		const error = resultOrError.value as InvalidDocumentError;

		expect(error.name).toEqual("InvalidDocumentError");
		expect(error.message).toEqual(`The document "2952494207" is invalid`);
	});

	it("should not be able to register a customer with invalid email", async () => {
		// Arrange
		const request = {
			name: "John Doe",
			email: "john.doe@mail",
			document: "29524942070",
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isLeft()).toBeTruthy();

		const error = resultOrError.value as InvalidEmailError;

		expect(error.name).toEqual("InvalidEmailError");
		expect(error.message).toEqual(`The email "john.doe@mail" is invalid`);
	});

	it("should not be able to register a customer with an existing document", async () => {
		// Arrange
		const customer = Customer.create({
			name: "John Doe",
			email: "john.doe@mail.com",
			document: "29524942070",
		}).value as Customer;

		await customerRepository.save(customer);

		const request = {
			name: "John Doe Smith",
			email: "john.doe.smith@mail.com",
			document: "29524942070",
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isLeft()).toBeTruthy();

		const error = resultOrError.value as CustomerAlreadyExistsError;

		expect(error.name).toEqual("CustomerAlreadyExistsError");
		expect(error.message).toEqual(
			"Customer with document or email already exists",
		);
	});

	it("should not be able to register a customer with an existing email", async () => {
		// Arrange
		const customer = Customer.create({
			name: "John Doe",
			email: "john.doe@mail.com",
			document: "29524942070",
		}).value as Customer;

		await customerRepository.save(customer);

		const request = {
			name: "John Doe Smith",
			email: "john.doe@mail.com",
			document: "40581046005",
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isLeft()).toBeTruthy();

		const error = resultOrError.value as CustomerAlreadyExistsError;

		expect(error.name).toEqual("CustomerAlreadyExistsError");
		expect(error.message).toEqual(
			"Customer with document or email already exists",
		);
	});
});
