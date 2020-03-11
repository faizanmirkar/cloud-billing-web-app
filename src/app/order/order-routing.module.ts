import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderIndexComponent } from './views/order-index/order-index.component';
import { ManageOrderComponent } from './views/manage-order/manage-order.component';
import { OrderDetailsViewComponent } from './views/order-details-view/order-details-view.component';


const routes: Routes = [
  {
    path: '',
    component: OrderIndexComponent
  },
  {
    path: 'manage',
    component: ManageOrderComponent
  },
  {
    path: 'manage/:id',
    component: ManageOrderComponent
  },
  {
    path: 'view/:id',
    component: OrderDetailsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
