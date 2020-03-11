import { SearchFilter } from 'src/app/shared/models/result';


export class ProductModel {
    productId: string;
    name: string;
    code: string;
    barcode: string;
    categoryId: string;
    subCategoryId: string;
    unitId: string;
    taxId: string;
    orderLevel: number;
    status: boolean;
    costPrice: number;
    minDiscount: number;
    sellingPrice: number;
}

export class ProductPriceModel {
    productId: string;
    locationId: string;
    costPrice: number;
    minDiscount: number;
    sellingPrice: number;
}

export class ProductViewModel extends ProductModel {
    price: ProductPriceModel;
}

export class ProductSearchFilter extends SearchFilter {
    locationId: string;
    categoryId: string;
    subCategoryId: string;
}

export class ProductViewDetailsModel extends ProductModel {
    categoryName: string;
    subCategoryName: string;
    unitName: string;
    taxName: string;
    taxPercentage: number;
    taxFullName: string;
    locationName: string;
    costPrice: number;
    costPriceInclusive: number;
    sellingPrice: number;
    sellingPriceInclusive: number;
    sellingProfit: number;
    displayCostCode: string;
    minDiscountPrice: number;
}

export class ProductEntryModel {
    productId: string;
    qty: number;
    price: number;
}
