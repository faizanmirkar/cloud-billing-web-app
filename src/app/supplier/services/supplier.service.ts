import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { SearchFilter, SearchResult, IResult } from 'src/app/shared/models/result';
import { SupplierModel } from '../models/supplier';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: SearchFilter) {
    return this.http.post<SearchResult<SupplierModel>>(`${this.apiUrl}/supplier/search`, filter);
  }

  manage(model: SupplierModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/supplier/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/supplier/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/supplier/${id}`);
  }

  items() {
    return this.http.get<SupplierModel[]>(`${this.apiUrl}/supplier/items`);
  }
}
