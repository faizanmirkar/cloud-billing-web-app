import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageSupplierComponent } from '../views/manage-supplier/manage-supplier.component';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';



@NgModule({
  declarations: [ManageSupplierComponent],
  entryComponents: [ManageSupplierComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    PrimeNgModule,
  ],
  exports: [ManageSupplierComponent]
})
export class SupplierManageModule { }
