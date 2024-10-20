import { InvalidDocumentError } from "../errors";
import { CustomerDocument } from "./customer-document.value-object";

describe("CustomerDocument", () => {
	it("should be able to create a valid customer document", () => {
		// Arrange
		const document = "29524942070";

		// Act
		const customerDocumentOrError = CustomerDocument.create({
			value: document,
		});

		// Assert
		expect(customerDocumentOrError.isRight()).toBeTruthy();

		const customerDocument = customerDocumentOrError.value as CustomerDocument;

		expect(customerDocument.value).toEqual(document);
	});

	it("should not be able to create a invalid customer document", () => {
		// Arrange
		const document = "2952494207";

		// Act
		const customerDocumentOrError = CustomerDocument.create({
			value: document,
		});

		// Assert
		expect(customerDocumentOrError.isLeft()).toBeTruthy();

		const error = customerDocumentOrError.value as InvalidDocumentError;

		expect(error.message).toEqual(`The document "${document}" is invalid`);
		expect(error.name).toEqual("InvalidDocumentError");
	});
});
