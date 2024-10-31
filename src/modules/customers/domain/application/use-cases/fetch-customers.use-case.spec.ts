import { IPaginationResult } from "@/core/types";
import { createCustomersInBatchFactory } from "@test/mocks/factories";
import { InMemoryCustomerRepository } from "@test/repositories";
import { Customer } from "../../enterprise/entities";
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
});
