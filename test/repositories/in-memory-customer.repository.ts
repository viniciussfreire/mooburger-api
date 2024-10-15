import { DomainEvents } from "@/core/events";
import {
	CustomerRepository,
	FetchCustomerRepositoryInput,
	FetchCustomerRepositoryOutput,
	SaveCustomerRepositoryInput,
	SaveCustomerRepositoryOutput,
} from "@/modules/customers/domain/application/protocols/repositories";
import { Customer } from "@/modules/customers/domain/enterprise/entities";

export class InMemoryCustomerRepository implements CustomerRepository {
	public items: Array<Customer> = new Array();

	constructor() {}

	async save(
		params: SaveCustomerRepositoryInput,
	): Promise<SaveCustomerRepositoryOutput> {
		this.items.push(params);
		DomainEvents.dispatchEventsForAggregate(params.id);
	}

	async fetch(
		params: FetchCustomerRepositoryInput,
	): Promise<FetchCustomerRepositoryOutput> {
		return this.items.filter((item) => {
			if (params.name) {
				return item.name === params.name;
			}
			if (params.email) {
				return item.email.equals(params.email);
			}
			if (params.document) {
				return item.document.equals(params.document);
			}
		});
	}
}
