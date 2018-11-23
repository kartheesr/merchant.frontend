import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '@app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private actionUrl: string;
  private treasuryAddressUrl;
  private transactionHistoryUrl;
  private treasuryBalUrl;
  private pullpaymentBalance;
  private headers: HttpHeaders = new HttpHeaders();
  private pullpaymentURL2;
  private address1;

  constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}balance/all/`;
    this.treasuryAddressUrl = `${Constants.apiHost}${Constants.apiPrefix}address/treasury`;
    this.transactionHistoryUrl = `${Constants.apiHost}${Constants.apiPrefix}transactionHistory/all`;
    this.treasuryBalUrl = `https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=${
      Constants.API_KEY
    }`;
    this.pullpaymentURL2 = '&tag=latest&apikey=YourApiKeyToken';
    this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'OPTIONS, TRACE, GET, HEAD, POST');
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
    return this.http.get(this.treasuryBalUrl);
  }
  public getPullpaymentBalance(address): Observable<any> {
    this.address1 = address;
    this.pullpaymentBalance = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${
      this.address1
    }&tag=latest&apikey=${Constants.API_KEY}`;
    return this.http.get(this.pullpaymentBalance);
  }
}
