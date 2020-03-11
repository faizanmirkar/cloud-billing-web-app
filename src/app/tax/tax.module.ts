import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxRoutingModule } from './tax-routing.module';
import { TaxIndexComponent } from './views/tax-index/tax-index.component';
import { DialogService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { TaxManageModule } from './modules/tax-manage.module';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';


@NgModule({
  declarations: [TaxIndexComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CustomTableModule,
    AppCommonModule,
    TaxManageModule,
    TaxRoutingModule
  ],
  providers: [DialogService]
})
export class TaxModule { }
