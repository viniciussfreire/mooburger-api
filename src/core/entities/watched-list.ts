export abstract class WatchedList<T> {
	public currentItems: Array<T>;
	#initial: Array<T>;
	#new: Array<T>;
	#removed: Array<T>;

	constructor(items?: Array<T>) {
		this.currentItems = items ? items : new Array();
		this.#initial = items ? items : new Array();
		this.#new = new Array();
		this.#removed = new Array();
	}

	abstract compare(a: T, b: T): boolean;

	public getItems(): Array<T> {
		return this.currentItems;
	}

	public getNewItems(): Array<T> {
		return this.#new;
	}

	public getRemovedItems(): Array<T> {
		return this.#removed;
	}

	public exists(item: T): boolean {
		return this.isCurrentItem(item);
	}

	public add(item: T): void {
		if (this.isRemovedItem(item)) {
			this.removeFromRemoved(item);
		}

		if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
			this.#new.push(item);
		}

		if (!this.isCurrentItem(item)) {
			this.currentItems.push(item);
		}
	}

	public remove(item: T): void {
		this.removeFromCurrent(item);

		if (this.isNewItem(item)) {
			this.removeFromNew(item);
			return;
		}

		if (!this.isRemovedItem(item)) {
			this.#removed.push(item);
		}
	}

	public update(items: T[]): void {
		const newItems = items.filter((a) => {
			return !this.getItems().some((b) => this.compare(a, b));
		});

		const removedItems = this.getItems().filter((a) => {
			return !items.some((b) => this.compare(a, b));
		});

		this.currentItems = items;
		this.#new = newItems;
		this.#removed = removedItems;
	}

	private isCurrentItem(item: T): boolean {
		return (
			this.currentItems.filter((v: T) => this.compare(item, v)).length !== 0
		);
	}

	private isNewItem(item: T): boolean {
		return this.#new.filter((v: T) => this.compare(item, v)).length !== 0;
	}

	private isRemovedItem(item: T): boolean {
		return this.#removed.filter((v: T) => this.compare(item, v)).length !== 0;
	}

	private removeFromNew(item: T): void {
		this.#new = this.#new.filter((v) => !this.compare(v, item));
	}

	private removeFromCurrent(item: T): void {
		this.currentItems = this.currentItems.filter((v) => !this.compare(item, v));
	}

	private removeFromRemoved(item: T): void {
		this.#removed = this.#removed.filter((v) => !this.compare(item, v));
	}

	private wasAddedInitially(item: T): boolean {
		return this.#initial.filter((v: T) => this.compare(item, v)).length !== 0;
	}
}
