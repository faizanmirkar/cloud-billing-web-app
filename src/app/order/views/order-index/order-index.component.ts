import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { OrderDetailsViewModel, OrderSearchFilter } from '../../models/order';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-index',
  templateUrl: './order-index.component.html',
  styleUrls: ['./order-index.component.scss']
})
export class OrderIndexComponent extends TableBaseComponent<OrderDetailsViewModel> implements OnInit, OnDestroy {


  filter: OrderSearchFilter;
  orderSubscription: Subscription;

  constructor(
    private injector: Injector,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router) {
    super(injector);
    this.filter = new OrderSearchFilter('CreatedOn');
    this.filter.sortOrder = -1;
  }

  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('orderNo', 'Order#', TableColumnType.Text, 'orderNo');
    this.addColumn('supplierName', 'Supplier', TableColumnType.Text, 'supplierName');
    this.addColumn('totalQty', 'Qty', TableColumnType.Number, 'totalQty');
    this.addColumn('totalUnitPrice', 'Total', TableColumnType.Number, 'totalUnitPrice');
    this.addColumn('totalTaxAmount', 'Vat Amt.', TableColumnType.Number, 'totalTaxAmount');
    this.addColumn('sumTotalPrice', 'Sum Total', TableColumnType.Number, 'sumTotalPrice');
    this.addColumn('createdByName', 'User', TableColumnType.Text, 'createdByName');
    this.addColumn('createdOn', 'Created On', TableColumnType.DateTime);
    this.addEditColumn();
    this.addActionColumn('view', 'View', 'fa fa-eye');
  }

  doSearch(): void {
    this.orderSubscription = this.orderService.search(this.filter).subscribe(value => {
      this.result = value;
      this.customFilterApplied = false;
    });
  }

  handleAction(action: TableAction<OrderDetailsViewModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.router.navigateByUrl(`/app/order/manage/${action.row.orderId}`);
      } break;
      case 'delete': {
        this.orderService.delete(action.row.orderId).subscribe(result => {
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'view': {
        this.router.navigateByUrl(`/app/order/view/${action.row.orderId}`);
      }
    }
  }

  handleRenderAction(item: TableAction<OrderDetailsViewModel>): boolean {
    return true;
  }

  handleSearch(value: string) {
    if (this.filter.searchTerm !== value) {
      this.filter.searchTerm = value;
      this.customFilterApplied = true;
      this.doSearch();
    }
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

}
