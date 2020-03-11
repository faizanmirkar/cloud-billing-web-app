import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { TaxSearchFilter, TaxModel } from '../models/tax';
import { SearchResult, IResult } from 'src/app/shared/models/result';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class TaxService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: TaxSearchFilter) {
    return this.http.post<SearchResult<TaxModel>>(`${this.apiUrl}/tax/search`, filter);
  }

  manage(model: TaxModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/tax/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/tax/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/tax/${id}`);
  }

  items() {
    return this.http.get<TaxModel[]>(`${this.apiUrl}/tax/items`);
  }
}
