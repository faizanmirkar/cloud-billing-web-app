import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/api';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { AppCommonModule } from '../app-common.module';
import { PrimeNgModule } from '../prime-ng.module';



@NgModule({
  declarations: [ProductTableComponent, ProductSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    PrimeNgModule
  ],
  providers: [DialogService],
  exports: [ProductTableComponent, ProductSearchComponent]
})
export class ProductCommonModule { }
