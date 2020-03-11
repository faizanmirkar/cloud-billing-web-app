export enum TableColumnType {
    Text,
    Number,
    YesNo,
    Date,
    Time,
    DateTime,
    Action
}

export class TableColumn {
    type: TableColumnType;
    sortKey: string;
    icon: string;
    width: number;
    key: string;
    value: string;
}

export class TableAction<T> {
    column: TableColumn;
    row: T;
}
