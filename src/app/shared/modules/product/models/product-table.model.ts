export enum ProductTableType {
    Quotation = 1,
    Order = 2
}

export enum ProductTableColumnType {
    SerialNo,
    Text,
    Number,
    InputQty,
    InputPrice,
    Action
}

export class ProductTableColumn {
    name: string;
    type: ProductTableColumnType;
    bindWith: string;
    width: number;
    meta: any;
}


