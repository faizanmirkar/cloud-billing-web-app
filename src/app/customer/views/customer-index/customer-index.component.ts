import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { CustomerModel } from '../../models/customer';
import { SearchFilter } from 'src/app/shared/models/result';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { ManageCustomerComponent } from '../manage-customer/manage-customer.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-customer-index',
  templateUrl: './customer-index.component.html',
  styleUrls: ['./customer-index.component.scss']
})
export class CustomerIndexComponent extends TableBaseComponent<CustomerModel> implements OnInit, OnDestroy {


  filter: SearchFilter;
  constructor(
    private injector: Injector,
    private customerService: CustomerService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loader: LoaderService) {
    super(injector);
    this.filter = new SearchFilter('name');
  }

  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('name', 'Name', TableColumnType.Text, 'name');
    this.addColumn('mobileNo', 'ContactNo', TableColumnType.Text, 'mobileNo');
    this.addColumn('email', 'Email', TableColumnType.Text, 'email');
    this.addColumn('address', 'Address', TableColumnType.Text);
    this.addColumn('accountTypeName', 'Account Type', TableColumnType.Text, 'accountType');
    this.addColumn('openingBalance', 'Opening Balance', TableColumnType.Number, 'openingBalance');
    this.addColumn('creditLimit', 'Credit Limit', TableColumnType.Number, 'creditLimit');
    this.addColumn('termName', 'Term', TableColumnType.Text, 'terms');
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addEditColumn();
  }

  doSearch(): void {
    this.customerService.search(this.filter).subscribe(value => {
      this.result = value;
      this.customFilterApplied = false;
    });
  }

  handleAction(action: TableAction<CustomerModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.customerService.delete(action.row.customerId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.customerService.changeStatus(action.row.customerId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
        });
      } break;
    }
  }

  handleRenderAction(item: TableAction<CustomerModel>): boolean {
    return true;
  }

  manageView(model: CustomerModel) {
    const ref = this.dialogService.open(ManageCustomerComponent, {
      header: 'Manage',
      width: '50%',
      data: { model }
    });

    ref.onClose.subscribe(value => {
      if (value) {
        this.doSearch();
      }
    });
  }

  handleSearch(value: string) {
    if (this.filter.searchTerm !== value) {
      this.filter.searchTerm = value;
      this.customFilterApplied = true;
      this.doSearch();
    }
  }

  ngOnDestroy(): void {

  }
}
