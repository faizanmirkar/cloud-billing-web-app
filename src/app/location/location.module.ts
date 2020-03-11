import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationIndexComponent } from './views/location-index/location-index.component';
import { ManageLocationComponent } from './views/manage-location/manage-location.component';
import { DialogService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';
import { ManageLocationTermComponent } from './views/manage-location-term/manage-location-term.component';


@NgModule({
  declarations: [
    LocationIndexComponent,
    ManageLocationComponent,
    ManageLocationTermComponent
  ],
  entryComponents: [ManageLocationComponent, ManageLocationTermComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    AppCommonModule,
    CustomTableModule,
    LocationRoutingModule
  ],
  providers: [DialogService]
})
export class LocationModule { }
