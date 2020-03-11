import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { MenuModel } from 'src/app/shared/views/menu-bar/menu.model';
import { KeyValue } from '@angular/common';
import { PermissionFlags, PermissionModel } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends ApiService {

  private permissions: PermissionModel[] = [];

  constructor(private http: HttpClient) {
    super();
  }

  getMenu() {
    return this.http.get<MenuModel[]>(`${this.apiUrl}/permission/menus`);
  }

  access() {
    return this.http.get<PermissionModel[]>(`${this.apiUrl}/permission/access`);
  }

  setPermission(value: PermissionModel[]) {
    this.permissions = value;
  }

  hasPermission(flag: PermissionFlags) {
    if (this.permissions && this.permissions.length > 0) {
      const info = this.permissions.find(m => m.key === flag.toString());
      if (info) {
        return info.value;
      }
    }
    return false;
  }
}
