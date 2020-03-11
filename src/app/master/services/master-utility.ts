import { SelectItem } from 'primeng/api';

export class MasterUtility {
    
    static toTaxOptionItems(items: any[]) {
        const models: SelectItem[] = [];
        if (items && items.length > 0) {
            items.forEach(item => {
                models.push({
                    label: `${item.name} - ${item.percentage}%`,
                    value: item.taxId
                });
            });
        }
        return models;
    }
}