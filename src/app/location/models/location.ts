import { SearchFilter } from 'src/app/shared/models/result';

export class LocationModel {
    locationId: string;
    name: string;
    code: string;
    address: string;
    status: boolean;
    isPrimary: boolean;
    bankDetails: string;
    logo: string;
    allowNegativeStock: boolean;
    vatNo: string;
}

export class LocationSearchFilter extends SearchFilter {

}
