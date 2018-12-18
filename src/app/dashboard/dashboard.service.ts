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
   * @url: http://202.61.120.46:9500/api/v2/Dashboard/pmabalance
   *
   * @apiName getTreasurybalance
   *
   * @apiSuccess (200) {"success": true,
   *                     "status": 200,
   *                     "message": "Balance retrieve successfully",
   *                     "data": "33593.851786585235442898"}
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
   * @url: http://202.61.120.46:9500/api/v2/Dashboard/address
   *
   *
   * @methodName getQRCodeaddress
   *
   * @apiResponse (200) {"success": true,
   *         "status": 200,
   *         "message": "Bank address retrieve successfully",
   *         "data": "0x8aecfd4a6657bdb8ca125fbc682c97da4ea78f8f"}
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
   * @url: http://202.61.120.46:9500/api/v2/qr/0x8aecfd4a6657bdb8ca125fbc682c97da4ea78f8f/1000000000000000000/45.221
   * @address: 0x8aecfd4a6657bdb8ca125fbc682c97da4ea78f8f (treasury address)
   * @gas : 45.221 (gas value)
   *
   * @apiName getQRValue
   *
   * @apiSuccess (200) {"to": "0x8aecfd4a6657bdb8ca125fbc682c97da4ea78f8f",
   *                   "value": "1000000000000000000",
   *                   "gas": 45.221,
   *                   "data": null}
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
    return this.http.get(this.gasactionUrl).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
  /**
   * @method {get}
   * @apiDescription Retrieve the billing name for each transcation
   * @url: http://202.61.120.46:9500/api/v2/Dashboard/hash
   *
   *
   * @methodName gettabledata
   *
   * @apiResponse (200) {"success": true,
   *                     "status": 200,
   *                     "message": "Retrieve successfully",
   *                     data":[
   *                       {
   *                          "blockHash": "0x1836d7299ebe917d6b5de616ce231f07c95b77f3427b16195ea0d2eb6faca339",
   *                         "blockNumber": 4619669,
   *                          "from": "0x29Dd72356f6cEddDe9E86b4A7a1e02D7F1AF4618",
   *                          "gas": 140134,
   *                          "gasPrice": "10000000000",
   *                          "hash": "0xdda8e0970dc801a767f285ea97c59a45bbb02102e618b32e64c145c358e72a3a",
   *                          "input": "0x65826666000000000000000000000000c42c6771a58bb08564bb6f9d10635c4ea6826bb00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002465626264333139302d666564642d313165382d623332312d61333264333834333566363900000000000000000000000000000000000000000000000000000000",
   *                          "nonce": 18,
   *                          "r": "0x25c16a2d00a8ae15c1a7e5bf63a905e3e6b5649a8983deecb10cf7874dbe4090",
   *                          "s": "0x520f5496dbae93e8cb583e307cb012f666a66fbceaf7ab733d8ee5ef7b88cb1b",
   *                          "to": "0xd996F8A7298D822eEb71868c93ECEB106401A5fe",
   *                          "transactionIndex": 5,
   *                          "v": "0x1c",
   *                          "value": "0",
   *                          "billingName": "Monthly subscription"
   *                        }]
   *                     }
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
   * @url: http://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=0x29Dd72356f6cEddDe9E86b4A7a1e02D7F1AF4618&startblock=4619669&endblock=4619669
   * @blockNumber: 4619669 (retrived from transcation history)
   * @address : 0x29Dd72356f6cEddDe9E86b4A7a1e02D7F1AF4618 (retrived from transcation history)
   *
   * @methodName getvalue
   *
   * @apiResponse (200) {"status":"1","message":"OK",
   *                     "result":[{
   *                     "blockNumber":"4619669",
   *                     "timeStamp":"1544709545",
   *                     "hash":"0xdda8e0970dc801a767f285ea97c59a45bbb02102e618b32e64c145c358e72a3a",
   *                     "nonce":"18",
   *                     "blockHash":"0x1836d7299ebe917d6b5de616ce231f07c95b77f3427b16195ea0d2eb6faca339",
   *                     "from":"0xc42c6771a58bb08564bb6f9d10635c4ea6826bb0",
   *                     "contractAddress":"0x11c1e537801cc1c37ad6e1b7d0bdc0e00fcc6dc1",
   *                     "to":"0x29dd72356f6ceddde9e86b4a7a1e02d7f1af4618",
   *                     "value":"139723347771412603045",
   *                     "tokenName":"YourBit",
   *                     "tokenSymbol":"YBT",
   *                     "tokenDecimal":"18",
   *                     "transactionIndex":"5",
   *                     "gas":"140134",
   *                     "gasPrice":"10000000000",
   *                     "gasUsed":"92144",
   *                     "cumulativeGasUsed":"552530",
   *                     "input":"0x65826666000000000000000000000000c42c6771a58bb08564bb6f9d10635c4ea6826bb00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002465626264333139302d666564642d313165382d623332312d61333264333834333566363900000000000000000000000000000000000000000000000000000000",
   *                     "confirmations":"31060"}]}
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
