export interface IPaginationResult<T> {
	items: T[];
	total: number;
	nextPageToken?: string;
	previousPageToken?: string;
	eof: boolean;
}

export interface IPaginationOptions<T> {
	filters: T;
	newestFirst?: boolean;
	pageSize?: number;
	pageToken?: string;
}
