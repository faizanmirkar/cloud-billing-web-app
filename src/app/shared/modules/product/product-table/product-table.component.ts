import { Component, OnInit, forwardRef, Input, EventEmitter, Output, Injector } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';

import { ToastService } from 'src/app/shared/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { ProductViewDetailsModel, ProductEntryModel, ProductViewModel } from 'src/app/product/models/product';
import { Utility } from 'src/app/shared/services/utility';
import { ProductTableType, ProductTableColumn, ProductTableColumnType } from '../models/product-table.model';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { ProductTableService } from '../services/product-table.service';
import { DiscountType, DiscountAmountType } from 'src/app/quotation/models/quotation';
import { QuotationHelper } from 'src/app/quotation/services/quotation.helper';
import { CostcodeService } from 'src/app/shared/services/costcode.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductTableComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProductTableComponent),
      multi: true
    }
  ]
})
export class ProductTableComponent extends BaseComponent implements OnInit, ControlValueAccessor, Validator {

  columns: ProductTableColumn[] = [];
  columnType = ProductTableColumnType;
  focusSearch = false;
  private existingProductModels: ProductEntryModel[] = [];
  private productModels: ProductViewDetailsModel[] = [];
  private discountAmountType: DiscountAmountType;
  private costCode: string;
  applyTax: boolean = true;

  @Input() type: ProductTableType;
  @Output() itemSet = new EventEmitter<void>();
  @Input()
  set items(value: ProductViewDetailsModel[]) {
    if (value) {
      this.productModels = [...value];
      this.itemSet.emit();
    }
  }

  @Output() remove = new EventEmitter<string>();
  @Output() dataChanged = new EventEmitter<any>();

  constructor(
    private injector: Injector,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private costcodeService: CostcodeService,
    private confirmationService: ConfirmationService,
    private productTableService: ProductTableService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      products: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    // load columns
    this.loadColumns();
    // handle discount changed
    this.registerQuotationDiscountChanged();
    // register order tax changed
    this.registerOrderTaxChanged();
    // cost code
    this.costCode = this.currentUser.costCode;
  }

  private registerQuotationDiscountChanged() {
    if (this.type == ProductTableType.Quotation) {
      const refSub = this.productTableService.$quotationDiscountChanged.subscribe(value => {
        // set value
        this.discountAmountType = value;
        // discount amount type
        this.calculateDiscountAmountType();
      });
      this.subscription.add(refSub);
    }
  }

  private registerOrderTaxChanged() {
    if (this.type == ProductTableType.Order) {
      const ref = this.productTableService.$applyOrderTax.subscribe(status => {
        this.applyTax = status;
      });
      this.subscription.add(ref);
    }
  }

  private calculateDiscountAmountType() {
    // check for quotation
    if (this.discountAmountType) {
      if (this.type === ProductTableType.Quotation) {
        // delay call
        setTimeout(() => {
          QuotationHelper.calculateDiscount(this.ProductForms, this.discountAmountType);
        }, 100);
      }
    }
  }

  writeValue(values: ProductEntryModel[]): void {
    if (!values) { return; }
    if (!Array.isArray(values)) { return; }
    if (values.length === 0) { return; }
    // clear if any
    this.clearAll();
    // push data
    values.forEach(item => {
      const index = this.productIndex(item.productId);
      if (index > -1) {
        this.createProduct(this.productModels[index], item.qty, item.price);
      }
    });
    // set value
    this.existingProductModels = values;
    // for validate
    this.ProductForms.markAllAsTouched();
  }

