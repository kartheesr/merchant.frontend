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
export class BillingService {
  public actionUrl: string;
  public billingModelUrl: string;
  public token: string;
  public user: any;
  public userID: string;
  public OverViewQrcodeUrl;
  private QRCodeURL;
  private gasactionUrl;
  public usdvalue: string;
  public transfergasUrl: string;
  public recurrencegas: string;
  public tabledataurl: string;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal'
    // Authorization: localStorage.getItem('token')
  });
  constructor(private _http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/`;
    this.billingModelUrl = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/`;
    this.OverViewQrcodeUrl = `${Constants.apiHost}${Constants.apiPrefix}qr/`;
    this.QRCodeURL = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/address`;
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/etherBalance`;
    this.usdvalue = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/usdvalue`;
    this.transfergasUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/transferGas`;
    this.recurrencegas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pullPaymentGas`;
    this.tabledataurl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/hashOverView`;
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
   * @transfergasUrl: http://202.61.120.46:9500/api/v2/Dashboard/transferGas
   *
   *
   * @methodName gasrecurrence
   *
   */
  public gasrecurrence(): Observable<any> {
    return this._http.get(this.transfergasUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   *@method {get}
   * @apiDescription Retrieve payment models
   * @actionUrl: http://202.61.120.46:9500/api/v2/pull-payment-models/
   *
   *
   * @methodName Getpull
   *
   */
  public Getpull(): Observable<any> {
    return this._http.get(this.actionUrl, { headers: this.headers });
  }
  /**
   *@method {get}
   * @apiDescription Retrieve payment model of particular merchant ID
   * @billingModelUrl: http://202.61.120.46:9500/api/v2/pull-payment-models/{id}
   * @id: Billing model ID
   *
   * @methodName getByIdBillingModel
   *
   */
  public getByIdBillingModel(id): Observable<any> {
    return this._http.get(this.billingModelUrl + id, { headers: this.headers });
  }
  /**
   *@method {get}
   * @apiDescription Retrieve value for QR code of particular merchant ID
   * @OverViewQrcodeUrl: http://202.61.120.46:9500/api/v2/qr/{id}
   * @id: Billing model ID
   *
   * @methodName getByIdBillingModelqr
   *
   */
  public getByIdBillingModelqr(id): Observable<any> {
    return this._http.get(this.OverViewQrcodeUrl + id, { headers: this.headers });
  }
  /**
   *@method {get}
   * @apiDescription Retrieve Bank address
   * @QRCodeURL: http://202.61.120.46:9500/api/v2/Dashboard/address
   *
   *
   * @methodName getQRCodeaddress
   *
   */
  public getQRCodeaddress(): Observable<any> {
    return this._http.get(this.QRCodeURL).pipe(
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
   * @method {post}
   * @apiDescription Retrieve the transcation history of particular billing model
   * @tabledataurl: http://202.61.120.46:9500/api/v2/Dashboard/hashOverView
   *
   * @data:Details of billing model created by merchant.
   *
   * @methodName gettabledatasingle
   *
   */
  public gettabledatasingle(data): Observable<any> {
    return this._http.post(this.tabledataurl, data, { headers: this.headers }).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
