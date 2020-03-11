import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FyIndexComponent } from './views/fy-index/fy-index.component';


const routes: Routes = [{
  path: '',
  component: FyIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialYearRoutingModule { }
