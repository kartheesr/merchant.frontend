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
    this.usdvalue = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/usdvalue`;
    this.transfergas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/transferGas`;
    this.recurrencegas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pullPaymentGas`;
  }
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
   * @url: http://202.61.120.46:9500/api/v2/Dashboard/etherBalance
   *
   *
   * @methodName gasvalueCalcualtion
   *
   * @apiResponse (200) {"success": true,
   *                     "status": 200,
   *                     "message": "Balance retrieve successfully",
   *                     "data": "45.221430273509750478"}
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
     * @url: http://202.61.120.46:9500/api/v2/Dashboard/usdvalue
     * 
     *
     * @apiName gasusdvalue
     *
     * @apiSuccess (200) {
                          "success": true,
                          "status": 200,
                          "message": "Balance retrieve successfully",
                          "data":{
                              "USD": 103.99,
                              "EUR": 90.69
                          }
                        }
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
     * @url: http://202.61.120.46:9500/api/v2/Dashboard/pullPaymentGas
     * 
     *
     * @apiName gastransferpull
     *
     * @apiSuccess (200) {
                          success": true,
                          "status": 200,
                          "message": "Pull Payment gas fee retrieve successfully.",
                          "data": 107795
                        }
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
         * @url: http://202.61.120.46:9500/api/v2/Dashboard/transferGas
         * 
         *
         * @apiName gasrecurrence
         *
         * @apiSuccess (200) {
                              success": true,
                              "status": 200,
                              "message": "PMA Transfer gas retrieve successfully.",
                              "data": 37244
                            }
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
