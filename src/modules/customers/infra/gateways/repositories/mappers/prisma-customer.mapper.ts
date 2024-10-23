import { Customer as RawCustomer } from "@prisma/client";

import { UniqueEntityId } from "@/core/entities";
import { Customer } from "@/modules/customers/domain/enterprise/entities";
import {
	CustomerDocument,
	CustomerEmail,
} from "@/modules/customers/domain/enterprise/entities/value-objects";

export class CustomerMapper {
	static toDomain(raw: RawCustomer): Customer {
		const id = new UniqueEntityId(raw.id);
		const document = CustomerDocument.create({ value: raw.document })
			.value as CustomerDocument;
		const email = CustomerEmail.create({ value: raw.email })
			.value as CustomerEmail;

		return Customer.restore({ name: raw.name, email, document }, id);
	}
}
