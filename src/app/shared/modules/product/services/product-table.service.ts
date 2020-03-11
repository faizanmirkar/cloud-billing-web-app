import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ProductEntryModel } from 'src/app/product/models/product';
import { Utility } from 'src/app/shared/services/utility';
import { Subject } from 'rxjs';
import { DiscountAmountType } from 'src/app/quotation/models/quotation';

@Injectable({
  providedIn: 'root'
})
export class ProductTableService {

  $quotationDiscountChanged = new Subject<DiscountAmountType>();
  $applyOrderTax = new Subject<boolean>();

  constructor() { }

  getValue(control: AbstractControl): ProductEntryModel[] {
    const models: ProductEntryModel[] = [];
    if (!control) { return models; }
    if (!control.value) { return models; }
    let items = control.value.products;
    if (!items) { items = control.value; }
    if (!items) { return models; }
    // for array
    if (Array.isArray(items)) {
      items.forEach(item => {
        const model = this.getModel(item);
        if (model) {
          models.push(model);
        }
      });
    } else {
      // single object
      const model = this.getModel(items);
      if (model) {
        models.push(model);
      }
    }

    return models;
  }

  private getModel(value: any): ProductEntryModel {
    if (value) {
      const qty = Utility.toFloat(value.qty);
      const price = Utility.toFloat(value.price);
      if (qty > 0 && price > 0) {
        const model: ProductEntryModel = new ProductEntryModel();
        model.productId = value.productId;
        model.qty = qty;
        model.price = price;
        return model;
      }
    }
    return null;
  }
}
