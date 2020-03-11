import { ProductEntryModel } from '../../product/models/product';
import { SearchFilter } from 'src/app/shared/models/result';

export class OrderManageModel {
    orderId: string;
    supplierId: string;
    products: ProductEntryModel[];
    comment: string;
    taxId: string;
}

export class OrderSearchFilter extends SearchFilter {

}

export class OrderDetailsViewModel {
    orderId: string;
    orderNo: string;
}
