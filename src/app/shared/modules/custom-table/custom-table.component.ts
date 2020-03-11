import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableColumnType, TableColumn, TableAction } from 'src/app/shared/models/table';
import { SearchResult, SearchFilter } from 'src/app/shared/models/result';
import { ConfirmationService } from 'primeng/api';
import { Utility } from 'src/app/shared/services/utility';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit {

  loading = true;
  columnType = TableColumnType;
  private result: SearchResult<any>;
  dataFilter: SearchFilter;
  totalRecords = 0;

  actionColumns: TableColumn[] = [];
  dataColumns: TableColumn[] = [];
  @Output() filterChanged = new EventEmitter<SearchFilter>();
  @Output() action = new EventEmitter<TableAction<any>>();
  @Input() renderAction: (col: TableAction<any>) => boolean;

  @Input()
  set columns(values: TableColumn[]) {
    if (values) {
      this.dataColumns = values.filter(m => m.type !== TableColumnType.Action);
      this.actionColumns = values.filter(m => m.type === TableColumnType.Action);
    }
  }
  @Input()
  set rows(value: SearchResult<any>) {
    if (value) {
      this.result = value;
      this.totalRecords = value.total;
      this.loading = false;
    }
  }
  get values() {
    if (this.result) {
      return this.result.results;
    }
    return [];
  }

  @Input()
  set filter(value: SearchFilter) {
    this.dataFilter = value;
  }

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit() {
  }

  handleLazyEvent(event: any) {
    this.loading = true;
    if (this.dataFilter && event) {
      this.dataFilter.pageNo = Number(event.first);
      this.dataFilter.perPage = Number(event.rows);
      // check for sort
      if (event.sortField) {
        this.dataFilter.sortField = event.sortField;
        this.dataFilter.sortOrder = Number(event.sortOrder);
      }
      this.filterChanged.emit(this.dataFilter);
    }
  }

  handleAction(col: TableColumn, row: any) {
    if (col.key == 'delete') {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.action.emit({
            column: col,
            row
          });
        }
      });
    } else {
      this.action.emit({
        column: col,
        row
      });
    }
  }

  canRenderAction(column: TableColumn, row: any): boolean {
    if (this.renderAction) {
      return this.renderAction({ column, row });
    }
    return true;
  }

  toDate(ticks: number): Date {
    return Utility.ticksToDate(ticks);
  }

  get showingRecord() {
    let totalPages = this.dataFilter.perPage;
    if (this.dataFilter.pageNo > 0) {
      const total = Math.floor(((this.dataFilter.pageNo * this.dataFilter.perPage) / this.dataFilter.perPage));
      totalPages = total + this.dataFilter.pageNo;
    }
    totalPages = totalPages > this.totalRecords ? this.totalRecords : totalPages;
    return `Showing ${this.dataFilter.pageNo + 1} to ${totalPages} out of ${this.totalRecords} entries`;
  }

}
