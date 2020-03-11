import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Router, PRIMARY_OUTLET, UrlSegment, ActivatedRoute, ParamMap } from '@angular/router';
import { MasterModel, MasterSearchFilter, MasterTypes } from '../../models/master-model';
import { Subscription } from 'rxjs';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { MasterService } from '../../services/master.service';
import { DialogService } from 'primeng/api';
import { ManageMasterComponent } from '../manage-master/manage-master.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Breadcrumb } from 'src/app/shared/views/page-header/models/breadcrumb.model';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-master-index',
  templateUrl: './master-index.component.html',
  styleUrls: ['./master-index.component.scss']
})
export class MasterIndexComponent extends TableBaseComponent<MasterModel> implements OnInit, OnDestroy {


  title: string;
  filter: MasterSearchFilter;

  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private injector: Injector,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private masterService: MasterService,
    private dialogService: DialogService,
    private loader: LoaderService) {
    super(injector);
    this.filter = new MasterSearchFilter('name');
  }

  ngOnInit() {

    // for type
    this.activatedRoute.data.subscribe(value => {
      this.title = value.title;
      const typeId = Number(value.typeId);
      this.filter.typeId = typeId;
      // check for sub category
      if (this.filter.typeId === MasterTypes.SubCategory) {
        this.filter.parentId = this.activatedRoute.snapshot.paramMap.get('parentId');
        this.title = `${this.title} for ${this.activatedRoute.snapshot.queryParamMap.get('name')}`;
        this.breadcrumbs = [{
          name: 'Category list',
          link: '/app/manage/category'
        }];
      }
    });
    // load columns
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('name', 'Name', TableColumnType.Text, 'name');
    this.addColumn('description', 'Description', TableColumnType.Text);
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
    // for sub category
    if (this.filter.typeId === MasterTypes.Category) {
      this.addActionColumn('sub-category', 'SubCategory');
    }
  }

  doSearch(): void {
    this.masterService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleAction(action: TableAction<MasterModel>) {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.masterService.delete(action.row.id).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.masterService.changeStatus(action.row.id).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
        });
      } break;
      case 'sub-category': {
        this.route.navigateByUrl(`/app/manage/sub-category/${action.row.id}?name=${action.row.name}`);
      } break;
    }
  }

  handleRenderAction(item: TableAction<MasterModel>): boolean {
    return true;
  }

  manageView(model: MasterModel) {
    const ref = this.dialogService.open(ManageMasterComponent, {
      header: 'Manage',
      width: '50%',
      data: {
        typeId: this.filter.typeId,
        model,
        parentId: this.filter.parentId
      }
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
