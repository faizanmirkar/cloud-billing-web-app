import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { FyModel } from '../../models/fy';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { FyService } from '../../services/fy.service';
import { Utility } from 'src/app/shared/services/utility';

@Component({
  selector: 'app-managefy',
  templateUrl: './managefy.component.html',
  styleUrls: ['./managefy.component.scss']
})
export class ManagefyComponent extends BaseComponent implements OnInit {

  model: FyModel = null;
  constructor(
    private injector: Injector,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private fyService: FyService,
    private toast: ToastService,
    private loader: LoaderService) {
    super(injector);

    this.form = this.formBuilder.group({
      fromDate: this.formBuilder.control('', [Validators.required]),
      toDate: this.formBuilder.control('', [Validators.required]),
    });
  }

  ngOnInit() {
    if (this.config.data) {
      this.model = this.config.data.model as FyModel;
      if (this.model) {
        this.form.patchValue({ fromDate: this.model.fromDate });
        this.form.patchValue({ toDate: this.model.toDate });
      }
    }
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.fyService.manage({
        financialYearId: this.model ? this.model.financialYearId : this.blankGuid,
        fromDate: Utility.toTicks(this.getValue('fromDate')),
        status: true,
        toDate: Utility.toTicks(this.getValue('toDate'))
      }).subscribe(result => {
        this.loader.hide();
        this.toast.show(result);
        if (this.isSuccessResult(result)) {
          this.dialogRef.close(result);
        }
      });
    }
  }

}
