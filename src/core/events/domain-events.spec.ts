import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { IDomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

describe("DomainEvents", () => {
	class ExampleEvent implements IDomainEvent {
		public occurredOn: Date = new Date();
		#aggregate: ExampleAggregate;

		constructor(aggregate: ExampleAggregate) {
			this.#aggregate = aggregate;
		}

		public getAggregateId(): UniqueEntityId {
			return this.#aggregate.id;
		}
	}

	class ExampleAggregate extends AggregateRoot<null> {
		public static create() {
			const aggregate = new ExampleAggregate(null);

			aggregate.addEvent(new ExampleEvent(aggregate));

			return aggregate;
		}
	}

	it("should be able to register an event", () => {
		// Arrange
		const callback = vi.fn();
		DomainEvents.register(callback, ExampleEvent.name);

		// Act
		const aggregate = ExampleAggregate.create();

		// Assert
		expect(aggregate.events).toHaveLength(1);

		// Act
		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		// Assert
		expect(callback).toHaveBeenCalledTimes(1);
		expect(aggregate.events).toHaveLength(0);
	});
});
