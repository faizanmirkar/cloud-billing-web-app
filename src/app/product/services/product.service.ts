import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { ProductSearchFilter, ProductViewDetailsModel, ProductViewModel, ProductPriceModel } from '../models/product';
import { SearchResult, IResult } from 'src/app/shared/models/result';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: ProductSearchFilter) {
    return this.http.post<SearchResult<ProductViewDetailsModel>>(`${this.apiUrl}/product/search`, filter);
  }

  manage(model: ProductViewModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/product/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/product/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/product/${id}`);
  }

  prices(productId: string) {
    return this.http.get<ProductPriceModel[]>(`${this.apiUrl}/product/prices/${productId}`);
  }

  getNextCode() {
    return this.http.get<number>(`${this.apiUrl}/setting/next-product-serialno`);
  }

}
