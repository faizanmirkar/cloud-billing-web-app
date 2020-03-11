import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationIndexComponent } from './views/quotation-index/quotation-index.component';
import { ManageQuotationComponent } from './views/manage-quotation/manage-quotation.component';
import { QuotationDetailsViewComponent } from './views/quotation-details-view/quotation-details-view.component';


const routes: Routes = [
  {
    path: '',
    component: QuotationIndexComponent
  },
  {
    path: 'manage',
    component: ManageQuotationComponent
  },
  {
    path: 'manage/:id',
    component: ManageQuotationComponent
  },
  {
    path: 'view/:id',
    component: QuotationDetailsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
