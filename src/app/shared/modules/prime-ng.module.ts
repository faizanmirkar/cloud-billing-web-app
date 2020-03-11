import { NgModule } from '@angular/core';
//
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { DialogService, ConfirmationService, MessageService } from 'primeng/api';

const modules = [
  MenubarModule,
  TableModule,
  ToastModule,
  InputSwitchModule,
  ConfirmDialogModule,
  DynamicDialogModule,
  KeyFilterModule,
  MultiSelectModule,
  CheckboxModule,
  DropdownModule,
  AutoCompleteModule,
  CalendarModule,
  EditorModule
];

@NgModule({
  declarations: [],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  imports: [...modules],
  exports: [...modules]
})
export class PrimeNgModule { }
