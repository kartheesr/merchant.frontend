import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Logger } from '@app/core';
// import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { DOCUMENT } from '@angular/common';
import { BillingServiceCall } from '../billing/billing-step4/billing-step4.service';
import { Constants } from '@app/app.constants';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('Login');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  error: string;
  treasuryBalance;
  treasuryCurrency;
  pullPaymentsBalance;
  sumBal;
  pullPaymentsCurrency;
  gasBalance;
  gasCurrency;
  value: string = '';
  transactionHistorArray;
  pmaAddressList;
  addressList;
  treasuryAddress;
  collection;

  constructor(
    private dashboardService: DashboardService,
    @Inject(DOCUMENT) private document: any,
    private BillingServiceCall: BillingServiceCall
  ) {}

  ngOnInit() {
    var pullpaymentAddress = [];
    this.dashboardService.getTransactionHistory().subscribe(result => {
      this.transactionHistorArray = result.data;
      console.log('this.table', this.transactionHistorArray);
      for (let val of result.data) {
        {
          this.pullPaymentsBalance += val.balance;
        }
      }
    });
    this.BillingServiceCall.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = res.balance; // GAS VALUE
      this.qrcode(this.treasuryAddress, this.gasBalance);
    });
    this.dashboardService.getQRCodeaddress().subscribe(result => {
      this.treasuryAddress = result.address; // TREASURY ADDRESS
    });

    this.dashboardService.getTreasurybalance().subscribe(result => {
      this.treasuryBalance = result.result; // TREASURY BALANCE
    });
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  txhash(data) {
    window.open('https://etherscan.io/tx/${data}', '_blank');
  }
  qrcode(treasuryAddress, gasBalance) {
    this.value = `${Constants.apiHost}${Constants.apiPrefix}qr/${treasuryAddress}/1000000000000000000/${gasBalance}`;
  }
}
