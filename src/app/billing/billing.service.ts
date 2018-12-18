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
  public actionUrl1: string;
  public billingModelUrl: string;
  public token: string;
  public user: any;
  public userID: string;
  public OverViewQrcodeUrl;
  private QRCodeURL;
  private gasactionUrl;
  public usdvalue: string;
  public transfergas: string;
  public recurrencegas: string;
  public tabledataurl: string;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal'
    // Authorization: localStorage.getItem('token')
  });
  constructor(private _http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/`;
    this.actionUrl1 = `${Constants.apiHost}${Constants.apiPrefix}balance/all/`;
    this.billingModelUrl = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/`;
    this.OverViewQrcodeUrl = `${Constants.apiHost}${Constants.apiPrefix}qr/`;
    this.QRCodeURL = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/address`;
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/etherBalance`;
    this.usdvalue = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/usdvalue`;
    this.transfergas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/transferGas`;
    this.recurrencegas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pullPaymentGas`;
    this.tabledataurl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/hashOverView`;
  }
  public gasusdvalue(): Observable<any> {
    return this._http.get(this.usdvalue).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  public gastransferpull(): Observable<any> {
    return this._http.get(this.recurrencegas).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  public gasrecurrence(): Observable<any> {
    return this._http.get(this.transfergas).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  public Getpull(): Observable<any> {
    return this._http.get(this.actionUrl, { headers: this.headers });
  }
  public Deletepull(data): Observable<any> {
    return this._http.delete(this.actionUrl + data, { headers: this.headers });
  }
  public getPullPayment(): Observable<any> {
    return this._http.get(this.actionUrl1, { headers: this.headers });
  }
  public getByIdBillingModel(id): Observable<any> {
    return this._http.get(this.billingModelUrl + id, { headers: this.headers });
  }
  public getByIdBillingModelqr(id): Observable<any> {
    return this._http.get(this.OverViewQrcodeUrl + id, { headers: this.headers });
  }
  public getQRCodeaddress(): Observable<any> {
    return this._http.get(this.QRCodeURL).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  public getQRValue(gas, address): Observable<any> {
    var url = `${Constants.apiHost}${Constants.apiPrefix}qr/${address}/1000000000000000000/${gas}`;
    return this._http.get(url).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  public gasvalueCalcualtion(): Observable<any> {
    return this._http.get(this.gasactionUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  public gettabledatasingle(): Observable<any> {
    return this._http.get(this.tabledataurl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
