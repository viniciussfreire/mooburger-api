import { z } from "zod";

import { Either, left, right } from "@/core";
import { ValueObject } from "@/core/entities";
import { InvalidEmailError } from "../errors";

type CustomerEmailProps = {
	value: string;
};

export class CustomerEmail extends ValueObject<CustomerEmailProps> {
	public get value() {
		return this.props.value;
	}

	private constructor(props: CustomerEmailProps) {
		super(props);
	}

	public static create(
		props: CustomerEmailProps,
	): Either<InvalidEmailError, CustomerEmail> {
		const isValid = this.validate(props.value);

		if (!isValid) {
			return left(new InvalidEmailError(props.value));
		}

		return right(new CustomerEmail({ value: props.value }));
	}

	private static validate(email: string): boolean {
		const emailSchema = z.string().email();
		return emailSchema.safeParse(email).success;
	}
}
