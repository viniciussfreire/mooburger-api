import { IPaginationResult } from "@/core/types";
import { Customer } from "@/modules/customers/domain/enterprise/entities";
import { FetchCustomersResponse } from "../fetch-customers.controller";

export class FetchCustomersPresenter {
	static toRest(params: IPaginationResult<Customer>): FetchCustomersResponse {
		const items = params.items.map((customer) => ({
			id: customer.id.toStr(),
			name: customer.name,
			document: customer.document.value,
			email: customer.email.value,
		}));

		return { ...params, items };
	}
}
