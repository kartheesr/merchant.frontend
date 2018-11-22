import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '@app/app.constants';
import { Observable } from 'rxjs';
import { HttpGetRequest } from '@app/utils/web/HttpGetRequest';
import { HttpDeleteRequest } from '@app/utils/web/HttpDeleteRequest';
import { HttpPutRequest } from '@app/utils/web/HttpPutRequest';
import { PullPayment } from '@app/models/dashboard';
import { HttpPostRequest } from '@app/utils/web/HttpPostRequest';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private actionUrl: string;
  private treasuryAddressUrl;
  private transactionHistoryUrl;
  private treasuryBalUrl;
  // private invocation = new XMLHttpRequest();
  // private url = 'https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=${
  //   Constants.API_KEY
  // }`';

  // function callOtherDomain() {
  //   if(invocation) {
  //     invocation.open('GET', url, true);
  //     invocation.onreadystatechange = handler;
  //     invocation.send();
  //   }
  // }

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal',
    Authorization: localStorage.getItem('token')
  });

  constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}balance/all/`;
    this.treasuryAddressUrl = `${Constants.apiHost}${Constants.apiPrefix}address/treasury`;
    this.transactionHistoryUrl = `${Constants.apiHost}${Constants.apiPrefix}test/transact`;
    this.treasuryBalUrl = `https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=${
      Constants.API_KEY
    }`;
  }
  public getPullPayment(): Observable<any> {
    return this.http.get(this.actionUrl, { headers: this.headers });
  }
  public getTreasuryAddress(): Observable<any> {
    return this.http.get(this.treasuryAddressUrl, { headers: this.headers });
  }
  public getTransactionHistory(): Observable<any> {
    return this.http.get(this.transactionHistoryUrl, { headers: this.headers });
  }
  public getTreasuryBalance(): Observable<any> {
    return this.http.get(this.treasuryBalUrl, { headers: this.headers });
  }
}
