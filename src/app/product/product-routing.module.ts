import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductIndexComponent } from './views/product-index/product-index.component';

const routes: Routes = [{
  path: '',
  component: ProductIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
