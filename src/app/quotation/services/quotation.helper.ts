import { FormGroup, FormArray } from '@angular/forms';
import { ProductViewDetailsModel } from 'src/app/product/models/product';
import { Utility } from 'src/app/shared/services/utility';
import { DiscountType, DiscountAmountType } from '../models/quotation';

export class QuotationHelper {

    static validateDiscount(formGroup: FormGroup, callback: (error: boolean, message: string) => void) {
        // get product
        const product = formGroup.controls['product'].value as ProductViewDetailsModel;
        const priceControl = formGroup.controls['price'];
        const price = Utility.toFloat(priceControl.value);
        if (price < product.minDiscountPrice) {
            // mark this price field as error
            priceControl.setErrors({ invalid: true });
            callback(true, 'This price doesn\'t now allowed.');
        } else {
            priceControl.setErrors(null);
            callback(false, null);
        }
    }

    static calculateDiscount(productForms: FormArray, discount: DiscountAmountType) {
        if (discount.type == DiscountType.Single) {
            this.calculateSingleDiscount(productForms);
        } else if (discount.type == DiscountType.Multiple) {
            this.calculateMultipleDiscount(productForms, discount);
        }
    }

    private static calculateSingleDiscount(productForms: FormArray) {
        const total = productForms.length;
        for (let i = 0; i < total; i++) {
            const formGroup = productForms.controls[i] as FormGroup;
            const priceControl = formGroup.controls['price'];
            const product = formGroup.controls['product'].value as ProductViewDetailsModel;
            // get element
            const ele: HTMLInputElement = document.getElementById(`row_element_1_${i}`) as HTMLInputElement;
            // set unit price enable
            ele.readOnly = false;
            // set unit price as it is
            priceControl.setValue(product.sellingPrice.toFixed(2));
        }
    }

    private static calculateMultipleDiscount(productForms: FormArray, discount: DiscountAmountType) {
        const total = productForms.length;
        // intergate the forms
        let totalCostPrice: number = 0;
        // reset and 
        for (let i = 0; i < total; i++) {
            const formGroup = productForms.controls[i] as FormGroup;
            const priceControl = formGroup.controls['price'];
            const product = formGroup.controls['product'].value as ProductViewDetailsModel;
            // get total cost
            totalCostPrice += product.costPrice;
            // get element
            const ele: HTMLInputElement = document.getElementById(`row_element_1_${i}`) as HTMLInputElement;
            // set unit price enable
            ele.readOnly = false;
            // set unit price as it is
            priceControl.setValue(product.sellingPrice.toFixed(2));
        }

        // check for amount validation
        if (discount.amount > totalCostPrice) {
            const differenceAmount = discount.amount - totalCostPrice;
            const percentage = (differenceAmount / totalCostPrice) * 100;
            // for calculation
            for (let i = 0; i < total; i++) {
                const formGroup = productForms.controls[i] as FormGroup;
                const priceControl = formGroup.controls['price'];
                const product = formGroup.controls['product'].value as ProductViewDetailsModel;
                // get the percentage value
                const discountAmount = Utility.toPercentageWithValue(product.costPrice, percentage)
                // get element
                const ele: HTMLInputElement = document.getElementById(`row_element_1_${i}`) as HTMLInputElement;
                // set unit price enable
                ele.readOnly = true;
                // set unit price as it is
                priceControl.setValue(discountAmount.toFixed(2));
            }
        }
    }

}
