import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TableBaseComponent } from 'src/app/wrapper/table-base-component';
import { ProductSearchFilter, ProductViewDetailsModel } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogService } from 'primeng/api';
import { TableColumnType, TableAction } from 'src/app/shared/models/table';
import { ManageProductComponent } from '../manage-product/manage-product.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.scss']
})
export class ProductIndexComponent extends TableBaseComponent<ProductViewDetailsModel> implements OnInit, OnDestroy {


  filter: ProductSearchFilter;
  fromFilter: boolean;
  constructor(
    private injector: Injector,
    private productService: ProductService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private loader: LoaderService) {
    super(injector);
    this.filter = new ProductSearchFilter('name');
  }

  ngOnInit() {
    this.initColumns();
  }

  initColumns(): void {
    this.addColumn('name', 'Item Name', TableColumnType.Text, 'name', null, 25);
    this.addColumn('code', 'Code', TableColumnType.Text, 'code');
    this.addColumn('barcode', 'Barcode', TableColumnType.Text, 'barcode');
    this.addColumn('categoryName', 'Cat.', TableColumnType.Text, 'categoryName');
    this.addColumn('subCategoryName', 'SubCat.', TableColumnType.Text, 'subCategoryName');
    this.addColumn('unitName', 'Unit', TableColumnType.Text, 'unitName');
    this.addColumn('taxPercentage', 'Tax %', TableColumnType.Number, 'taxPercentage');
    this.addColumn('costPriceInclusive', 'Cost Incl.', TableColumnType.Number);
    this.addColumn('sellingPriceInclusive', 'Selling Incl.', TableColumnType.Number);
    this.addColumn('displayCostCode', 'CC', TableColumnType.Text);
    this.addColumn('orderLevel', 'Order', TableColumnType.Text, null, null, 4);
    this.addColumn('status', 'Status', TableColumnType.YesNo, null, null, 4);
    this.addCommonActionColumns();
  }

  doSearch(): void {
    this.productService.search(this.filter).subscribe(value => {
      this.result = value;
      this.fromFilter = false;
      this.customFilterApplied = false;
    });
  }

  handleAction(action: TableAction<ProductViewDetailsModel>): void {
    switch (action.column.key) {
      case 'edit': {
        this.manageView(action.row);
      } break;
      case 'delete': {
        this.loader.show();
        this.productService.delete(action.row.productId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
          if (this.isSuccessResult(result)) {
            this.doSearch();
          }
        });
      } break;
      case 'status': {
        this.loader.show();
        this.productService.changeStatus(action.row.productId).subscribe(result => {
          this.loader.hide();
          this.toastService.show(result);
        });
      } break;
    }
  }

  handleRenderAction(item: TableAction<ProductViewDetailsModel>): boolean {
    return true;
  }

  manageView(model: ProductViewDetailsModel) {
    const ref = this.dialogService.open(ManageProductComponent, {
      header: 'Manage',
      width: '80%',
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
