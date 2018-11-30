import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '@app/app.constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@app/utils/web/models/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private treasuryAddressUrl;
  private transactionHistoryUrl;
  private treasuryBalUrl;
  private pullpaymentBalance;
  private headers: HttpHeaders = new HttpHeaders();
  private pullpaymentURL2;
  private address1;
  private QRCodeURL;
  private treasuryUrl;
  private gasactionUrl;

  constructor(private http: HttpClient) {
    this.transactionHistoryUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/getAll`;
    this.treasuryBalUrl = `https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=${
      Constants.API_KEY
    }`;
    this.pullpaymentURL2 = '&tag=latest&apikey=YourApiKeyToken';
    this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'OPTIONS, TRACE, GET, HEAD, POST');
    this.QRCodeURL = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/address`;
    this.treasuryUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pmabalance`;
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/etherBalance`;
  }

  public getTransactionHistory(): Observable<any> {
    return this.http.get(this.transactionHistoryUrl, { headers: this.headers });
  }
  public getTreasuryBalance(): Observable<any> {
    return this.http.get(this.treasuryBalUrl);
  }
  public getPullpaymentBalance(address): Observable<any> {
    this.address1 = address;
    this.pullpaymentBalance = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${
      this.address1
    }&tag=latest&apikey=${Constants.API_KEY}`;
    return this.http.get(this.pullpaymentBalance);
  }
  public getQRCodeaddress(): Observable<any> {
    return this.http.get(this.QRCodeURL).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  // service call
  public getTreasurybalance(): Observable<any> {
    return this.http.get(this.treasuryUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  public gasvalueCalcualtion(): Observable<any> {
    return this.http.get(this.gasactionUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
