import { SearchResult } from '../shared/models/result';
import { TableColumn, TableColumnType, TableAction } from '../shared/models/table';
import { BaseComponent } from './base-component';

export abstract class TableBaseComponent<T> extends BaseComponent {

    customFilterApplied = false;
    result: SearchResult<T>;
    columns: TableColumn[] = [];
    abstract initColumns(): void;
    abstract doSearch(): void;
    abstract handleAction(action: TableAction<T>): void;
    abstract handleRenderAction(item: TableAction<T>): boolean;

    addColumn(id: string, name: string, columnType: TableColumnType, sortKey: string = null, icon: string = null, width: number = 0) {
        this.columns.push({
            key: id,
            value: name,
            sortKey,
            icon,
            type: columnType,
            width
        });
    }

    addEditColumn() {
        this.addColumn('edit', 'Edit', TableColumnType.Action, null, 'fa fa-edit');
    }

    addDeleteColumn() {
        this.addColumn('delete', 'Delete', TableColumnType.Action, null, 'fa fa-trash');
    }

    addCommonActionColumns() {
        this.addEditColumn();
        this.addDeleteColumn();
    }

    addActionColumn(id: string, name: string, icon: string = null) {
        this.addColumn(id, name, TableColumnType.Action, null, icon);
    }

    handlefilterChanged($event: any) {
        if (!this.customFilterApplied) {
            this.doSearch();
        }
    }
}
