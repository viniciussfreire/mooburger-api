interface VoProps {
	[key: string]: any;
}

export abstract class ValueObject<T extends VoProps> {
	protected props: T;

	protected constructor(props: T) {
		this.props = props;
	}

	public equals(other: ValueObject<T>): boolean {
		if (!other) return false;

		if (!other.props) return false;

		if (!(other instanceof ValueObject)) return false;

		return JSON.stringify(this.props) === JSON.stringify(other.props);
	}
}
