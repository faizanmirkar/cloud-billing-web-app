import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { SettingModel } from '../models/setting';
import { IResult } from 'src/app/shared/models/result';

@Injectable({
  providedIn: 'root'
})
export class SettingService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  setting() {
    return this.http.get<SettingModel>(`${this.apiUrl}/setting/view`);
  }

  save(model: SettingModel) {
    return this.http.post<IResult>(`${this.apiUrl}/setting`, model);
  }
}
