import { UniqueEntityId } from "../entities/unique-entity-id";

export interface IDomainEvent {
	occurredOn: Date;
	getAggregateId: () => UniqueEntityId;
}
