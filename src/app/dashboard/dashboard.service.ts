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
  private headers: HttpHeaders = new HttpHeaders();
  private pullpaymentURL2;
  private QRCodeURL;
  private treasuryUrl;
  private gasactionUrl;
  public transcationurl;

  constructor(private http: HttpClient) {
    this.pullpaymentURL2 = '&tag=latest&apikey=YourApiKeyToken';
    this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'OPTIONS, TRACE, GET, HEAD, POST');
    this.QRCodeURL = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/address`;
    this.treasuryUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pmabalance`;
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/etherBalance`;
    this.transcationurl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/hash`;
  }

  /**
   * @method {get}
   * @apiDescription Retrieve the treasury balance
   * @treasuryUrl: http://202.61.120.46:9500/api/v2/Dashboard/pmabalance
   *
   * @method Name: getTreasurybalance
   *
   *
   */

  public getTreasurybalance(): Observable<any> {
    return this.http.get(this.treasuryUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   * @method {get}
   * @apiDescription Retrieve the treasury address to  retieve QR code value
   * @QRCodeURL: http://202.61.120.46:9500/api/v2/Dashboard/address
   *
   *
   * @methodName getQRCodeaddress
   *
   */

  public getQRCodeaddress(): Observable<any> {
    return this.http.get(this.QRCodeURL).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   * @method {get}
   * @apiDescription Retrieve the value to show as QR code
   * @url: http://202.61.120.46:9500/api/v2/qr/${address}/1000000000000000000/${gas}
   *
   * @gas : gas value
   * @address: treasury address
   *
   * @apiName getQRValue
   *
   */
  public getQRValue(gas, address): Observable<any> {
    var url = `${Constants.apiHost}${Constants.apiPrefix}qr/${address}/1000000000000000000/${gas}`;
    return this.http.get(url).pipe(
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
    return this.http.get(this.gasactionUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   * @method {get}
   * @apiDescription Retrieve the billing name for each transcation
   * @transcationurl: http://202.61.120.46:9500/api/v2/Dashboard/hash
   *
   *
   * @methodName gettabledata
   *
   */
  public gettabledata(): Observable<any> {
    return this.http.get(this.transcationurl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  /**
   * @method {get}
   * @apiDescription Retrieve the transaction history
   * @sample: http://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${blocknumber}&endblock=${blocknumber}
   *
   * @blockNumber: particular merchant block number.
   * @address : particular merchant address.
   *
   * @methodName getvalue
   *
   */
  public getvalue(address, blocknumber): Observable<any> {
    let sample = `http://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${blocknumber}&endblock=${blocknumber}`;
    return this.http.get(sample).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
