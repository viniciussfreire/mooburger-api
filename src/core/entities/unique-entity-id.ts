import { ulid } from "ulid";

import { Identifier } from "./identifier";

export class UniqueEntityId extends Identifier<string> {
	constructor(value?: string) {
		super(value ?? ulid());
	}
}
