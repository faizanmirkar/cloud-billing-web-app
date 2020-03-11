import { Component, OnInit, Injector } from '@angular/core';
import { TaxService } from '../../services/tax.service';
import { TaxModel } from '../../models/tax';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';

@Component({
  selector: 'app-manage-tax',
  templateUrl: './manage-tax.component.html',
  styleUrls: ['./manage-tax.component.scss']
})
export class ManageTaxComponent extends BaseComponent implements OnInit {

  model: TaxModel = null;
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private toastService: ToastService,
    private loader: LoaderService) {
    super(injector);
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      percentage: this.formBuilder.control('', [Validators.required]),
      desc: this.formBuilder.control('')
    });
  }

  ngOnInit() {
    if (this.config.data) {
      this.model = this.config.data.model as TaxModel;
      if (this.model) {
        this.form.patchValue({ name: this.model.name });
        this.form.patchValue({ percentage: this.model.percentage });
        this.form.patchValue({ desc: this.model.description });
      }
    }
  }
  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.taxService.manage({
        taxId: this.model ? this.model.taxId : this.blankGuid,
        name: this.form.value.name,
        description: this.form.value.desc,
        percentage: this.form.value.percentage,
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
