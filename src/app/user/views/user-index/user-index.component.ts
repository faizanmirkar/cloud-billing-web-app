import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { SearchFilter } from 'src/app/shared/models/result';
import { UserService } from '../../services/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { UserViewModel } from '../../models/user';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { ManageUserComponent } from '../manage-user/manage-user.component';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.scss']
})
export class UserIndexComponent extends TableBaseComponent<UserViewModel> implements OnInit, OnDestroy {
  

  filter: SearchFilter;
  constructor(
    private injector: Injector,
    private userService: UserService,
    private toast: ToastService,
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
    this.addColumn('userName', 'User Name', TableColumnType.Text, 'userName');
    this.addColumn('roleName', 'Role', TableColumnType.Text);
    this.addColumn('locationName', 'Branch', TableColumnType.Text);
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
  }

  doSearch(): void {
    this.userService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleRenderAction(item: TableAction<UserViewModel>): boolean {
    return true;
  }

  handleAction(action: TableAction<UserViewModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.userService.delete(action.row.userId).subscribe(result => {
          this.loader.hide();
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.userService.changeStatus(action.row.userId).subscribe(result => {
          this.loader.hide();
          this.toast.show(result);
        });
      } break;
    }
  }

  manageView(model: UserViewModel) {
    const ref = this.dialogService.open(ManageUserComponent, {
      header: 'Manage',
      width: '40%',
      data: model
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
