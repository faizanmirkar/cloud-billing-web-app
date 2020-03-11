export interface IResult {
    status: number;
    message: string;
    data: any;
}

export enum IResultStatus {
    Success = 1,
    Error = 0
}

export class SearchResult<T> {
    results: T[];
    total: number;
}

export class SearchFilter {
    constructor(sortField: string, perPage: number = 10) {
        this.perPage = perPage;
        this.sortField = sortField;
        this.pageNo = 0;
        this.sortOrder = 1;
    }
    perPage: number;
    pageNo: number;
    sortField: string;
    sortOrder: number;
    searchTerm: string = null;
}