import { IPaginationResult } from "@/core/types";
import { createCustomersInBatchFactory } from "@test/mocks/factories";
import { InMemoryCustomerRepository } from "@test/repositories";
import { Customer } from "../../enterprise/entities";
import {
	InvalidDocumentError,
	InvalidEmailError,
} from "../../enterprise/entities/errors";
import { CustomersRepository } from "../protocols/repositories";
import { FetchCustomersUseCase } from "./fetch-customers.use-case";

describe("FetchCustomersUseCase", () => {
	let customerRepository: CustomersRepository;
	let sut: FetchCustomersUseCase;

	beforeAll(() => {
		customerRepository = new InMemoryCustomerRepository();
	});

	beforeEach(() => {
		sut = new FetchCustomersUseCase(customerRepository);
	});

	it("should be able to fetch all customers with pagination", async () => {
		// Arrange
		const customers = createCustomersInBatchFactory(20);
		for (const customer of customers) {
			await customerRepository.save(customer);
		}

		const firstRequest = {
			filters: {},
			newestFirst: true,
			pageSize: 10,
		};

		// Act
		const firstPageOrError = await sut.perform(firstRequest);

		// Assert
		expect(firstPageOrError.isRight()).toBeTruthy();

		const firstPage = firstPageOrError.value as IPaginationResult<Customer>;

		expect(firstPage.items).toHaveLength(10);
		expect(firstPage.total).toBe(10);
		expect(firstPage.nextPageToken).toBeTruthy();
		expect(firstPage.eof).toBeFalsy();

		// Act
		const secondPageOrError = await sut.perform({
			...firstRequest,
			pageToken: firstPage.nextPageToken,
		});

		// Assert
		expect(secondPageOrError.isRight()).toBeTruthy();

		const secondPage = secondPageOrError.value as IPaginationResult<Customer>;

		expect(secondPage.items).toHaveLength(10);
		expect(secondPage.total).toBe(10);
		expect(secondPage.nextPageToken).toBeUndefined();
		expect(secondPage.eof).toBeTruthy();
	});

	it("should be able to fetch customers filtering by ID", async () => {
		// Arrange
		const customers = createCustomersInBatchFactory(20);
		for (const customer of customers) {
			await customerRepository.save(customer);
		}

		const request = {
			filters: {
				id: customers[0].id.toStr(),
			},
			newestFirst: true,
			pageSize: 10,
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isRight()).toBeTruthy();

		const result = resultOrError.value as IPaginationResult<Customer>;

		expect(result.items).toHaveLength(1);
		expect(result.total).toBe(1);
		expect(result.nextPageToken).toBeUndefined();
		expect(result.eof).toBeTruthy();
	});

	it("should not be able to fetch customers filtering by invalid email", async () => {
		// Arrange
		const customers = createCustomersInBatchFactory(20);
		for (const customer of customers) {
			await customerRepository.save(customer);
		}

		const request = {
			filters: {
				email: "john.doe@mail",
			},
			newestFirst: true,
			pageSize: 10,
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isLeft()).toBeTruthy();

		const error = resultOrError.value as InvalidEmailError;

		expect(error.message).toEqual(`The email "john.doe@mail" is invalid`);
	});

	it("should not be able to fetch customers filtering by invalid email", async () => {
		// Arrange
		const customers = createCustomersInBatchFactory(20);
		for (const customer of customers) {
			await customerRepository.save(customer);
		}

		const request = {
			filters: {
				document: "1234",
			},
			newestFirst: true,
			pageSize: 10,
		};

		// Act
		const resultOrError = await sut.perform(request);

		// Assert
		expect(resultOrError.isLeft()).toBeTruthy();

		const error = resultOrError.value as InvalidDocumentError;

		expect(error.message).toEqual(`The document "1234" is invalid`);
	});
});
