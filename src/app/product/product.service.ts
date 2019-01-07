import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@app/utils/web/models/HttpResponse';
import { Constants } from '@app/app.constants';
import { map } from 'rxjs/operators';
import { User } from '@app/models/User';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public productPageUrl: string;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal'
    // Authorization: localStorage.getItem('token')
  });
  constructor(private _http: HttpClient) {
    this.productPageUrl = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/product`;
  }
  public billingPost(data): Observable<any> {
    return this._http.post(this.productPageUrl, data, { headers: this.headers }).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
