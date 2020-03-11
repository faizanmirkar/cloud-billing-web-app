import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { LocationModel, LocationSearchFilter } from '../../models/location';
import { TableAction, TableColumnType } from 'src/app/shared/models/table';
import { LocationService } from '../../services/location.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { ManageLocationComponent } from '../manage-location/manage-location.component';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ManageLocationTermComponent } from '../manage-location-term/manage-location-term.component';

@Component({
  selector: 'app-location-index',
  templateUrl: './location-index.component.html',
  styleUrls: ['./location-index.component.scss']
})
export class LocationIndexComponent extends TableBaseComponent<LocationModel> implements OnInit, OnDestroy {
  

  filter: LocationSearchFilter;
  constructor(
    private injector: Injector,
    private locationService: LocationService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loader: LoaderService) {
    super(injector);
    this.filter = new LocationSearchFilter('name');
  }


  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('name', 'Name', TableColumnType.Text, 'name');
    this.addColumn('status', 'Status', TableColumnType.YesNo);
    this.addCommonActionColumns();
    this.addActionColumn('term', 'Terms & Condition');
  }

  doSearch(): void {
    this.locationService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleAction(action: TableAction<LocationModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'term': {
        this.manageTermView(action.row.locationId);
      } break;
      case 'delete': {
        this.loader.show();
        this.locationService.delete(action.row.locationId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.locationService.changeStatus(action.row.locationId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
        });
      } break;
    }
  }

  handleRenderAction(item: TableAction<LocationModel>): boolean {
    return true;
  }

  manageView(model: LocationModel) {
    const ref = this.dialogService.open(ManageLocationComponent, {
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

  manageTermView(locationId: string) {
    const ref = this.dialogService.open(ManageLocationTermComponent, {
      header: 'Terms',
      width: '60%',
      data: locationId
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
