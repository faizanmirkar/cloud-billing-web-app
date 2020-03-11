import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { ManageMasterComponent } from '../views/manage-master/manage-master.component';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';

@NgModule({
  declarations: [ManageMasterComponent],
  entryComponents: [ManageMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    PrimeNgModule
  ],
  exports: [ManageMasterComponent]
})
export class MasterManageModule { }
