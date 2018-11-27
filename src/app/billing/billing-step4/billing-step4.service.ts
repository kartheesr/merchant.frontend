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
export class BillingServiceCall {
  public model: any;
  public actionUrl: string;
  public step4recuuringactionUrl: string;
  public gasValueURL: string;
  private headers: HttpHeaders = new HttpHeaders();
  public gasactionUrl: string;
  setValues(values) {
    this.model = values;
  }
  constructor(private _http: HttpClient) {
    this.actionUrl = `${Constants.apiPrefix}pull-payment-models/`;
    this.gasValueURL = `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiO…TQzfQ.3imXDPiYRKPzWi9BQKhaFKeGVr-PtE5dgcjijQHZVHs`;
    this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'OPTIONS, TRACE, GET, HEAD, POST');
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}GasPriceCalculation/gas`;
  }
  public billingPost(data): Observable<any> {
    return this._http.post(this.actionUrl, data, { headers: this.headers }).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  public Updateput(id, putdata): Observable<any> {
    return this._http.put(this.actionUrl + id, putdata, { headers: this.headers });
  }
  public gasvalueCalcualtion(): Observable<any> {
    return this._http.get(this.gasactionUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
