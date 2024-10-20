import { UniqueEntityId } from "@/core/entities";
import { DomainEvents } from "@/core/events";
import {
	CustomerRepository,
	FetchCustomerRepositoryInput,
	FetchCustomerRepositoryOutput,
	GetByDocumentRepositoryOutput,
	GetByEmailRepositoryOutput,
	SaveCustomerRepositoryInput,
	SaveCustomerRepositoryOutput,
} from "@/modules/customers/domain/application/protocols/repositories";
import { Customer } from "@/modules/customers/domain/enterprise/entities";
import {
	CustomerDocument,
	CustomerEmail,
} from "@/modules/customers/domain/enterprise/entities/value-objects";

export class InMemoryCustomerRepository implements CustomerRepository {
	public items: Array<Customer> = new Array();

	constructor() {}

	async save(
		params: SaveCustomerRepositoryInput,
	): Promise<SaveCustomerRepositoryOutput> {
		this.items.push(params);
		DomainEvents.dispatchEventsForAggregate(params.id);
	}

	async fetch({
		filters,
		newestFirst,
		pageSize,
		pageToken,
	}: FetchCustomerRepositoryInput): Promise<FetchCustomerRepositoryOutput> {
		const data = this.items.filter((item) => {
			if (filters?.name) {
				return item.name === filters.name;
			}

			if (filters?.email) {
				return item.email.value === filters.email.value;
			}

			if (filters?.document) {
				return item.document.value === filters.document.value;
			}
		});

		if (newestFirst) {
			data.reverse();
		}

		if (pageToken) {
			const index = this.items.findIndex((item) =>
				item.id.equals(new UniqueEntityId(pageToken)),
			);
			data.slice(index + 1);
		}

		if (pageSize) {
			data.slice(0, pageSize);
		}

		return {
			items: data,
			total: this.items.length,
			nextPageToken:
				data.length > 0 ? data[data.length - 1].id.toStr() : undefined,
			previousPageToken: pageToken,
			eof: pageSize && data.length < pageSize ? true : false,
		};
	}

	async getByDocument(
		document: CustomerDocument,
	): Promise<GetByDocumentRepositoryOutput> {
		const item = this.items.find((item) => item.document.equals(document));
		return item ?? null;
	}

	async getByEmail(email: CustomerEmail): Promise<GetByEmailRepositoryOutput> {
		const item = this.items.find((item) => item.email.equals(email));
		return item ?? null;
	}
}
