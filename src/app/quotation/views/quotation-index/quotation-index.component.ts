import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { QuotationDetailsViewModel, QuotationSearchFilter } from '../../models/quotation';
import { TableAction, TableColumnType } from 'src/app/shared/models/table';
import { ToastService } from 'src/app/shared/services/toast.service';
import { QuotationService } from '../../services/quotation.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotation-index',
  templateUrl: './quotation-index.component.html',
  styleUrls: ['./quotation-index.component.scss']
})
export class QuotationIndexComponent extends TableBaseComponent<QuotationDetailsViewModel> implements OnInit, OnDestroy {

  filter: QuotationSearchFilter;
  private quotationSubscription: Subscription;

  constructor(
    private injector: Injector,
    private quotationService: QuotationService,
    private toastService: ToastService,
    private router: Router) {
    super(injector);
    this.filter = new QuotationSearchFilter('CreatedOn');
    this.filter.sortOrder = -1;
    this.filter.fromDate = new Date();
    this.filter.toDate = new Date(this.filter.fromDate.setMonth(1));
  }

  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('quotationNo', 'Quotation#', TableColumnType.Text, 'quotationNo');
    this.addColumn('customerName', 'Customer', TableColumnType.Text, 'customerName');
    this.addColumn('customerMobileNo', 'Contact No', TableColumnType.Text, 'customerMobileNo');
    this.addColumn('totalQty', 'Qty', TableColumnType.Number, 'totalQty');
    this.addColumn('totalUnitPrice', 'Total', TableColumnType.Number, 'totalUnitPrice');
    this.addColumn('totalDiscount', 'Dis.', TableColumnType.Number, 'totalDiscount');
    this.addColumn('totalTaxAmount', 'Vat Amt.', TableColumnType.Number, 'totalTaxAmount');
    this.addColumn('sumTotalPrice', 'Sum Total', TableColumnType.Number, 'sumTotalPrice');
    this.addColumn('createdByName', 'User', TableColumnType.Text, 'createdByName');
    this.addColumn('memo', 'Memo', TableColumnType.Text, 'statusId');
    this.addColumn('createdOn', 'Created On', TableColumnType.DateTime);
    this.addEditColumn();
    this.addActionColumn('view', 'View', 'fa fa-eye');
  }

  doSearch(): void {
    this.quotationSubscription = this.quotationService.search(this.filter).subscribe(value => {
      this.result = value;
      this.customFilterApplied = false;
    });
  }

  handleAction(action: TableAction<QuotationDetailsViewModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.router.navigateByUrl(`/app/quotation/manage/${action.row.quotationId}`);
      } break;
      case 'delete': {
        this.quotationService.delete(action.row.quotationId).subscribe(result => {
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'view': {
        this.router.navigateByUrl(`/app/quotation/view/${action.row.quotationId}`);
      }
    }
  }

  handleRenderAction(item: TableAction<QuotationDetailsViewModel>): boolean {
    if (item.column.key == 'edit') {
      if (item.row.statusId == 2) {
        return false;
      }
    }
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
    if (this.quotationSubscription) {
      this.quotationSubscription.unsubscribe();
    }
  }

}
