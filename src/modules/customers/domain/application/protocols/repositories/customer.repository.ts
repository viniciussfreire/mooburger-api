import { IPaginationOptions, IPaginationResult } from "@/core/types/pagination";
import { Customer } from "../../../enterprise/entities";
import {
	CustomerDocument,
	CustomerEmail,
} from "../../../enterprise/entities/value-objects";

export type SaveCustomerRepositoryInput = Customer;
export type SaveCustomerRepositoryOutput = void;

type FetchCustomerOptions = {
	name?: string;
	email?: CustomerEmail;
	document?: CustomerDocument;
};
export type FetchCustomerRepositoryInput =
	IPaginationOptions<FetchCustomerOptions>;
export type FetchCustomerRepositoryOutput = IPaginationResult<Customer>;

export type GetByDocumentRepositoryOutput = Customer | null;
export type GetByEmailRepositoryOutput = Customer | null;

export abstract class CustomerRepository {
	abstract save(
		params: SaveCustomerRepositoryInput,
	): Promise<SaveCustomerRepositoryOutput>;
	abstract fetch(
		params: FetchCustomerRepositoryInput,
	): Promise<FetchCustomerRepositoryOutput>;
	abstract getByDocument(
		document: CustomerDocument,
	): Promise<GetByDocumentRepositoryOutput>;
	abstract getByEmail(
		email: CustomerEmail,
	): Promise<GetByEmailRepositoryOutput>;
}
