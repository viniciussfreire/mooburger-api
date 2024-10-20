import { ValueObject } from "./value-object";

describe("ValueObject", () => {
	it("should be able to check equality", () => {
		// Arrange
		class Example extends ValueObject<{ name: string }> {
			constructor(props: { name: string }) {
				super(props);
			}
		}
		class AnotherClass {}

		// Act
		const voOne = new Example({ name: "Stark" });
		const voTwo = new Example({ name: "Lannister" });
		const voOneClone = new Example({ name: "Stark" });
		const anotherClass = new AnotherClass();

		// Assert
		expect(voOne.equals(voOneClone)).toBeTruthy();
		expect(voOne.equals(voTwo)).toBeFalsy();
		expect(voOne.equals(anotherClass as any)).toBeFalsy();
		expect(voOne.equals(null as any)).toBeFalsy();
		expect(voOne.equals(undefined as any)).toBeFalsy();
	});
});
