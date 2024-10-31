import { faker } from "@faker-js/faker";
import { cpf } from "cpf-cnpj-validator";

import { Customer } from "@/modules/customers/domain/enterprise/entities";

export const createCustomersInBatchFactory = (qnt: number): Array<Customer> =>
	Array.from(
		{ length: qnt },
		(_, i) =>
			Customer.create({
				document: cpf.generate(),
				email: faker.internet.email(),
				name: faker.person.fullName(),
			}).value as Customer,
	);
