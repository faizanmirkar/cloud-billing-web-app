import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl: string;
  protected apiUrl: string;
  constructor() {
    this.baseUrl = environment.production ? 'https://billing-api.dbtechs.co.za' : 'http://localhost:55120';
    this.apiUrl = `${this.baseUrl}/api`;
  }
}
