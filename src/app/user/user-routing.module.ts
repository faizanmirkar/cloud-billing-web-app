import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserIndexComponent } from './views/user-index/user-index.component';
import { RoleIndexComponent } from './views/role-index/role-index.component';


const routes: Routes = [
  {
    path: 'user',
    component: UserIndexComponent
  },
  {
    path: 'role',
    component: RoleIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
