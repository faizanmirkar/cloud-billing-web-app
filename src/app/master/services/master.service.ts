import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterModel, MasterSearchFilter, MasterTypes } from '../models/master-model';
import { IResult, SearchResult } from 'src/app/shared/models/result';
import { ApiService } from 'src/app/shared/services/api.service';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class MasterService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: MasterSearchFilter) {
    return this.http.post<SearchResult<MasterModel>>(`${this.apiUrl}/master/search`, filter);
  }

  manage(model: MasterModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/master/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/master/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/master/${id}`);
  }

  items(typeId: number) {
    return this.http.get<MasterModel[]>(`${this.apiUrl}/master/items/${typeId}`);
  }

  subItems(parentId: string) {
    return this.http.get<MasterModel[]>(`${this.apiUrl}/master/sub-items/${parentId}`);
  }

  categories() {
    return this.items(MasterTypes.Category);
  }

  subcategories(parentId: string) {
    return this.subItems(parentId);
  }

  units() {
    return this.items(MasterTypes.Unit);
  }

}
