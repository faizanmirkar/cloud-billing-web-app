import { Component, OnInit, Output, EventEmitter, ViewChild, Input, AfterViewInit } from '@angular/core';
import { ProductSearchService } from '../services/product-search.service';
import { ProductViewDetailsModel } from 'src/app/product/models/product';
import { AutoComplete } from 'primeng/autocomplete';
import { ProductTableType } from '../models/product-table.model';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  @ViewChild('autoCompleteProduct', { static: true }) autoCompleteProduct: AutoComplete;
  @Output() itemSelect = new EventEmitter<ProductViewDetailsModel>();

  @Input()
  set focus(value: boolean) {
    if (value && this.autoCompleteProduct) {
      this.autoCompleteProduct.focusInput();
    }
  }

  @Input() type: ProductTableType;

  results: ProductViewDetailsModel[] = [];

  constructor(private productSearchService: ProductSearchService) { }

  ngOnInit() {
  }

  handleSearch(event: any) {
    const query = event.query;
    this.productSearchService.suggestions(query).subscribe(values => {
      this.results = [...values];
    });
  }

  handleSearchSelect(model: ProductViewDetailsModel) {
    if (model) {
      this.itemSelect.emit({ ...model });
      this.autoCompleteProduct.writeValue('');
      this.results = [];
    }
  }

  handleKeyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.results && this.results.length > 0) {
        if (this.results.length === 1) {
          this.handleSearchSelect(this.results[0]);
        }
      }
    }
  }

  displayPrice(product: ProductViewDetailsModel) {
    switch (this.type) {
      case ProductTableType.Quotation: {
        return product.sellingPrice;
      }
      case ProductTableType.Order: {
        return product.costPrice;
      }
      default: {
        return 0;
      }
    }
  }

}
