import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SupplierService } from '../../services/supplier.service';
import { SupplierModel } from '../../models/supplier';
import { Utility } from 'src/app/shared/services/utility';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';

@Component({
  selector: 'app-manage-supplier',
  templateUrl: './manage-supplier.component.html',
  styleUrls: ['./manage-supplier.component.scss']
})
export class ManageSupplierComponent extends BaseComponent implements OnInit {

  model: SupplierModel = null;
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private toastService: ToastService,
    private loader: LoaderService) {
    super(injector);
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      contactPerson: this.formBuilder.control('', [Validators.required]),
      contactNo: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control(''),
      address: this.formBuilder.control(''),
      balance: this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnInit() {
    if (this.config.data) {
      this.model = this.config.data.model as SupplierModel;
      if (this.model) {
        this.form.patchValue({ name: this.model.name });
        this.form.patchValue({ contactPerson: this.model.contactPerson });
        this.form.patchValue({ contactNo: this.model.contactNo });
        this.form.patchValue({ email: this.model.email });
        this.form.patchValue({ address: this.model.address });
        this.form.patchValue({ balance: this.model.balance });
      }
    }
  }
  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.supplierService.manage({
        supplierId: this.model ? this.model.supplierId : this.blankGuid,
        name: this.form.value.name,
        accountNo: 0,
        address: this.form.value.address,
        balance: Utility.toFloat(this.form.value.balance),
        contactNo: this.form.value.contactNo,
        contactPerson: this.form.value.contactPerson,
        email: this.form.value.email,
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
