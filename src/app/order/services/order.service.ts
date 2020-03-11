import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { IResult, SearchResult } from 'src/app/shared/models/result';
import { OrderManageModel, OrderSearchFilter, OrderDetailsViewModel } from '../models/order';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  manage(model: OrderManageModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/order/manage`, model);
  }

  search(filter: OrderSearchFilter) {
    return this.http.post<SearchResult<OrderDetailsViewModel>>(`${this.apiUrl}/order/search`, filter);
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/order/${id}`);
  }

  byId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/order/view/${id}`);
  }
}
