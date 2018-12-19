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
    this.billingModelUrl = `${Constants.apiHost}${Constants.apiPrefix}pull-payment-models/`;
    this.OverViewQrcodeUrl = `${Constants.apiHost}${Constants.apiPrefix}qr/`;
    this.QRCodeURL = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/address`;
    this.gasactionUrl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/etherBalance`;
    this.usdvalue = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/usdvalue`;
    this.transfergas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/transferGas`;
    this.recurrencegas = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/pullPaymentGas`;
    this.tabledataurl = `${Constants.apiHost}${Constants.apiPrefix}Dashboard/hashOverView`;
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
  /**
     *@method {get}
     * @apiDescription Retrieve payment models
     * @url: http://202.61.120.46:9500/api/v2/pull-payment-models/
     * 
     *
     * @apiName Getpull
     *
     * @apiSuccess (200) {
                          success": true,
                          "status": 200,
                          "message": "Successfully retrieved payment models.",
                          "data": [
                          {
                          "id": "fa3cee06-fecc-11e8-8606-a76cd3f1a78a",
                          "merchantID": "4a17335e-bf18-11e8-a355-000000fb1459",
                          "title": "Single payment",
                          "description": "Enjoy and have fun",
                          "amount": "1000",
                          "initialPaymentAmount": "0",
                          "trialPeriod": "0",
                          "currency": "USD",
                          "numberOfPayments": 1,
                          "frequency": 1,
                          "typeID": 2,
                          "networkID": 1,
                          "automatedCashOut": true,
                          "cashOutFrequency": 1
                          }]
                        }
     *
     */
  public Getpull(): Observable<any> {
    return this._http.get(this.actionUrl, { headers: this.headers });
  }
  /**
     *@method {get}
     * @apiDescription Retrieve payment model with ID: fa3cee06-fecc-11e8-8606-a76cd3f1a78a
     * @url: http://202.61.120.46:9500/api/v2/pull-payment-models/fa3cee06-fecc-11e8-8606-a76cd3f1a78a
     * @id: fa3cee06-fecc-11e8-8606-a76cd3f1a78a
     *
     * @apiName gasrecurrence
     *
     * @apiSuccess (200) {
                          success": true,
                          "status": 200,
                          "message": "Successfully retrieved payment model with ID: fa3cee06-fecc-11e8-8606-a76cd3f1a78a",
                          "data": [
                          {
                          "id": "fa3cee06-fecc-11e8-8606-a76cd3f1a78a",
                          "merchantID": "4a17335e-bf18-11e8-a355-000000fb1459",
                          "title": "Single payment",
                          "description": "Enjoy and have fun",
                          "amount": "1000",
                          "initialPaymentAmount": "0",
                          "trialPeriod": "0",
                          "currency": "USD",
                          "numberOfPayments": 1,
                          "frequency": 1,
                          "typeID": 2,
                          "networkID": 1,
                          "automatedCashOut": true,
                          "cashOutFrequency": 1
                          }]
                        }
     *
     */
  public getByIdBillingModel(id): Observable<any> {
    return this._http.get(this.billingModelUrl + id, { headers: this.headers });
  }
  /**
    *@method {get}
    * @apiDescription Retrieve value for QR code of ID: fa3cee06-fecc-11e8-8606-a76cd3f1a78a
    * @url: http://202.61.120.46:9500/api/v2/qr/fa3cee06-fecc-11e8-8606-a76cd3f1a78a
    * @id: fa3cee06-fecc-11e8-8606-a76cd3f1a78a
    *
    * @apiName getByIdBillingModelqr
    *
    * @apiSuccess (200) {
                         success": true,
                         "status": 200,
                         "message": "Successfully retrieved the QR code.",
                         "data":{
                         "pullPaymentModelURL": "http://merchant_server:3000/api/v2/pull-payment-models/fa3cee06-fecc-11e8-8606-a76cd3f1a78a",
                         "pullPaymentURL": "http://merchant_server:3000/api/v2/pull-payments/",
                         "transactionURL": "http://merchant_server:3000/api/v2/transactions/"
                         }
                       }
    *
    */
  public getByIdBillingModelqr(id): Observable<any> {
    return this._http.get(this.OverViewQrcodeUrl + id, { headers: this.headers });
  }
  /**
     *@method {get}
     * @apiDescription Retrieve Bank address 
     * @url: http://202.61.120.46:9500/api/v2/Dashboard/address
     * 
     *
     * @apiName getQRCodeaddress
     *
     * @apiSuccess (200) {
                          success": true,
                          "status": 200,
                          "message": "Bank address retrieve successfully",
                          "data": "0x8aecfd4a6657bdb8ca125fbc682c97da4ea78f8f"
                        }
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
   * @method {get}
   * @apiDescription Retrieve the transcation history of particular billing model
   * @url: http://202.61.120.46:9500/api/v2/Dashboard/hashOverView
   *
   *
   * @methodName gettabledatasingle
   *
   *@apiResponse (200) { "success": true,
   *                     "status": 200,
   *                     "message": "Retrieve successfully",
                         "data":[
                          {
                          "blockHash": "0x50fdb5b4e7dfe8e1f5aaa839e5923c9b87bf5f7bebae42fc401ed491d587b7e5",
                          "blockNumber": 4619651,
                          "from": "0x29Dd72356f6cEddDe9E86b4A7a1e02D7F1AF4618",
                          "gas": 140134,
                          "gasPrice": "10000000000",
                          "hash": "0x6243fc6bed85c781a7f0e5aa1b1c64884db53e71868bfcfbf81a424bbc7ff101",
                          "input": "0x65826666000000000000000000000000c42c6771a58bb08564bb6f9d10635c4ea6826bb00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002465626264333139302d666564642d313165382d623332312d61333264333834333566363900000000000000000000000000000000000000000000000000000000",
                          "nonce": 16,
                          "r": "0x20a09f700b7175b651a779d51419b07b13635c78e544adc7ffe3f885c64ffc0c",
                          "s": "0x58e756ddcaece870d7752c203075af2e7459b7765dc441226ab4a87510d55baf",
                          "to": "0xd996F8A7298D822eEb71868c93ECEB106401A5fe",
                          "transactionIndex": 16,
                          "v": "0x1b",
                          "value": "0",
                          "typeID": 5,
                          "id": "f19bddf6-fecd-11e8-850d-e7b88afbc521"
                          }]
                        }
   *
   */
  // public gettabledatasingle(): Observable<any> {
  //   return this._http.get(this.tabledataurl).pipe(
  //     map((response: HttpResponse) => {
  //       return response;
  //     })
  //   );
  // }


  
  public gettabledatasingle(data): Observable<any> {
    return this._http.post(this.tabledataurl, data, { headers: this.headers}).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }
}
