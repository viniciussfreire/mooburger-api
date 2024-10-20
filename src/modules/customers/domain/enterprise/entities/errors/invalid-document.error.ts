export class InvalidDocumentError extends Error {
	constructor(document: string) {
		super(`The document "${document}" is invalid`);
		this.name = "InvalidDocumentError";
	}
}
