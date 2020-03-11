import { SearchFilter } from 'src/app/shared/models/result';

export class MasterModel {
    id: string;
    name: string;
    parentId: string;
    typeId: number;
    description: string;
    status: boolean;
}

export class MasterSearchFilter extends SearchFilter {
    typeId: number;
    parentId: string;
}

export enum MasterTypes {
    Category = 1,
    SubCategory = 2,
    Unit = 3
}
