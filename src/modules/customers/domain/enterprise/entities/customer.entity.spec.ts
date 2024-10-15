import { UniqueEntityId } from "@/core/entities";
import { Customer } from "./customer.entity";
import { InvalidDocumentError, InvalidEmailError } from "./errors";
import { CustomerDocument, CustomerEmail } from "./value-objects";

describe("Customer", () => {
	describe("create", () => {
		it("should be able to create a customer", () => {
			// Arrange
			const name = "John Doe";
			const email = "john.doe@mail.com";
			const document = "29524942070";

			// Act
			const customerOrError = Customer.create({ name, email, document });

			// Assert
			expect(customerOrError.isRight()).toBeTruthy();

			const customer = customerOrError.value as Customer;

			expect(customer.id).toBeTruthy();
			expect(customer.name).toEqual(name);
			expect(customer.email.value).toEqual(email);
			expect(customer.document.value).toEqual(document);

			expect(customer.events).toHaveLength(1);
			expect(customer.events[0].getAggregateId()).toEqual(customer.id);
			expect(customer.events[0].occurredOn).toEqual(expect.any(Date));
		});

		it("should not be able to create a customer with invalid email", () => {
			// Arrange
			const name = "John Doe";
			const email = "john.doe@mail";
			const document = "29524942070";

			// Act
			const customerOrError = Customer.create({ name, email, document });

			// Assert
			expect(customerOrError.isLeft()).toBeTruthy();

			const error = customerOrError.value as InvalidEmailError;

			expect(error.name).toEqual("InvalidEmailError");
			expect(error.message).toEqual(`The email "${email}" is invalid`);
		});

		it("should not be able to create a customer with invalid document", () => {
			// Arrange
			const name = "John Doe";
			const email = "john.doe@mail.com";
			const document = "2952494207";

			// Act
			const customerOrError = Customer.create({ name, email, document });

			// Assert
			expect(customerOrError.isLeft()).toBeTruthy();

			const error = customerOrError.value as InvalidDocumentError;

			expect(error.name).toEqual("InvalidDocumentError");
			expect(error.message).toEqual(`The document "${document}" is invalid`);
		});
	});

	describe("restore", () => {
		it("should be able to restore a customer", () => {
			// Arrange
			const id = new UniqueEntityId();
			const name = "John Doe";
			const document = CustomerDocument.create({ value: "29524942070" })
				.value as CustomerDocument;
			const email = CustomerEmail.create({ value: "john.doe@mail.com" })
				.value as CustomerEmail;

			// Act
			const customer = Customer.restore({ name, document, email }, id);

			// Assert
			expect(customer.id).toEqual(id);
			expect(customer.name).toEqual(name);
			expect(customer.email).toEqual(email);
			expect(customer.document).toEqual(document);
		});
	});
});
