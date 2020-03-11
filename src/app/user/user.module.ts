import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserIndexComponent } from './views/user-index/user-index.component';
import { ManageUserComponent } from './views/manage-user/manage-user.component';
import { RoleIndexComponent } from './views/role-index/role-index.component';
import { ManageRoleComponent } from './views/manage-role/manage-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/modules/prime-ng.module';
import { CustomTableModule } from '../shared/modules/custom-table/custom-table.module';
import { AppCommonModule } from '../shared/modules/app-common.module';
import { RolePermissionComponent } from './views/role-permission/role-permission.component';


@NgModule({
  declarations: [
    UserIndexComponent,
    ManageUserComponent,
    RoleIndexComponent,
    ManageRoleComponent,
    RolePermissionComponent
  ],
  entryComponents: [
    ManageUserComponent,
    ManageRoleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CustomTableModule,
    AppCommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
