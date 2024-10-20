import { left, right } from "./either";

describe("Either", () => {
	const example = (success: boolean) => {
		if (success) {
			return right("success");
		}
		return left("failure");
	};

	it("should return success when isRight is true", () => {
		// Act
		const result = example(true);

		// Assert
		expect(result.isRight()).toBeTruthy();
		expect(result.isLeft()).toBeFalsy();
	});

	it("should return failure when isRight is false", () => {
		// Act
		const result = example(false);

		// Assert
		expect(result.isRight()).toBeFalsy();
		expect(result.isLeft()).toBeTruthy();
	});
});
