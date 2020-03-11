import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { TaxService } from '../../services/tax.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { TaxModel, TaxSearchFilter } from '../../models/tax';
import { ManageTaxComponent } from '../manage-tax/manage-tax.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-tax-index',
  templateUrl: './tax-index.component.html',
  styleUrls: ['./tax-index.component.scss']
})
export class TaxIndexComponent extends TableBaseComponent<TaxModel> implements OnInit, OnDestroy {


  filter: TaxSearchFilter;
  constructor(
    private injector: Injector,
    private taxService: TaxService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loader: LoaderService) {
    super(injector);
    this.filter = new TaxSearchFilter('percentage');
  }

  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('name', 'Name', TableColumnType.Text, 'name');
    this.addColumn('percentage', 'Percentage', TableColumnType.Number, 'percentage');
    this.addColumn('description', 'Description', TableColumnType.Text);
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
  }

  doSearch(): void {
    this.taxService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleRenderAction(item: TableAction<TaxModel>): boolean {
    return true;
  }

  handleAction(action: TableAction<TaxModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.taxService.delete(action.row.taxId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.taxService.changeStatus(action.row.taxId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
        });
      } break;
    }
  }

  manageView(model: TaxModel) {
    const ref = this.dialogService.open(ManageTaxComponent, {
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
