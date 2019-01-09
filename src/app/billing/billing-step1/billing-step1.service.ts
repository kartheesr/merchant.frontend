import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '@app/app.constants';
import { HttpResponse } from '@app/utils/web/models/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class BillingServiceStep1 {
  public model: any;
  public actionUrl: string;
  public usdvalue: string;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal'
    // Authorization: localStorage.getItem('token')
  });
  setValues(values) {
    this.model = values;
  }
  constructor(private _http: HttpClient) {
    this.usdvalue = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/productDropDown`;
  }
  public productNameList(): Observable<any> {
    return this._http.get(this.usdvalue, { headers: this.headers });
  }
}
