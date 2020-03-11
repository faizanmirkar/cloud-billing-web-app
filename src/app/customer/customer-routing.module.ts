import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerIndexComponent } from './views/customer-index/customer-index.component';


const routes: Routes = [{
  path: '',
  component: CustomerIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
