import { Component, OnInit, Injector } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { MasterModel } from '../../models/master-model';
import { MasterService } from '../../services/master.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';

@Component({
  selector: 'app-manage-master',
  templateUrl: './manage-master.component.html',
  styleUrls: ['./manage-master.component.scss']
})
export class ManageMasterComponent extends BaseComponent implements OnInit {

  model: MasterModel = null;
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private toastService: ToastService,
    private loader: LoaderService) {
    super(injector);
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      desc: this.formBuilder.control('')
    });
  }

  ngOnInit() {
    if (this.config.data) {
      this.model = this.config.data.model as MasterModel;
      if (this.model) {
        this.form.patchValue({ name: this.model.name });
        this.form.patchValue({ desc: this.model.description });
      }
    }
  }
  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.masterService.manage({
        id: this.model ? this.model.id : this.blankGuid,
        name: this.form.value.name,
        description: this.form.value.desc,
        typeId: this.config.data.typeId,
        status: true,
        parentId: this.config.data.parentId
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
