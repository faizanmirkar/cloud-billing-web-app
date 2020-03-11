import { SearchFilter } from 'src/app/shared/models/result';

export class TaxModel {
    taxId: string;
    name: string;
    percentage: number;
    description: string;
    status: boolean;
}



export class TaxSearchFilter extends SearchFilter {

}
