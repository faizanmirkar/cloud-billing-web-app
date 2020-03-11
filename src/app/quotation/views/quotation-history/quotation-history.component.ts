import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { QuotationService } from '../../services/quotation.service';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { QuotationDetailsViewModel, QuotationSearchFilter } from '../../models/quotation';
import { TableAction, TableColumnType } from 'src/app/shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotation-history',
  templateUrl: './quotation-history.component.html',
  styleUrls: ['./quotation-history.component.scss']
})
export class QuotationHistoryComponent extends TableBaseComponent<QuotationDetailsViewModel> implements OnInit, OnDestroy {


  filter: QuotationSearchFilter;
  private quotationSubscription: Subscription;
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private quotationService: QuotationService) {
    super(injector);
    this.filter = new QuotationSearchFilter('CreatedOn');
    this.filter.sortOrder = -1;
  }

  ngOnInit() {
    this.filter.customerId = this.config.data.customerId;
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('quotationNo', 'Quotation#', TableColumnType.Text, 'quotationNo');
    this.addColumn('totalQty', 'Qty', TableColumnType.Number, 'totalQty');
    this.addColumn('totalUnitPrice', 'Total', TableColumnType.Number, 'totalUnitPrice');
    this.addColumn('totalDiscount', 'Discount', TableColumnType.Number, 'totalDiscount');
    this.addColumn('totalTaxAmount', 'Tax Amount', TableColumnType.Number, 'totalTaxAmount');
    this.addColumn('sumTotalPrice', 'Sum Total', TableColumnType.Number, 'sumTotalPrice');
    this.addColumn('locationName', 'Branch', TableColumnType.Text, 'locationName');
    this.addColumn('memo', 'Memo', TableColumnType.Text, 'statusId');
    this.addColumn('createdOn', 'Created On', TableColumnType.DateTime);
  }

  doSearch(): void {
    this.quotationSubscription = this.quotationService.search(this.filter).subscribe(value => {
      this.result = value;
    });
  }

  handleRenderAction(item: TableAction<QuotationDetailsViewModel>): boolean {
    return false;
  }

  handleAction(action: TableAction<QuotationDetailsViewModel>): void {

  }

  ngOnDestroy(): void {
    if (this.quotationSubscription) {
      this.quotationSubscription.unsubscribe();
    }
  }
}
