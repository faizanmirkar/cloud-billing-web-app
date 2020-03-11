import { KeyValue } from '@angular/common';


export class CustomerModel {
    customerId: string;
    name: string;
    mobileNo: string;
    email: string;
    address: string;
}

export class CustomerViewModel extends CustomerModel {
    accountType: number;
    openingBalance: number;
    creditLimit: number;
    terms: number;
    status: boolean;
}


export const customerAccountTypes: KeyValue<number, string>[] = [
    {
        key: 1,
        value: 'Account'
    },
    {
        key: 2,
        value: 'Laybuy'
    },
    {
        key: 3,
        value: 'Export'
    },
    {
        key: 4,
        value: 'Quotation'
    }
];

export const customerTerms: KeyValue<number, string>[] = [
    {
        key: 0,
        value: 'Current'
    },
    {
        key: 30,
        value: '30 Days'
    },
    {
        key: 60,
        value: '60 Days'
    },
    {
        key: 90,
        value: '90 Days'
    },
    {
        key: 120,
        value: '120 Days'
    }
];
