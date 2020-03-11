import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { SearchFilter, SearchResult, IResult } from 'src/app/shared/models/result';
import { UserViewModel, UserManageModel } from '../models/user';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  search(filter: SearchFilter) {
    return this.http.post<SearchResult<UserViewModel>>(`${this.apiUrl}/user/search`, filter);
  }

  manage(model: UserManageModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/user/manage`, model);
  }

  changeStatus(id: string) {
    return this.http.put<IResult>(`${this.apiUrl}/user/change-status`, { id });
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/user/${id}`);
  }
}