  private clearAll() {
    const total = this.ProductForms.length;
    for (let i = 0; i < total; i++) {
      this.ProductForms.removeAt(i);
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid ? null : { status: 'invalid table data' };
  }

  private loadColumns() {
    // serial no
    this.columns.push(this.createColumn('Sl#', null, ProductTableColumnType.SerialNo));
    // code
    this.columns.push(this.createColumn('Code', 'code', ProductTableColumnType.Text));
    // name
    this.columns.push(this.createColumn('Name', 'name', ProductTableColumnType.Text));
    // cost code
    this.columns.push(this.createColumn('CC', 'costCode', ProductTableColumnType.Text));
    // List Price
    this.columns.push(this.createColumn('List Price', 'sellingPrice', ProductTableColumnType.Number));
    // Qty
    this.columns.push(this.createColumn('Unit', 'unit', ProductTableColumnType.Text));
    // Qty
    this.columns.push(this.createColumn('Qty', 'qty', ProductTableColumnType.InputQty));
    // Price
    this.columns.push(this.createColumn('Unit Price', 'price', ProductTableColumnType.InputPrice));
    // Discount
    this.columns.push(this.createColumn('Dis.', 'discount', ProductTableColumnType.Number));
    // Tax%
    this.columns.push(this.createColumn('Vat %', 'tax', ProductTableColumnType.Number));
    // Amount
    this.columns.push(this.createColumn('Amount', 'amount', ProductTableColumnType.Number));
    // Tax Amount
    this.columns.push(this.createColumn('Vat Amt.', 'taxAmount', ProductTableColumnType.Number));
    // Total
    this.columns.push(this.createColumn('Total', 'total', ProductTableColumnType.Number));
    // Action
    this.columns.push(this.createColumn(null, null, ProductTableColumnType.Action));
    // remove order columns
    this.removeOrderColumns();
    // calculate columns
    this.calculateColumnWidth();
  }

  private removeOrderColumns() {
    if (this.type === ProductTableType.Order) {
      const removeColumns = ['costCode', 'sellingPrice', 'discount'];
      removeColumns.forEach(columnId => {
        const index = this.columns.findIndex(m => m.bindWith === columnId);
        if (index > -1) {
          this.columns.splice(index, 1);
        }
      });
    }
  }

  private createColumn(name: string, bindWith: string, type: ProductTableColumnType): ProductTableColumn {
    return {
      bindWith,
      meta: null,
      name,
      type,
      width: 0
    };
  }

  private calculateColumnWidth() {
    let totalWidth = 100;
    // deduct 4 percent for serial no and action
    totalWidth = totalWidth - 18;

    const totalNumericColumn = this.columns.filter(m => m.type === ProductTableColumnType.Number).length;
    const numericPerColumnWidth = 8;
    totalWidth = totalWidth - (totalNumericColumn * numericPerColumnWidth);

    const totalTextColumn = this.columns.filter(m => m.type === ProductTableColumnType.Text).length;
    const textColumnWidth = totalWidth / totalTextColumn;

    this.columns.forEach(col => {
      switch (col.type) {
        case ProductTableColumnType.SerialNo:
        case ProductTableColumnType.Action: {
          col.width = 3;
        } break;
        case ProductTableColumnType.InputQty: {
          col.width = 5;
        } break;
        case ProductTableColumnType.InputPrice: {
          col.width = 7;
        } break;
        case ProductTableColumnType.Text: {
          if (col.name === 'Name') {
            col.width = (textColumnWidth - 0.5) + (totalTextColumn * 0.5);
          } else {
            col.width = textColumnWidth - 0.5;
          }

        } break;
        case ProductTableColumnType.Number: {
          col.width = numericPerColumnWidth;
        } break;
      }

    });
  }

  get ProductForms(): FormArray {
    return this.form.get('products') as FormArray;
  }

  private productIndex(productId: string): number {
    return this.productModels.findIndex(m => m.productId === productId);
  }

  private focusItem(productId: string) {
    const index = this.productIndex(productId);
    if (index > -1) {
      setTimeout(() => {
        this.focusElement(0, index);
      }, 100);
    }
  }

  private focusElement(controlSequence: number, index: number) {
    Utility.focus(`row_element_${controlSequence}_${index}`);
  }

  private createProduct(model: ProductViewDetailsModel, qty: number, unitPrice: number) {
    // check product exist or not
    const index = this.productIndex(model.productId);
    if (index === -1) {
      this.productModels.push(model);
    }
    // create group
    const formGroup = this.formBuilder.group({
      product: model,
      productId: model.productId,
      code: model.code,
      name: model.name,
      costCode: this.getCostCode(model.costPrice),
      costPrice: model.costPrice,
      sellingPrice: model.sellingPrice,
      unit: model.unitName,
      tax: model.taxPercentage,
      qty: this.formBuilder.control(qty, [Validators.required]),
      price: this.formBuilder.control('', [Validators.required]),
      discount: 0,
      amount: 0,
      taxAmount: 0,
      total: 0
    });

    // attach event
    formGroup.get('qty').valueChanges.subscribe(value => {
      this.calculate(formGroup);
    });

    // price change
    formGroup.get('price').valueChanges.subscribe(value => {
      // price validation
      if (this.type === ProductTableType.Quotation) {
        // register price change event
        QuotationHelper.validateDiscount(formGroup, (error: boolean, message: string) => {
          // get row index
          const rowIndex = this.productIndex(model.productId);
          if (rowIndex > -1) {
            const ele: HTMLInputElement = document.getElementById(`row_element_1_${rowIndex}`) as HTMLInputElement;
            if (ele) {
              ele.title = error ? message : '';
            }
          }
        });
      }
      this.calculate(formGroup);
    });

    // set selling price
    formGroup.patchValue({ price: unitPrice });
    // apply validation
    this.ProductForms.push(formGroup);
    // mark as touch
    formGroup.markAllAsTouched();
    // focus when product exist
    if (index === -1) {
      this.focusItem(model.productId);
    }
  }

  private calculate(formGroup: FormGroup) {
    const productInfo = formGroup.get('product').value as ProductViewDetailsModel;
    if (productInfo) {
      const qty = Utility.toFloat(formGroup.get('qty').value);
      const unitPrice = Utility.toFloat(formGroup.get('price').value);
      const amount = qty * unitPrice;
      // set amount
      formGroup.patchValue({ amount });
      // set tax
      const taxAmount = Utility.toPercentage(unitPrice, productInfo.taxPercentage) * qty;
      formGroup.patchValue({ taxAmount });
      // set total
      formGroup.patchValue({ total: (amount + taxAmount) });
      // discount
      formGroup.patchValue({ discount: 0 });
      if (unitPrice > 0 && (unitPrice < productInfo.sellingPrice)) {
        // calculate discount percentage
        formGroup.patchValue({ discount: (productInfo.sellingPrice - unitPrice) });
      }
      // change the value
      setTimeout(() => {
        this.dataChanged.emit({
          total: this.getTotal('total')
        });
      }, 500);

    }
  }

  getTotal(controlName: string): number {
    let total = 0;
    const totalItems = this.ProductForms.length;
    if (totalItems > 0) {
      for (let i = 0; i < totalItems; i++) {
        const fomGroup = this.ProductForms.controls[i] as FormGroup;
        const value = Utility.toFloat(fomGroup.get(controlName).value);
        total += value;
      }
    }
    return total;
  }

  handleItemSelect(model: ProductViewDetailsModel) {
    // check product exist or not
    const productInfo = this.productModels.find(m => m.productId === model.productId);
    if (!productInfo) {
      let price = 0;
      switch (this.type) {
        case ProductTableType.Quotation: {
          price = model.sellingPrice;
        } break;
        case ProductTableType.Order: {
          price = model.costPrice;
        } break;
      }
      if (price > 0) {
        this.createProduct(model, 1, price);
        // calculate discount amount type
        this.calculateDiscountAmountType();
      }
    } else {
      this.toastService.warning('Item already exist.');
      this.focusItem(model.productId);
    }
  }

  handleDelete(productId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // remove
        const index = this.productModels.findIndex(m => m.productId === productId);
        if (index > -1) {
          // remove
          this.ProductForms.removeAt(index);
          this.productModels.splice(index, 1);
          // handle discount
          this.calculateDiscountAmountType();
          // emiti event
          // this.remove.emit(productId);
        }
      }
    });
  }

  handleEnter(controlSequence: number, index: number) {
    this.focusSearch = false;
    const total = this.ProductForms.length;
    if (controlSequence === 0) {
      // qty
      this.focusElement(controlSequence + 1, index);
    } else if (controlSequence === 1) {
      // for price
      if (index === total - 1) {
        // goto search box
        this.focusSearch = true;
      } else {
        this.focusElement(0, index + 1);
      }
    }
  }

  getCostCode(amount: number): string {
    return this.costcodeService.getCostCode(this.costCode, amount);
  }

}
