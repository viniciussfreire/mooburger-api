import { UniqueEntityId } from "@/core/entities";
import { IDomainEvent } from "@/core/events";
import { Customer } from "../entities";

export class CustomerCreatedEvent implements IDomainEvent {
	public customer: Customer;
	public occurredOn: Date;

	constructor(customer: Customer) {
		this.customer = customer;
		this.occurredOn = new Date();
	}

	public getAggregateId(): UniqueEntityId {
		return this.customer.id;
	}
}
