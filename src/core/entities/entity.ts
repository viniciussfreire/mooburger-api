import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<T> {
	#id: UniqueEntityId;
	protected props: T;

	public get id(): UniqueEntityId {
		return this.#id;
	}

	constructor(props: T, id?: UniqueEntityId) {
		this.props = props;
		this.#id = id ?? new UniqueEntityId();
	}

	public equals(other?: Entity<T>): boolean {
		if (!other) return false;

		if (!(other instanceof Entity)) return false;

		if (other === this) {
			return true;
		}

		if (other.id === this.#id) {
			return true;
		}

		return false;
	}
}
