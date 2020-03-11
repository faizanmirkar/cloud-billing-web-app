import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { CustomerModel, CustomerViewModel } from '../models/customer';
import { SearchFilter, SearchResult, IResult } from 'src/app/shared/models/result';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: SearchFilter) {
    return this.http.post<SearchResult<CustomerViewModel>>(`${this.apiUrl}/customer/search`, filter);
  }

  manage(model: CustomerViewModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/customer/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/customer/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/customer/${id}`);
  }

  items() {
    return this.http.get<CustomerViewModel[]>(`${this.apiUrl}/customer/items`);
  }

  viewByMobileNo(mobileNo: string) {
    return this.http.get<CustomerViewModel>(`${this.apiUrl}/customer/view/by-mobile/${mobileNo}`);
  }

  getByMobile(mobileNo: string) {
    return this.http.get<CustomerViewModel>(`${this.apiUrl}/customer/view/by-mobile/${mobileNo}`);
  }
}
