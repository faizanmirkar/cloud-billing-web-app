import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderIndexComponent } from './views/order-index/order-index.component';
import { ManageOrderComponent } from './views/manage-order/manage-order.component';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { OrderDetailsViewComponent } from './views/order-details-view/order-details-view.component';
import { SupplierManageModule } from '../supplier/modules/supplier-manage.module';
import { ProductCommonModule } from 'src/app/shared/modules/product/product-common.module';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';


@NgModule({
  declarations: [
    OrderIndexComponent,
    ManageOrderComponent,
    OrderDetailsViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    ProductCommonModule,
    CustomTableModule,
    AppCommonModule,
    SupplierManageModule,
    NgxPrintModule,
    NgxBarcodeModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
