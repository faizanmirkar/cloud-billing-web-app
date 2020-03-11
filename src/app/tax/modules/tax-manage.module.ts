import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageTaxComponent } from '../views/manage-tax/manage-tax.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';

@NgModule({
  declarations: [ManageTaxComponent],
  entryComponents: [ManageTaxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    PrimeNgModule
  ],
  exports: [ManageTaxComponent]
})
export class TaxManageModule { }
