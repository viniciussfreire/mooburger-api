import { InvalidEmailError } from "../errors";
import { CustomerEmail } from "./customer-email.value-object";

describe("CustomerEmail", () => {
	it("should be able to create a valid customer email", () => {
		// Arrange
		const email = "john.doe@mail.com";

		// Act
		const customerEmailOrError = CustomerEmail.create({ value: email });

		// Assert
		expect(customerEmailOrError.isRight()).toBeTruthy();

		const customerEmail = customerEmailOrError.value as CustomerEmail;

		expect(customerEmail.value).toEqual(email);
	});

	it("should not be able to create a invalid customer email", () => {
		// Arrange
		const email = "john.doe@mail";

		// Act
		const customerEmailOrError = CustomerEmail.create({ value: email });

		// Assert
		expect(customerEmailOrError.isLeft()).toBeTruthy();

		const error = customerEmailOrError.value as InvalidEmailError;

		expect(error.message).toEqual(`The email "${email}" is invalid`);
		expect(error.name).toEqual("InvalidEmailError");
	});
});
