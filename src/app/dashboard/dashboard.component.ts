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
import { $ } from 'protractor';

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
  previouslist = '';
  nextlist = '';
  p: number = 1;

  constructor(
    private dashboardService: DashboardService,
    @Inject(DOCUMENT) private document: any,
    private BillingServiceCall: BillingServiceCall
  ) {}

  ngOnInit() {
    var pullpaymentAddress = [];
    this.dashboardService.getTransactionHistory().subscribe(result => {
      this.previouslist = '<';
      this.nextlist = '>';
      this.transactionHistorArray = result.data.data;

      let data = 0;
      for (let val of result.data.data) {
        if (val.balance != '0') {
          data += parseFloat(val.balance);
          this.pullPaymentsBalance = data.toFixed(5).replace(/0+$/, '');
          var nf = new Intl.NumberFormat();
          this.pullPaymentsBalance = nf.format(this.pullPaymentsBalance);
        }
      }
    });
    this.dashboardService.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = parseFloat(res.data)
        .toFixed(5)
        .replace(/0+$/, ''); // GAS VALUE
      var nf = new Intl.NumberFormat();
      this.gasBalance = nf.format(this.gasBalance);
    });
    this.dashboardService.getQRCodeaddress().subscribe(result => {
      this.treasuryAddress = result.data; // TREASURY ADDRESS
    });

    this.dashboardService.getTreasurybalance().subscribe(result => {
      this.treasuryBalance = parseFloat(result.data)
        .toFixed(5)
        .replace(/0+$/, ''); // TREASURY BALANCE
      var nf = new Intl.NumberFormat();
      this.treasuryBalance = nf.format(this.treasuryBalance);
      setTimeout(() => {
        this.qr();
      }, 3000);
    });
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  qr() {
    this.dashboardService.getQRValue(this.gasBalance, this.treasuryAddress).subscribe(result => {
      this.value = JSON.stringify(result.data);
    });
  }
  txhash(data) {
    window.open(`https://ropsten.etherscan.io/tx/${data}`, '_blank');
  }
  pullpaymentaddress(data) {
    window.open(`https://ropsten.etherscan.io/address/${data}`, '_blank');
  }
  learnMore() {
    window.open(`https://wiki.pumapay.io/#/page/backendtreasury`, '_blank');
  }
}
