import { UniqueEntityId } from "@/core/entities";
import { DomainEvents } from "@/core/events";
import {
	CustomersRepository,
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

export class InMemoryCustomerRepository implements CustomersRepository {
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
			if (filters?.id && item.id.toStr() !== filters.id.toStr()) {
				return false;
			}

			if (filters?.name && item.name !== filters.name) {
				return false;
			}

			if (filters?.email && item.email.value !== filters.email.value) {
				return false;
			}

			if (filters?.document && item.document.value !== filters.document.value) {
				return false;
			}

			return true;
		});

		if (newestFirst) {
			data.reverse();
		}

		const startIndex = pageToken
			? data.findIndex((item) => item.id.equals(new UniqueEntityId(pageToken)))
			: 0;

		const endIndex = pageSize ? startIndex + pageSize : data.length;

		const items = data.slice(startIndex, endIndex);

		return {
			items,
			total: items.length,
			nextPageToken:
				endIndex < data.length ? data[endIndex].id.toStr() : undefined,
			previousPageToken: pageToken,
			eof:
				(pageSize && items.length < pageSize) || endIndex >= data.length
					? true
					: false,
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
