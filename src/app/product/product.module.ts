import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductIndexComponent } from './views/product-index/product-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { ManageProductComponent } from './views/manage-product/manage-product.component';
import { DialogService } from 'primeng/api';
import { TaxManageModule } from '../tax/modules/tax-manage.module';
import { MasterManageModule } from '../master/modules/master-manage.module';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';


@NgModule({
  declarations: [ProductIndexComponent, ManageProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CustomTableModule,
    MasterManageModule,
    AppCommonModule,
    TaxManageModule,
    ProductRoutingModule
  ],
  entryComponents: [ManageProductComponent],
  providers: [DialogService]
})
export class ProductModule { }
