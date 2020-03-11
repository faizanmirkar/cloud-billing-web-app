import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingIndexComponent } from './views/setting-index/setting-index.component';


const routes: Routes = [{
  path: '',
  component: SettingIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
