import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { SupplierModel } from '../../models/supplier';
import { SearchFilter } from 'src/app/shared/models/result';
import { SupplierService } from '../../services/supplier.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { ManageSupplierComponent } from '../manage-supplier/manage-supplier.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-supplier-index',
  templateUrl: './supplier-index.component.html',
  styleUrls: ['./supplier-index.component.scss']
})
export class SupplierIndexComponent extends TableBaseComponent<SupplierModel> implements OnInit, OnDestroy {


  filter: SearchFilter;
  constructor(
    private injector: Injector,
    private supplierService: SupplierService,
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
    this.addColumn('accountNo', 'AccountNo', TableColumnType.Text, 'accountNo');
    this.addColumn('name', 'Name', TableColumnType.Text, 'name');
    this.addColumn('contactPerson', 'Contact Person', TableColumnType.Text, 'contactPerson');
    this.addColumn('contactNo', 'ContactNo', TableColumnType.Text, 'contactNo');
    this.addColumn('email', 'Email', TableColumnType.Text, 'email');
    this.addColumn('address', 'Address', TableColumnType.Text);
    this.addColumn('balance', 'Balance', TableColumnType.Number, 'balance');
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
  }

  doSearch(): void {
    this.supplierService.search(this.filter).subscribe(value => {
      this.result = value;
      this.customFilterApplied = false;
    });
  }

  handleRenderAction(item: TableAction<SupplierModel>): boolean {
    return true;
  }

  handleAction(action: TableAction<SupplierModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.supplierService.delete(action.row.supplierId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.supplierService.changeStatus(action.row.supplierId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
        });
      } break;
    }
  }

  manageView(model: SupplierModel) {
    const ref = this.dialogService.open(ManageSupplierComponent, {
      header: 'Manage',
      width: '60%',
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
