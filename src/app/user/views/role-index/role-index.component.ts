import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { SearchFilter } from 'src/app/shared/models/result';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RoleViewModel } from '../../models/user';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { DialogService } from 'primeng/api';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { RoleService } from '../../services/role.service';
import { ManageRoleComponent } from '../manage-role/manage-role.component';

@Component({
  selector: 'app-role-index',
  templateUrl: './role-index.component.html',
  styleUrls: ['./role-index.component.scss']
})
export class RoleIndexComponent extends TableBaseComponent<RoleViewModel> implements OnInit, OnDestroy {
  

  filter: SearchFilter;
  constructor(
    private injector: Injector,
    private toast: ToastService,
    private dialogService: DialogService,
    private loader: LoaderService,
    private roleService: RoleService) {
    super(injector);
    this.filter = new SearchFilter('name');
  }

  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('name', 'Name', TableColumnType.Text, 'name');
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
  }

  doSearch(): void {
    this.roleService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleRenderAction(item: TableAction<RoleViewModel>): boolean {
    return true;
  }

  handleAction(action: TableAction<RoleViewModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.roleService.delete(action.row.roleId).subscribe(result => {
          this.loader.hide();
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.roleService.changeStatus(action.row.roleId).subscribe(result => {
          this.loader.hide();
          this.toast.show(result);
        });
      } break;
    }
  }

  manageView(model: RoleViewModel) {
    const ref = this.dialogService.open(ManageRoleComponent, {
      header: 'Manage Role',
      width: '40%',
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
    this.subscription.unsubscribe();
  }

}
