import { cpf } from "cpf-cnpj-validator";

import { Either, left, right } from "@/core";
import { ValueObject } from "@/core/entities";
import { InvalidDocumentError } from "../errors";

type CustomerDocumentProps = {
	value: string;
};

export class CustomerDocument extends ValueObject<CustomerDocumentProps> {
	public get value() {
		return this.props.value;
	}

	private constructor(props: CustomerDocumentProps) {
		super(props);
	}

	public static create(
		props: CustomerDocumentProps,
	): Either<InvalidDocumentError, CustomerDocument> {
		const isValid = this.validate(props.value);

		if (!isValid) {
			return left(new InvalidDocumentError(props.value));
		}

		return right(new CustomerDocument({ value: props.value }));
	}

	private static validate(document: string): boolean {
		return cpf.isValid(document);
	}
}
