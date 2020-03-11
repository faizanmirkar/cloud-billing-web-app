import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { SearchFilter, SearchResult, IResult } from 'src/app/shared/models/result';
import { Utility } from 'src/app/shared/services/utility';
import { RoleViewModel, RoleManageModel } from '../models/user';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: SearchFilter) {
    return this.http.post<SearchResult<RoleViewModel>>(`${this.apiUrl}/role/search`, filter);
  }

  manage(model: RoleManageModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/role/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/role/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/role/${id}`);
  }

  items() {
    return this.http.get<RoleViewModel[]>(`${this.apiUrl}/role/items`);
  }

  modules() {
    return this.http.get<KeyValue<string, string>[]>(`${this.apiUrl}/role/modules`);
  }
}
