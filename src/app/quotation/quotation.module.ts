import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { NgxBarcodeModule } from 'ngx-barcode';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationIndexComponent } from './views/quotation-index/quotation-index.component';
import { ManageQuotationComponent } from './views/manage-quotation/manage-quotation.component';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { QuotationHistoryComponent } from './views/quotation-history/quotation-history.component';
import { QuotationDetailsViewComponent } from './views/quotation-details-view/quotation-details-view.component';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';
import { ProductCommonModule } from 'src/app/shared/modules/product/product-common.module';

@NgModule({
  declarations: [
    QuotationIndexComponent,
    ManageQuotationComponent,
    QuotationHistoryComponent,
    QuotationDetailsViewComponent
  ],
  entryComponents: [
    QuotationHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    ProductCommonModule,
    CustomTableModule,
    AppCommonModule,
    NgxPrintModule,
    NgxBarcodeModule,
    QuotationRoutingModule
  ]
})
export class QuotationModule { }
