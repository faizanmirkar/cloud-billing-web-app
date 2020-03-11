import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { QuotationManageModel, DiscountType } from '../../models/quotation';
import { CustomerModel } from 'src/app/customer/models/customer';
import { QuotationService } from '../../services/quotation.service';
import { ConfirmationService, DialogService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductEntryModel } from 'src/app/product/models/product';
import { Breadcrumb } from 'src/app/shared/views/page-header/models/breadcrumb.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProductTableService } from 'src/app/shared/modules/product/services/product-table.service';
import { ProductTableType } from 'src/app/shared/modules/product/models/product-table.model';
import { Utility } from 'src/app/shared/services/utility';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { CustomerService } from 'src/app/customer/services/customer.service';
import { KeyValue } from '@angular/common';
import { CostcodeService } from 'src/app/shared/services/costcode.service';

@Component({
  selector: 'app-manage-quotation',
  templateUrl: './manage-quotation.component.html',
  styleUrls: ['./manage-quotation.component.scss']
})
export class ManageQuotationComponent extends BaseComponent implements OnInit, OnDestroy {

  title = 'Create Quotation';
  private quotationId: string;
  private previousSearchMobileNo: string = null;
  type: ProductTableType = ProductTableType.Quotation;
  products: any[];
  breadcrumbs: Breadcrumb[] = [{
    name: 'Quotation List',
    link: '/app/quotation'
  }];

  discountTypes: KeyValue<number, string>[] = [];
  private totalAmount: number = 0;

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private router: Router,
    private productTableService: ProductTableService,
    private toastService: ToastService,
    private quotationService: QuotationService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private customerService: CustomerService,
    private costcodeService: CostcodeService,
    private loader: LoaderService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      customer: this.formBuilder.group({
        name: this.formBuilder.control('', [Validators.required]),
        mobileNo: this.formBuilder.control('', [Validators.required]),
        email: this.formBuilder.control('', [Validators.email]),
        address: this.formBuilder.control('', [Validators.required]),
      }),
      item: this.formBuilder.control('', [Validators.required]),
      other: this.formBuilder.group({
        remarks: this.formBuilder.control(''),
        discountType: this.formBuilder.control('1'),
        discount: this.formBuilder.control({ value: '', disabled: true })
      })
    });
  }

  ngOnInit() {
    // load discount type
    this.loadDiscountType();
    // edit check
    this.quotationId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.quotationId) {
      // edit mode
      this.title = 'Loading...';
      this.editMode();
    }
  }

  private loadDiscountType() {
    this.discountTypes.push({ key: DiscountType.Single, value: 'Disc. Single' });
    this.discountTypes.push({ key: DiscountType.Multiple, value: 'Disc. Multi' });
  }

  editMode() {
    this.loader.show();
    // get the quotation details
    const refSub = this.quotationService.byId(this.quotationId).subscribe(value => {
      this.loader.hide();
      if (value) {
        // check that its already invoiced or not
        if (!value.canMarkAsInvoice) {
          this.router.navigateByUrl(`/app/quotation/view/${value.quotationId}`);
        }
        this.title = `Manage Quotation (${value.quotationNo})`;
        // set customer value
        const customer = value.customer as CustomerModel;
        const customerFormGroup = this.form.get('customer') as FormGroup;
        customerFormGroup.patchValue({ name: customer.name });
        customerFormGroup.patchValue({ mobileNo: customer.mobileNo });
        customerFormGroup.patchValue({ email: customer.email });
        customerFormGroup.patchValue({ address: customer.address });
        // set products
        this.products = value.products;
        // set other
        const otherFormGroup = this.form.get('other') as FormGroup;
        otherFormGroup.patchValue({ remarks: value.comment });
        // set discount
        const discount = Utility.toFloat(value.discount);
        if (discount > 0) {
          setTimeout(() => {
            // set discount type
            otherFormGroup.patchValue({ discountType: DiscountType.Multiple });
            otherFormGroup.patchValue({ discount });
            this.handleDiscountTypeChanged();
          }, 1000);
        }
      }
    });
    this.subscription.add(refSub);
  }

  handleItemSet() {
    if (this.products && this.products.length > 0) {
      const productEntryModels: ProductEntryModel[] = [];
      if (this.products) {
        this.products.forEach(item => {
          productEntryModels.push({
            price: item.quotationUnitPrice,
            productId: item.productId,
            qty: item.quotationQty
          });
        });
      }
      this.form.patchValue({ item: productEntryModels });
    }
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
          const model: QuotationManageModel = {
            quotationId: this.quotationId ? this.quotationId : this.blankGuid,
            customer: this.getCustomerModel(),
            products,
            comment: this.form.get('other').get('remarks').value,
            discount: Utility.toFloat(this.form.get('other').get('discount').value)
          };
          this.loader.show();
          this.quotationService.manage(model).subscribe(result => {
            this.loader.hide();
            this.toastService.show(result);
            if (this.isSuccessResult(result)) {
              // do next
              this.router.navigateByUrl(`/app/quotation/view/${result.data}`);
            }
          });
        },
        reject: () => {

        }
      });
    }
  }

  private getCustomerModel(): CustomerModel {
    const formGroup = this.form.get('customer') as FormGroup;
    const model: CustomerModel = new CustomerModel();
    model.name = formGroup.get('name').value;
    model.mobileNo = formGroup.get('mobileNo').value;
    model.email = formGroup.get('email').value;
    model.address = formGroup.get('address').value;
    return model;
  }

  handleCustomerSearch() {
    const customerFormGroup = this.form.get('customer') as FormGroup;
    const mobileNo = customerFormGroup.get('mobileNo').value;
    if (mobileNo && !this.quotationId && (mobileNo !== this.previousSearchMobileNo)) {
      this.previousSearchMobileNo = mobileNo;
      // search
      const ref = this.customerService.getByMobile(mobileNo).subscribe(value => {
        if (value) {
          // set the
          customerFormGroup.patchValue({ name: value.name }, { onlySelf: true });
          customerFormGroup.patchValue({ email: value.email }, { onlySelf: true });
          customerFormGroup.patchValue({ address: value.address }, { onlySelf: true });
          this.toastService.success('This is a exsiting customer');
        }
      });
    }
  }

  handleDiscountTypeChanged() {
    const formGroup = this.form.get('other') as FormGroup;
    const discountControl = formGroup.get('discount');
    const discountType = Number(formGroup.get('discountType').value);
    // reset
    if (discountType === DiscountType.Single) {
      // disable
      discountControl.setValue('');
      formGroup.get('discount').disable({ onlySelf: true });
    } else if (discountType === DiscountType.Multiple) {
      // enable
      formGroup.get('discount').enable({ onlySelf: true });
    }
    // call discount changed
    this.handleDiscountChanged();
  }

  handleDiscountChanged() {
    const formGroup = this.form.get('other') as FormGroup;
    const discount = Utility.toFloat(formGroup.get('discount').value);
    const discountType = Number(formGroup.get('discountType').value);
    this.productTableService.$quotationDiscountChanged.next({
      amount: discount,
      type: discountType
    });
  }

  handleProductTableChanged($event: any) {
    console.log($event);
    if ($event) {
      this.totalAmount = $event.total;
    }
  }

  getTotalCode() {
    if (this.totalAmount > 0) {
      return this.costcodeService.getCostCode(this.currentUser.costCode, this.totalAmount);
    }
    return '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
