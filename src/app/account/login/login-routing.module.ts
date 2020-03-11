import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginIndexViewComponent } from './views/login-index-view/login-index-view.component';


const routes: Routes = [{
  path: '',
  component: LoginIndexViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
