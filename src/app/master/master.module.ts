import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { MasterIndexComponent } from './views/master-index/master-index.component';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/api';
import { MasterManageModule } from './modules/master-manage.module';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';


@NgModule({
  declarations: [MasterIndexComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CustomTableModule,
    MasterManageModule,
    AppCommonModule,
    MasterRoutingModule
  ],
  providers: [DialogService]
})
export class MasterModule { }
