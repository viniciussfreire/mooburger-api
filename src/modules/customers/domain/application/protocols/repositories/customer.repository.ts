import { Customer } from "../../../enterprise/entities";
import {
	CustomerDocument,
	CustomerEmail,
} from "../../../enterprise/entities/value-objects";

export type SaveCustomerRepositoryInput = Customer;
export type SaveCustomerRepositoryOutput = void;

export type FetchCustomerRepositoryInput = {
	name?: string;
	email?: CustomerEmail;
	document?: CustomerDocument;
};
export type FetchCustomerRepositoryOutput = Array<Customer>;

export abstract class CustomerRepository {
	abstract save(
		params: SaveCustomerRepositoryInput,
	): Promise<SaveCustomerRepositoryOutput>;
	abstract fetch(
		params: FetchCustomerRepositoryInput,
	): Promise<FetchCustomerRepositoryOutput>;
}
