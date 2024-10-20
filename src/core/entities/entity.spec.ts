import { Entity } from "./entity";
import { UniqueEntityId } from "./unique-entity-id";

describe("Entity", () => {
	it("should be able to check equality", () => {
		// Arrange
		type ExampleProps = {
			name: string;
		};
		class Example extends Entity<ExampleProps> {
			constructor(props: ExampleProps, id?: UniqueEntityId) {
				super(props, id);
			}
		}

		class AnotherClass {}

		const id = new UniqueEntityId();

		// Act
		const entityOne = new Example({ name: "Stark" }, id);
		const entityTwo = new Example({ name: "Lannister" });
		const entityOneClone = new Example({ name: "Stark" }, id);
		const anotherClass = new AnotherClass();

		// Assert
		expect(entityOne.equals(entityOneClone)).toBeTruthy();
		expect(entityOne.equals(entityTwo)).toBeFalsy();
		expect(entityOne.equals(anotherClass as any)).toBeFalsy();
		expect(entityOne.equals(null as any)).toBeFalsy();
		expect(entityOne.equals(undefined as any)).toBeFalsy();
	});
});
