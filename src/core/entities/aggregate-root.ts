import { Logger } from "@nestjs/common";

import { IDomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

export abstract class AggregateRoot<T> extends Entity<T> {
	#logger = new Logger();
	#events: Array<IDomainEvent> = new Array();

	public get events(): IDomainEvent[] {
		return this.#events;
	}

	public addEvent(event: IDomainEvent): void {
		this.#events.push(event);
		DomainEvents.markAggregateForDispatch(this);

		this.logEventAdded(event);
	}

	public clearEvents(): void {
		this.#events.length = 0;
	}

	private logEventAdded(event: IDomainEvent): void {
		const thisClass = Reflect.getPrototypeOf(this) as any;
		const eventClass = Reflect.getPrototypeOf(event) as any;

		this.#logger.log(
			`[DOMAIN EVENT ADDED] => ${eventClass.name}`,
			thisClass.name,
		);
	}
}
