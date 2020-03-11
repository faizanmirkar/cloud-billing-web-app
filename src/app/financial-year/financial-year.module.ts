import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialYearRoutingModule } from './financial-year-routing.module';
import { FyIndexComponent } from './views/fy-index/fy-index.component';
import { ManagefyComponent } from './views/managefy/managefy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/modules/prime-ng.module';
import { AppCommonModule } from '../shared/modules/app-common.module';
import { CustomTableModule } from '../shared/modules/custom-table/custom-table.module';


@NgModule({
  declarations: [FyIndexComponent, ManagefyComponent],
  entryComponents: [ManagefyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    AppCommonModule,
    CustomTableModule,
    FinancialYearRoutingModule
  ]
})
export class FinancialYearModule { }
