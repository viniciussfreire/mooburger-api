export interface IPaginationResult<T> {
	eof: boolean;
	items: T[];
	total: number;
	nextPageToken?: string;
	pageSize?: number;
	previousPageToken?: string;
}

export interface IPaginationOptions<T> {
	filters: T;
	newestFirst?: boolean;
	pageSize?: number;
	pageToken?: string;
}
