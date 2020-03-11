import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingIndexComponent } from './views/setting-index/setting-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/modules/prime-ng.module';
import { AppCommonModule } from '../shared/modules/app-common.module';


@NgModule({
  declarations: [SettingIndexComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    AppCommonModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
