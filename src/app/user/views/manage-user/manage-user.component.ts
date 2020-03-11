import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { UserViewModel } from '../../models/user';
import { DynamicDialogRef, DynamicDialogConfig, SelectItem } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { UserService } from '../../services/user.service';
import { LocationService } from 'src/app/location/services/location.service';
import { Utility } from 'src/app/shared/services/utility';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent extends BaseComponent implements OnInit, OnDestroy {

  model: UserViewModel = null;
  locations: SelectItem[] = [];
  roles: SelectItem[] = [];


  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toast: ToastService,
    private loader: LoaderService,
    private roleService: RoleService,
    private locationService: LocationService) {
    super(injector);
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.email]),
      locationId: this.formBuilder.control('', [Validators.required]),
      name: this.formBuilder.control('', [Validators.required]),
      roleId: this.formBuilder.control('', [Validators.required]),
      userName: this.formBuilder.control('', [Validators.required]),
      phoneNo: this.formBuilder.control(''),
      pwd: this.formBuilder.control('')
    });
  }

  ngOnInit() {
    // check for config
    if (this.config.data) {
      this.model = this.config.data as UserViewModel;
      this.form.patchValue({ email: this.model.email });
      this.form.patchValue({ locationId: this.model.locationId });
      this.form.patchValue({ name: this.model.name });
      this.form.patchValue({ roleId: this.model.roleId });
      this.form.patchValue({ userId: this.model.userId });
      this.form.patchValue({ userName: this.model.userName });
      this.form.patchValue({ phoneNo: this.model.phoneNo });
    } else {
      this.form.get('pwd').setValidators(Validators.required);
    }

    // load location
    this.loadLocation();
    // load role
    this.loadRole();
  }

  private loadLocation() {
    const ref = this.locationService.items().subscribe(values => {
      this.locations = [];
      if (values) {
        this.locations = Utility.toSelectItems(values, 'locationId', 'name');
      }
    });
    this.subscription.add(ref);
  }

  private loadRole() {
    const ref = this.roleService.items().subscribe(values => {
      this.roles = [];
      if (values) {
        this.roles = Utility.toSelectItems(values, 'roleId', 'name');
      }
    });
    this.subscription.add(ref);
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      const ref = this.userService.manage({
        email: this.getValue('email'),
        locationId: this.getValue('locationId'),
        name: this.getValue('name'),
        roleId: this.getValue('roleId'),
        userId: this.model ? this.model.userId : this.blankGuid,
        userName: this.getValue('userName'),
        phoneNo: this.getValue('phoneNo'),
        pwd: this.getValue('pwd')
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
