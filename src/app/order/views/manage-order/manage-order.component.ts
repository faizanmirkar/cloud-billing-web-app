import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { SelectItem, ConfirmationService, DialogService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { OrderManageModel } from '../../models/order';
import { SupplierService } from 'src/app/supplier/services/supplier.service';
import { ProductEntryModel } from 'src/app/product/models/product';
import { ManageSupplierComponent } from 'src/app/supplier/views/manage-supplier/manage-supplier.component';
import { Breadcrumb } from 'src/app/shared/views/page-header/models/breadcrumb.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProductTableService } from 'src/app/shared/modules/product/services/product-table.service';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { Utility } from 'src/app/shared/services/utility';
import { IResult } from 'src/app/shared/models/result';
import { ProductTableType } from 'src/app/shared/modules/product/models/product-table.model';
import { TaxModel } from 'src/app/tax/models/tax';
import { TaxService } from 'src/app/tax/services/tax.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent extends BaseComponent implements OnInit, OnDestroy {

  title = 'Create Order';
  suppliers: SelectItem[] = [];
  orderId: string;
  products: any[];
  type: ProductTableType = ProductTableType.Order;
  taxes: TaxModel[] = [];

  breadcrumbs: Breadcrumb[] = [{
    name: 'Order List',
    link: '/app/order'
  }];

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private productTableService: ProductTableService,
    private orderService: OrderService,
    private supplierService: SupplierService,
    private dialogService: DialogService,
    private taxService: TaxService,
    private loader: LoaderService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      supplierId: this.formBuilder.control('', [Validators.required]),
      item: this.formBuilder.control('', [Validators.required]),
      comment: this.formBuilder.control(''),
      taxId: this.formBuilder.control({ value: '', disabled: true }),
      applyTax: this.formBuilder.control(false)
    });
  }

  ngOnInit() {
    // check for edit mode
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.orderId) {
      // edit mode
      this.title = 'Loading...';
      this.editMode();
    }
    // load supplier
    this.loadSupplier();
    // load tax
    this.loadTax();
  }

  private loadSupplier() {
    const refSub = this.supplierService.items().subscribe(values => {
      this.suppliers = Utility.toSelectItems(values, 'supplierId', 'name');
    });
    this.subscription.add(refSub);
  }

  private editMode() {
    this.loader.show();
    // get the order details
    const refSub = this.orderService.byId(this.orderId).subscribe(value => {
      this.loader.hide();
      if (value) {
        this.title = `Manage Order (${value.orderNo})`;
        // set customer value
        this.setValue('supplierId', value.supplier.supplierId);
        this.setValue('comment', value.comment);
        // set products
        this.products = value.products;
        // check tax exist or not
        if (value.taxId) {
          this.setValue('applyTax', true);
          this.setValue('taxId', value.taxId);
          setTimeout(() => {
            this.productTableService.$applyOrderTax.next(false);
          }, 1000);
        }
      }
    });
    this.subscription.add(refSub);
  }

  private loadTax() {
    const ref = this.taxService.items().subscribe(values => {
      this.taxes = values;
    });
    this.subscription.add(ref);
  }

  handleItemSet() {
    if (this.products && this.products.length > 0) {
      const productEntryModels: ProductEntryModel[] = [];
      if (this.products) {
        this.products.forEach(item => {
          productEntryModels.push({
            price: item.orderUnitPrice,
            productId: item.productId,
            qty: item.orderQty
          });
        });
      }
      this.form.patchValue({ item: productEntryModels });
    }
  }

  addSupplier() {
    const ref = this.dialogService.open(ManageSupplierComponent, {
      header: 'New Supplier',
      width: '60%'
    });

    ref.onClose.subscribe((value: IResult) => {
      if (value) {
        this.setValue('supplierId', value.data);
        this.loadSupplier();
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const products = this.productTableService.getValue(this.form.get('item'));
      if (products.length === 0) {
        this.toastService.warning('Item required.');
        return;
      }
      this.confirmationService.confirm({
        message: 'Are you sure?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // remove
          const taxId = this.getValue('taxId');
          const model: OrderManageModel = {
            orderId: this.orderId ? this.orderId : this.blankGuid,
            supplierId: this.getValue('supplierId'),
            products,
            comment: this.getValue('comment'),
            taxId: taxId ? taxId : null
          };
          this.loader.show();
          this.orderService.manage(model).subscribe(result => {
            this.loader.hide();
            this.toastService.show(result);
            if (this.isSuccessResult(result)) {
              // do next
              this.router.navigateByUrl(`/app/order/view/${result.data}`);
            }
          });
        }
      });
    }
  }

  handleTaxCheckChanged() {
    const status = this.getValue('applyTax') as boolean;
    const taxControl = this.form.get('taxId');
    taxControl.reset();
    if (status) {
      taxControl.enable();
      taxControl.setValidators(Validators.required);
    } else {
      taxControl.clearValidators();
      taxControl.disable();
    }
    taxControl.updateValueAndValidity();
    // set percentage
    let applyTax = true;
    if (status) {
      const taxId = this.getValue('taxId');
      applyTax = taxId ? false : true;
    }
    this.productTableService.$applyOrderTax.next(applyTax);
  }

  handleTaxChanged() {
    const status = this.getValue('applyTax') as boolean;
    if (status) {
      const taxId = this.getValue('taxId');
      const taxInfo = this.taxes.find(m => m.taxId == taxId);
      if (taxInfo) {
        this.productTableService.$applyOrderTax.next(false);
      }
    } else {
      this.productTableService.$applyOrderTax.next(true);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
