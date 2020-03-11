import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxIndexComponent } from './views/tax-index/tax-index.component';

const routes: Routes = [{
  path: '',
  component: TaxIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
