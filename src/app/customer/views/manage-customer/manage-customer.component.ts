import { Component, OnInit, Injector } from '@angular/core';
import { CustomerViewModel, customerAccountTypes, customerTerms } from '../../models/customer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CustomerService } from '../../services/customer.service';
import { Utility } from 'src/app/shared/services/utility';
import { KeyValue } from '@angular/common';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent extends BaseComponent implements OnInit {

  model: CustomerViewModel = null;
  accountTypes: KeyValue<number, string>[] = [];
  terms: KeyValue<number, string>[] = [];
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastService,
    private loader: LoaderService) {
    super(injector);
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      mobileNo: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.email]),
      address: this.formBuilder.control(''),
      accountType: this.formBuilder.control('', [Validators.required]),
      openingBalance: this.formBuilder.control('', [Validators.required]),
      creditLimit: this.formBuilder.control('', [Validators.required]),
      terms: this.formBuilder.control('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.accountTypes = customerAccountTypes;
    this.terms = customerTerms;
    if (this.config.data) {
      this.model = this.config.data.model as CustomerViewModel;
      if (this.model) {
        this.form.patchValue({ name: this.model.name });
        this.form.patchValue({ mobileNo: this.model.mobileNo });
        this.form.patchValue({ email: this.model.email });
        this.form.patchValue({ address: this.model.address });
        this.form.patchValue({ accountType: this.model.accountType });
        this.form.patchValue({ openingBalance: this.model.openingBalance });
        this.form.patchValue({ creditLimit: this.model.creditLimit });
        this.form.patchValue({ terms: this.model.terms });
      }
    }
  }
  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.customerService.manage({
        customerId: this.model ? this.model.customerId : this.blankGuid,
        name: this.form.value.name,
        address: this.form.value.address,
        openingBalance: Utility.toFloat(this.form.value.openingBalance),
        email: this.form.value.email,
        accountType: this.form.value.accountType,
        creditLimit: Utility.toFloat(this.form.value.creditLimit),
        mobileNo: this.form.value.mobileNo,
        terms: Utility.toFloat(this.form.value.terms),
        status: true,
      }).subscribe(result => {
        this.loader.hide();
        this.toastService.show(result);
        if (this.isSuccessResult(result)) {
          this.ref.close(result);
        }
      });
    }
  }

}
