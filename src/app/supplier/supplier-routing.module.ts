import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierIndexComponent } from './views/supplier-index/supplier-index.component';


const routes: Routes = [{
  path: '',
  component: SupplierIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
