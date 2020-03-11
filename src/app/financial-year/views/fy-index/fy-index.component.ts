import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { FyModel } from '../../models/fy';
import { SearchFilter } from 'src/app/shared/models/result';
import { FyService } from '../../services/fy.service';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { ManagefyComponent } from '../managefy/managefy.component';

@Component({
  selector: 'app-fy-index',
  templateUrl: './fy-index.component.html',
  styleUrls: ['./fy-index.component.scss']
})
export class FyIndexComponent extends TableBaseComponent<FyModel> implements OnInit, OnDestroy {
  

  filter: SearchFilter;
  constructor(
    private injector: Injector,
    private fyService: FyService,
    private toast: ToastService,
    private dialog: DialogService,
    private loader: LoaderService) {
    super(injector);
    this.filter = new SearchFilter('fromDate');
    this.filter.sortOrder = -1;
  }


  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('fromDate', 'From', TableColumnType.Date);
    this.addColumn('toDate', 'To', TableColumnType.Date);
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
  }

  doSearch(): void {
    this.fyService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleAction(action: TableAction<FyModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.fyService.delete(action.row.financialYearId).subscribe(result => {
          this.loader.hide();
          this.toast.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.fyService.changeStatus(action.row.financialYearId).subscribe(result => {
          this.loader.hide();
          this.toast.show(result);
        });
      } break;
    }
  }
  
  handleRenderAction(item: TableAction<FyModel>): boolean {
    throw new Error("Method not implemented.");
  }

  manageView(model: FyModel) {
    const ref = this.dialog.open(ManagefyComponent, {
      header: 'Manage',
      width: '30%',
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
