import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, SelectItem, DialogService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MasterService } from '../../../master/services/master.service';
import { TaxService } from '../../../tax/services/tax.service';
import { LocationModel } from '../../../location/models/location';
import { ProductViewModel, ProductPriceModel, ProductModel } from '../../models/product';
import { ManageMasterComponent } from '../../../master/views/manage-master/manage-master.component';
import { ManageTaxComponent } from '../../../tax/views/manage-tax/manage-tax.component';
import { TaxModel } from '../../../tax/models/tax';
import { MasterTypes } from '../../../master/models/master-model';
import { MasterUtility } from '../../../master/services/master-utility';
import { Utility } from 'src/app/shared/services/utility';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { IResult } from 'src/app/shared/models/result';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent extends BaseComponent implements OnInit, OnDestroy {

  productModel: ProductModel = null;
  categories: SelectItem[] = [];
  subCategories: SelectItem[] = [];
  units: SelectItem[] = [];
  locations: LocationModel[] = [];
  taxes: SelectItem[] = [];
  taxItems: TaxModel[] = [];

  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private productService: ProductService,
    private masterService: MasterService,
    private taxService: TaxService,
    private dialogService: DialogService,
    private loader: LoaderService) {
    super(injector);

    // init form
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      code: this.formBuilder.control('', [Validators.required]),
      barcode: this.formBuilder.control('', [Validators.required]),
      categoryId: this.formBuilder.control('', [Validators.required]),
      subCategoryId: this.formBuilder.control(''),
      unitId: this.formBuilder.control('', [Validators.required]),
      taxId: this.formBuilder.control('', [Validators.required]),
      orderLevel: this.formBuilder.control('1', [Validators.required]),
      price: this.formBuilder.group({
        costPrice: this.formBuilder.control('', [Validators.required]),
        costPriceInclusive: this.formBuilder.control('', [Validators.required]),
        ptc: this.formBuilder.control('', [Validators.required]),
        minDiscount: this.formBuilder.control(''),
        sellingPrice: this.formBuilder.control('', [Validators.required]),
        sellingPriceInclusive: this.formBuilder.control('', [Validators.required]),
      })
    });

  }

  ngOnInit() {
    if (this.config.data) {
      this.productModel = this.config.data.model as ProductModel;
      if (this.productModel) {
        this.form.patchValue({ name: this.productModel.name });
        this.form.patchValue({ code: this.productModel.code });
        this.form.patchValue({ barcode: this.productModel.barcode });
        this.form.patchValue({ categoryId: this.productModel.categoryId });
        this.form.patchValue({ subCategoryId: this.productModel.subCategoryId });
        this.form.patchValue({ unitId: this.productModel.unitId });
        this.form.patchValue({ taxId: this.productModel.taxId });
        this.form.patchValue({ orderLevel: this.productModel.orderLevel });
        // price
        this.priceForm.patchValue({ costPrice: this.productModel.costPrice });
        this.priceForm.patchValue({ sellingPrice: this.productModel.sellingPrice });
        this.priceForm.patchValue({ minDiscount: this.productModel.minDiscount });
        setTimeout(() => {
          this.handleCostPriceChange();
          this.handleSellingPriceChange();
        }, 1000);
        // load subcategory
        this.loadSubCategory(this.productModel.categoryId);
      }
    }

    if (!this.productModel) {
      // get next serial no
      /*
      this.productService.getNextCode().subscribe(value => {
        this.form.patchValue({ code: value });
        this.form.patchValue({ barcode: value });
      });
      */
    }
    // load master
    this.loadCategory();
    this.loadUnit();
    this.loadTax();
  }

  private loadCategory() {
    const ref = this.masterService.categories().subscribe(values => {
      this.categories = Utility.toSelectItems(values, 'id', 'name');
    });
    this.subscription.add(ref);
  }

  private loadSubCategory(categoryId: string) {
    const ref = this.masterService.subcategories(categoryId).subscribe(values => {
      this.subCategories = Utility.toSelectItems(values, 'id', 'name');
    });
    this.subscription.add(ref);
  }

  private loadUnit() {
    const ref = this.masterService.units().subscribe(values => {
      this.units = Utility.toSelectItems(values, 'id', 'name');
    });
    this.subscription.add(ref);
  }

  private loadTax() {
    const ref = this.taxService.items().subscribe(values => {
      this.taxItems = values; this.taxes = MasterUtility.toTaxOptionItems(values);
    });
    this.subscription.add(ref);
  }

  private get priceForm(): FormGroup {
    return this.form.get('price') as FormGroup;
  }

  renderSubCategory($event: any) {
    this.subCategories = [];
    this.form.patchValue({ subCategoryId: '' });
    if ($event.value) {
      this.loadSubCategory($event.value);
    }
  }

  private getPrice(): ProductPriceModel {
    const model: ProductPriceModel = {
      locationId: this.blankGuid,
      productId: this.productModel ? this.productModel.productId : this.blankGuid,
      costPrice: Utility.toFloat(this.priceForm.get('costPrice').value),
      minDiscount: Utility.toFloat(this.priceForm.get('minDiscount').value),
      sellingPrice: Utility.toFloat(this.priceForm.get('sellingPrice').value)
    };
    return model;
  }

  private get currentTax(): TaxModel {
    const taxId = this.form.get('taxId').value;
    if (this.taxItems && this.taxItems.length > 0) {
      return this.taxItems.find(m => m.taxId === taxId);
    }
    return null;
  }

  handleCostPriceChange() {
    const price = Utility.toFloat(this.priceForm.get('costPrice').value);
    const tax = this.currentTax;
    if (price && tax) {
      const result = Utility.toPercentageWithValue(price, tax.percentage).toFixed(2);
      this.priceForm.get('costPriceInclusive').setValue(result);
      this.handlePtcChange();
    }
  }

  handleCostPriceInclusiveChange() {
    const price = Utility.toFloat(this.priceForm.get('costPriceInclusive').value);
    const tax = this.currentTax;
    if (price && tax) {
      const result = Utility.toPriceWithoutTax(price, tax.percentage).toFixed(2);
      this.priceForm.get('costPrice').setValue(result);
      this.handlePtcChange();
    }
  }

  handleSellingPriceChange(calculatePtc: boolean = true) {
    const price = Utility.toFloat(this.priceForm.get('sellingPrice').value);
    const tax = this.currentTax;
    if (price && tax) {
      const result = Math.fround(Utility.toPercentageWithValue(price, tax.percentage)).toFixed(2);
      this.priceForm.patchValue({ sellingPriceInclusive: result });
      if (calculatePtc) {
        this.calculatePTC();
      }
    }
  }

  handleSellingPriceInclusiveChange() {
    const price = Utility.toFloat(this.priceForm.get('sellingPriceInclusive').value);
    const tax = this.currentTax;
    if (price && tax) {
      const result = Math.fround(Utility.toPriceWithoutTax(price, tax.percentage)).toFixed(2);
      this.priceForm.patchValue({ sellingPrice: result });
      this.calculatePTC();
    }
  }

  handlePtcChange() {
    const ptc = Utility.toFloat(this.priceForm.get('ptc').value);
    const price = Utility.toFloat(this.priceForm.get('costPrice').value);
    const tax = this.currentTax;
    if (ptc && price && tax) {
      const result = Math.fround(price + Utility.toPercentage(price, ptc)).toFixed(2);
      this.priceForm.patchValue({ sellingPrice: result });
      this.handleSellingPriceChange(false);
    }
  }

  private calculatePTC() {
    const costPrice = Utility.toFloat(this.priceForm.get('costPrice').value);
    const sellingPrice = Utility.toFloat(this.priceForm.get('sellingPrice').value);
    this.priceForm.patchValue({ ptc: Utility.percentageOf(sellingPrice, costPrice).toFixed(2) });
  }

  handleTaxChange() {
    this.handleCostPriceChange();
  }

  submit() {
    if (this.form.valid) {
      const model: ProductViewModel = {
        name: this.form.get('name').value,
        code: this.form.get('code').value,
        barcode: this.form.get('barcode').value,
        categoryId: this.form.get('categoryId').value,
        subCategoryId: this.form.get('subCategoryId').value,
        unitId: this.form.get('unitId').value,
        taxId: this.form.get('taxId').value,
        orderLevel: this.form.get('orderLevel').value,
        price: this.getPrice(),
        productId: this.productModel ? this.productModel.productId : this.blankGuid,
        status: true,
        costPrice: 0,
        minDiscount: 0,
        sellingPrice: 0
      };
      this.loader.show();
      this.productService.manage(model).subscribe(value => {
        this.loader.hide();
        this.toastService.show(value);
        if (this.isSuccessResult(value)) {
          if (this.productModel) {
            this.ref.close(true);
          } else {
            this.clear();
          }
        }
      });
    }
  }

  clear() {
    // clear all form
    Utility.clearForm(this.form);
    // path some value
    this.form.get('orderLevel').setValue('1');
  }

  addCategory() {
    const ref = this.dialogService.open(ManageMasterComponent, {
      header: 'Add Category',
      width: '50%',
      data: {
        typeId: MasterTypes.Category
      }
    });

    ref.onClose.subscribe((value: IResult) => {
      if (value) {
        this.setValue('categoryId', value.data);
        this.loadCategory();
      }
    });
  }

  addSubCategory() {
    const categoryId = this.form.get('categoryId').value;
    if (categoryId) {
      const ref = this.dialogService.open(ManageMasterComponent, {
        header: 'Add SubCategory',
        width: '50%',
        data: {
          typeId: MasterTypes.SubCategory,
          parentId: categoryId
        }
      });

      ref.onClose.subscribe((value: IResult) => {
        if (value) {
          this.setValue('subCategoryId', value.data);
          this.loadSubCategory(categoryId);
        }
      });
    } else {
      this.toastService.error('Select category first');
    }
  }

  addUnit() {
    const ref = this.dialogService.open(ManageMasterComponent, {
      header: 'Add Unit',
      width: '50%',
      data: {
        typeId: MasterTypes.Unit
      }
    });

    ref.onClose.subscribe((value: IResult) => {
      if (value) {
        this.setValue('unitId', value.data);
        this.loadUnit();
      }
    });
  }

  addTax() {
    const ref = this.dialogService.open(ManageTaxComponent, {
      header: 'Add TAX',
      width: '50%',
      data: {}
    });

    ref.onClose.subscribe((value: IResult) => {
      if (value) {
        this.setValue('taxId', value.data);
        this.loadTax();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
