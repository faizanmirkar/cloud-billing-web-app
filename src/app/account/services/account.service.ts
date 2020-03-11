import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResult } from 'src/app/shared/models/result';
import { ApiService } from 'src/app/shared/services/api.service';
import { UserInfo, ChangePassword } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends ApiService {

  private storageKey = 'userInfo';
  constructor(private http: HttpClient) {
    super();
  }

  login(model: any) {
    return this.http.post<IResult>(`${this.apiUrl}/account/login`, model);
  }

  setUser(model: UserInfo) {
    localStorage.setItem(this.storageKey, JSON.stringify(model));
  }

  clearUser() {
    localStorage.removeItem(this.storageKey);
  }

  get currentUser(): UserInfo {
    const item = JSON.parse(localStorage.getItem(this.storageKey));
    if (item != null) {
      return item as UserInfo;
    }
    return null;
  }

  changePassword(model: ChangePassword) {
    return this.http.post<IResult>(`${this.apiUrl}/account/change-password`, model);
  }
}
