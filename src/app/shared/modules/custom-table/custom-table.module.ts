import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomTableComponent } from './custom-table.component';
import { PrimeNgModule } from '../prime-ng.module';

@NgModule({
  declarations: [CustomTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  exports: [CustomTableComponent]
})
export class CustomTableModule { }
