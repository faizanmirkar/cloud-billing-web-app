import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { LocationSearchFilter, LocationModel } from '../models/location';
import { SearchResult, IResult } from 'src/app/shared/models/result';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: LocationSearchFilter) {
    return this.http.post<SearchResult<LocationModel>>(`${this.apiUrl}/location/search`, filter);
  }

  manage(model: LocationModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/location/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/location/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/location/${id}`);
  }

  items() {
    return this.http.get<LocationModel[]>(`${this.apiUrl}/location/items`);
  }

  manageTerm(model: any) {
    return this.http.post<IResult>(`${this.apiUrl}/location/manage-term`, model);
  }

  term(locationId: string) {
    return this.http.get<any>(`${this.apiUrl}/location/term/${locationId}`);
  }
}
