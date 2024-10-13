import { Either, left, right } from "@/core";
import { AggregateRoot, UniqueEntityId } from "@/core/entities";
import { CustomerCreatedEvent } from "../events";
import { InvalidDocumentError, InvalidEmailError } from "./errors";
import { CustomerDocument, CustomerEmail } from "./value-objects";

type CustomerProps = {
	name: string;
	email: CustomerEmail;
	document: CustomerDocument;
};

type CustomerCreateProps = {
	name: string;
	email: string;
	document: string;
};

export class Customer extends AggregateRoot<CustomerProps> {
	public get name() {
		return this.props.name;
	}

	public get email() {
		return this.props.email;
	}

	public get document() {
		return this.props.document;
	}

	private constructor(props: CustomerProps, id?: UniqueEntityId) {
		super(props, id);
	}

	public static create(
		props: CustomerCreateProps,
	): Either<InvalidEmailError | InvalidDocumentError, Customer> {
		const emailOrError = CustomerEmail.create({ value: props.email });
		if (emailOrError.isLeft()) {
			return left(emailOrError.value);
		}

		const documentOrError = CustomerDocument.create({ value: props.document });
		if (documentOrError.isLeft()) {
			return left(documentOrError.value);
		}

		const name = props.name;
		const email = emailOrError.value;
		const document = documentOrError.value;

		const customer = new Customer({
			name,
			email,
			document,
		});

		customer.addEvent(new CustomerCreatedEvent(customer));

		return right(customer);
	}

	public static restore(props: CustomerProps, id: UniqueEntityId): Customer {
		return new Customer(props, id);
	}
}
