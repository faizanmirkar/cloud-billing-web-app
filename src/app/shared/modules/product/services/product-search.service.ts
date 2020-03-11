import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { ProductViewDetailsModel } from 'src/app/product/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  suggestions(text: string) {
    return this.http.get<ProductViewDetailsModel[]>(`${this.apiUrl}/product-search/suggestions?text=${text}`);
  }
}
