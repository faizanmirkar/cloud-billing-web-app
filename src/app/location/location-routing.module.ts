import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationIndexComponent } from './views/location-index/location-index.component';

const routes: Routes = [{
  path: '',
  component: LocationIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
