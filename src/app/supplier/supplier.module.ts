import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierIndexComponent } from './views/supplier-index/supplier-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { SupplierManageModule } from './modules/supplier-manage.module';
import { DialogService } from 'primeng/api';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';


@NgModule({
  declarations: [SupplierIndexComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CustomTableModule,
    AppCommonModule,
    SupplierManageModule,
    SupplierRoutingModule
  ],
  providers: [DialogService]
})
export class SupplierModule { }
