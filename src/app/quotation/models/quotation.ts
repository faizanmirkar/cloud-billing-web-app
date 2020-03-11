import { CustomerModel } from '../../customer/models/customer';
import { ProductEntryModel } from '../../product/models/product';
import { SearchFilter } from 'src/app/shared/models/result';

export class QuotationManageModel {
    quotationId: string;
    customer: CustomerModel;
    products: ProductEntryModel[];
    comment: string;
    discount: number;
}

export class QuotationSearchFilter extends SearchFilter {
    customerId: string;
    fromDate: Date;
    toDate: Date;
}


export class QuotationDetailsViewModel {
    quotationId: string;
    quotationNo: string;
    statusId: number;
}

export enum DiscountType {
    Single = 1,
    Multiple = 2
}

export class DiscountAmountType {
    type: DiscountType;
    amount: number;
}
