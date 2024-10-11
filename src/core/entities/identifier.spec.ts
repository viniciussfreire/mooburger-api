import { Identifier } from "./identifier";

describe("Identifier", () => {
	it("should be able to check equality", () => {
		// Arrange
		class AnotherClass {}

		// Act
		const idOne = new Identifier(1);
		const idTwo = new Identifier(2);
		const idOneClone = new Identifier(1);
		const anotherClass = new AnotherClass();

		// Assert
		expect(idOne.equals(idOneClone)).toBeTruthy();
		expect(idOne.equals(idTwo)).toBeFalsy();
		expect(idOne.equals(anotherClass as any)).toBeFalsy();
		expect(idOne.equals(null as any)).toBeFalsy();
		expect(idOne.equals(undefined as any)).toBeFalsy();
	});
});
