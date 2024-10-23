import { Injectable, Logger } from "@nestjs/common";

import {
	CustomersRepository,
	FetchCustomerRepositoryInput,
	FetchCustomerRepositoryOutput,
	GetByDocumentRepositoryOutput,
	GetByEmailRepositoryOutput,
	SaveCustomerRepositoryInput,
	SaveCustomerRepositoryOutput,
} from "@/modules/customers/domain/application/protocols/repositories";
import {
	CustomerDocument,
	CustomerEmail,
} from "@/modules/customers/domain/enterprise/entities/value-objects";
import { PrismaService } from "@/shared/databases/services";
import { CustomerMapper } from "./mappers";

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
	#logger = new Logger(PrismaCustomersRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async save(
		params: SaveCustomerRepositoryInput,
	): Promise<SaveCustomerRepositoryOutput> {
		this.#logger.log("🤖 - Saving new customer...");
		await this.prisma.customer.create({
			data: {
				id: params.id.toStr(),
				name: params.name,
				document: params.document.value,
				email: params.email.value,
			},
		});
		this.#logger.log("🤖 - Customer saved!");
	}

	async fetch({
		filters,
		newestFirst,
		pageSize,
		pageToken,
	}: FetchCustomerRepositoryInput): Promise<FetchCustomerRepositoryOutput> {
		this.#logger.log("🤖 - Fetching customers...");
		const raw = await this.prisma.customer.findMany({
			where: {
				name: filters?.name,
				email: filters?.email?.value,
				document: filters?.document?.value,
				id: {
					gt: pageToken,
				},
			},
			take: pageSize,
			orderBy: {
				id: newestFirst ? "desc" : "asc",
			},
		});

		this.#logger.log(`🤖 - Total of customer fetched: ${raw.length}`);

		const customers = raw.map(CustomerMapper.toDomain);

		return {
			eof: pageSize && raw.length < pageSize ? true : false,
			items: customers,
			nextPageToken: customers.length
				? customers[customers.length - 1].id.toStr()
				: undefined,
			previousPageToken: pageToken,
			total: customers.length,
		};
	}

	async getByDocument(
		document: CustomerDocument,
	): Promise<GetByDocumentRepositoryOutput> {
		this.#logger.log("🤖 - Getting customer by document...");
		const raw = await this.prisma.customer.findUnique({
			where: {
				document: document.value,
			},
		});

		if (!raw) {
			this.#logger.log("🤖 - Customer not found!");
			return null;
		}

		return CustomerMapper.toDomain(raw);
	}

	async getByEmail(email: CustomerEmail): Promise<GetByEmailRepositoryOutput> {
		this.#logger.log("🤖 - Getting customer by email...");

		const raw = await this.prisma.customer.findUnique({
			where: {
				email: email.value,
			},
		});

		if (!raw) {
			this.#logger.log("🤖 - Customer not found!");
			return null;
		}

		return CustomerMapper.toDomain(raw);
	}
}
