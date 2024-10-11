import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { IDomainEvent } from "./domain-event";

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
	static #handlersMap: Map<string, Set<DomainEventCallback>> = new Map();
	static #markedAggregates: Array<AggregateRoot<unknown>> = new Array();

	public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
		const aggregateFound = !!this.findMarkedAggregateById(aggregate.id);

		if (!aggregateFound) this.#markedAggregates.push(aggregate);
	}

	public static dispatchEventsForAggregate(id: UniqueEntityId) {
		const aggregate = this.findMarkedAggregateById(id);

		if (aggregate) {
			this.dispatchEvents(aggregate);

			aggregate.clearEvents();

			this.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(
		callback: DomainEventCallback,
		eventClassName: string,
	) {
		const handlers = this.#handlersMap.get(eventClassName) ?? new Set();
		handlers.add(callback);

		this.#handlersMap.set(eventClassName, handlers);
	}

	public static clearHandlers(): void {
		this.#handlersMap.clear();
	}

	public static clearMarkedAggregates(): void {
		this.#markedAggregates = new Array();
	}

	private static findMarkedAggregateById(aggregateId: UniqueEntityId) {
		return this.#markedAggregates.find((aggregate) =>
			aggregate.id.equals(aggregateId),
		);
	}

	private static dispatchEvents(aggregate: AggregateRoot<unknown>) {
		for (const event of aggregate.events) {
			this.dispatch(event);
		}
	}

	private static dispatch(event: IDomainEvent) {
		const eventName = event.constructor.name;

		const handlers = this.#handlersMap.get(eventName);

		if (handlers) {
			for (const handler of handlers) {
				handler(event);
			}
		}
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<any>,
	): void {
		const index = this.#markedAggregates.findIndex((a) => a.equals(aggregate));
		this.#markedAggregates.splice(index, 1);
	}
}
