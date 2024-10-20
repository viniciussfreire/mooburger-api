export class Identifier<T> {
	#value: T;

	constructor(value: T) {
		this.#value = value;
	}

	public toStr(): string {
		return String(this.#value);
	}

	public toValue(): T {
		return this.#value;
	}

	public equals(other: Identifier<T>): boolean {
		if (!other) return false;

		if (!(other instanceof Identifier)) return false;

		return other.toValue() === this.#value;
	}
}
