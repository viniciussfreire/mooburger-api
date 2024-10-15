export class CustomerAlreadyExistsError extends Error {
	constructor() {
		super("Customer with document or email already exists");
		this.name = "CustomerAlreadyExistsError";
	}
}
