import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { IResult, SearchResult } from 'src/app/shared/models/result';
import { QuotationManageModel, QuotationSearchFilter, QuotationDetailsViewModel } from '../models/quotation';
import { CustomerModel } from '../../customer/models/customer';
import { Utility } from 'src/app/shared/services/utility';

@Injectable({
  providedIn: 'root'
})
export class QuotationService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  manage(model: QuotationManageModel) {
    Utility.trim(model);
    return this.http.post<IResult>(`${this.apiUrl}/quotation/manage`, model);
  }

  search(filter: QuotationSearchFilter) {
    return this.http.post<SearchResult<QuotationDetailsViewModel>>(`${this.apiUrl}/quotation/search`, filter);
  }

  delete(id: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/quotation/${id}`);
  }

  deleteProduct(quotationId: string, productId: string) {
    return this.http.delete<IResult>(`${this.apiUrl}/quotation/${quotationId}/${productId}`);
  }

  byId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/quotation/view/${id}`);
  }

  byMobile(mobileNo: string) {
    return this.http.get<CustomerModel>(`${this.apiUrl}/quotation/view/by-mobile/${mobileNo}`);
  }

  markInvoice(quotationId:string){
    return this.http.post<IResult>(`${this.apiUrl}/quotation/toinvoice`, {id:quotationId});
  }
}
