import { DomainEvents, IDomainEvent } from "../events";
import { Entity } from "./entity";

export abstract class AggregateRoot<T> extends Entity<T> {
	#events: Array<IDomainEvent> = new Array();

	public get events(): IDomainEvent[] {
		return this.#events;
	}

	public addEvent(event: IDomainEvent): void {
		this.#events.push(event);
		DomainEvents.markAggregateForDispatch(this);
	}

	public clearEvents(): void {
		this.#events.length = 0;
	}
}
