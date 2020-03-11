import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../views/page-header/page-header.component';
import { TextSearchComponent } from '../views/text-search/text-search.component';
import { RouterModule } from '@angular/router';
import { FieldErrorDirective } from '../directives/field-error.directive';
import { InlineFieldErrorComponent } from '../views/inline-field-error/inline-field-error.component';
import { NavigateDirective } from '../directives/navigate.directive';
import { TodatePipe } from '../pipes/todate.pipe';

const components = [
  PageHeaderComponent,
  TextSearchComponent,
  FieldErrorDirective,
  InlineFieldErrorComponent,
  NavigateDirective,
  TodatePipe
];

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AppCommonModule { }
