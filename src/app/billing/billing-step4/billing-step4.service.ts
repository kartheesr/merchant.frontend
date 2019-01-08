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
  public usdvalue: string;
  public transfergas: string;
  public recurrencegas: string;
  setValues(values) {
    this.model = values;
  }
  constructor(private _http: HttpClient) {
    this.actionUrl = `${Constants.apiPrefix}pull-payment-models/`;
    this.gasValueURL = `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiO…TQzfQ.3imXDPiYRKPzWi9BQKhaFKeGVr-PtE5dgcjijQHZVHs`;
    this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'OPTIONS, TRACE, GET, HEAD, POST');
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/gas`;
    this.usdvalue = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/ETH-value`;
    this.transfergas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/transfer-gas`;
    this.recurrencegas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pull-payment-gas`;
  }
  /**
   * @method {post}
   * @apiDescription To create a new billing model in database.
   * @actionUrl: http://202.61.120.46:9500/api/v2/pull-payment-models/
   * @data: Details of the billing model created by merchant.
   *
   * @methodName billingPost
   *
   *
   */
  public billingPost(data): Observable<any> {
    return this._http.post(this.actionUrl, data, { headers: this.headers }).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   * @method {get}
   * @apiDescription Retrieve the gas balance
   * @gasactionUrl: http://202.61.120.46:9500/api/v2/Dashboard/etherBalance
   *
   *
   * @methodName gasvalueCalcualtion
   *
   */
  public gasvalueCalcualtion(): Observable<any> {
    return this._http.get(this.gasactionUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   *@method {get}
   * @apiDescription Retrieve the USD value
   * @usdvalue: http://202.61.120.46:9500/api/v2/Dashboard/usdvalue
   *
   *
   * @methodName gasusdvalue
   *
   */
  public gasusdvalue(): Observable<any> {
    return this._http.get(this.usdvalue).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   *@method {get}
   * @apiDescription Retrieve the Pull Payment gas fee
   * @recurrencegas: http://202.61.120.46:9500/api/v2/Dashboard/pullPaymentGas
   *
   *
   * @methodName gastransferpull
   *
   */
  public gastransferpull(): Observable<any> {
    return this._http.get(this.recurrencegas).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   *@method {get}
   * @apiDescription Retrieve the PMA Transfer gas
   * @transfergas: http://202.61.120.46:9500/api/v2/Dashboard/transferGas
   *
   *
   * @methodName gasrecurrence
   *
   */
  public gasrecurrence(): Observable<any> {
    return this._http.get(this.transfergas).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
