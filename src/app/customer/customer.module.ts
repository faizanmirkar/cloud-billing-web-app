import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerIndexComponent } from './views/customer-index/customer-index.component';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageCustomerComponent } from './views/manage-customer/manage-customer.component';
import { CustomTableModule } from 'src/app/shared/modules/custom-table/custom-table.module';
import { DialogService } from 'primeng/api';


@NgModule({
  declarations: [CustomerIndexComponent, ManageCustomerComponent],
  entryComponents: [ManageCustomerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CustomTableModule,
    AppCommonModule,
    CustomerRoutingModule
  ],
  providers: [DialogService]
})
export class CustomerModule { }
