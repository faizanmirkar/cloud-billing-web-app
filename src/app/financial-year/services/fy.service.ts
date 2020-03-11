import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { SearchFilter, SearchResult, IResult } from 'src/app/shared/models/result';
import { FyModel } from '../models/fy';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class FyService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: SearchFilter) {
    return this.http.post<SearchResult<FyModel>>(`${this.apiUrl}/fy/search`, filter);
  }

  manage(model: FyModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/fy/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/fy/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/fy/${id}`);
  }

  items() {
    return this.http.get<FyModel[]>(`${this.apiUrl}/fy/items`);
  }
}
