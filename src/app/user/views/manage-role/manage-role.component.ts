import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { RoleViewModel } from '../../models/user';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { RoleService } from '../../services/role.service';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent extends BaseComponent implements OnInit, OnDestroy {

  model: RoleViewModel = null;

  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private loader: LoaderService,
    private roleService: RoleService) {
    super(injector);
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      permissions: this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnInit() {
    // check for config
    if (this.config.data) {
      this.model = this.config.data.model as RoleViewModel;
      if (this.model) {
        this.form.patchValue({ name: this.model.name });
        if (this.model.permissions) {
          const permissionIds = this.model.permissions.split(',');
          this.form.patchValue({ permissions: permissionIds });
        }
      }
    }
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      const ref = this.roleService.manage({
        name: this.getValue('name'),
        roleId: this.model ? this.model.roleId : this.blankGuid,
        permissionIds: this.getValue('permissions')
      }).subscribe(result => {
        this.loader.hide();
        this.toast.show(result);
        if (this.isSuccessResult(result)) {
          this.ref.close(result);
        }
      });
      this.subscription.add(ref);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
