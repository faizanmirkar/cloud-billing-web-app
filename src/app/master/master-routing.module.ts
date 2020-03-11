import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterIndexComponent } from './views/master-index/master-index.component';

const routes: Routes = [{
  path: '',
  component: MasterIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
