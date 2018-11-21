import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class BillingServiceStep1 {
  public model: any;
  public actionUrl: string;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal'
    // Authorization: localStorage.getItem('token')
  });
  setValues(values) {
    this.model = values;
  }
  constructor(private _http: HttpClient) {
    this.actionUrl = `${Constants.apiPrefix}pull-payment-models/`;
  }

  public Updateget(data): Observable<any> {
    console.log('API Hit GET', data);
    return this._http.get(this.actionUrl + data, { headers: this.headers });
  }
}
