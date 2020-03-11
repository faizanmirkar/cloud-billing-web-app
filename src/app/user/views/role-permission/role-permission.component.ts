import { Component, OnInit, OnDestroy, forwardRef, Injector } from '@angular/core';
import {
  Validator,
  ControlValueAccessor,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { PermissionModuleModel } from '../../models/user';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RolePermissionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RolePermissionComponent),
      multi: true
    }
  ]
})
export class RolePermissionComponent extends BaseComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  modules: PermissionModuleModel[] = [];
  accessModules: string[] = [];
  permissionModules: string[] = [];

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private roleService: RoleService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      items: this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnInit() {
    // load permissions
    this.loadPermission();
  }

  private loadPermission() {
    const ref = this.roleService.modules().subscribe(values => {
      if (values) {
        values.forEach(item => {
          this.modules.push({
            id: item.key,
            name: item.value,
            status: false
          });
        });
        // update status
        this.updateStatus();
      }
    });
    this.subscription.add(ref);
  }

  writeValue(moduleIds: string[]): void {
    if (moduleIds && Array.isArray(moduleIds)) {
      this.accessModules = moduleIds;
      this.form.get('items').patchValue(this.accessModules);
      this.updateStatus();
    }
  }

  private updateStatus() {
    if (this.accessModules) {
      this.modules.forEach(item => {
        if (this.accessModules.indexOf(item.id.toString()) > -1) {
          item.status = true;
        }
      });
    }
  }

  registerOnChange(fn: any): void {
    this.form.get('items').valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid ? null : { error: 'invalid permission' };
  }

  handleChange(checked: boolean, module: PermissionModuleModel) {
    // get index
    const index = this.accessModules.indexOf(module.id);
    if (checked) {
      if (index < 0) {
        this.accessModules.push(module.id);
      }
    } else {
      if (index > -1) {
        this.accessModules.splice(index, 1);
      }
    }

    if (this.accessModules.length > 0) {
      this.form.get('items').patchValue(this.accessModules);
    } else {
      this.form.get('items').patchValue('');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
