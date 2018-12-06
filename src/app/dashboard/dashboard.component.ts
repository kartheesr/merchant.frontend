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
  pullPaymentsBalance: number = 0;
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
      this.transactionHistorArray = result.data;
      for (let val of result.data) {
        {
          this.pullPaymentsBalance += parseFloat(val.balance);
        }
      }
    });
    this.dashboardService.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = res.balance; // GAS VALUE
    });
    this.dashboardService.getQRCodeaddress().subscribe(result => {
      this.treasuryAddress = result.address; // TREASURY ADDRESS
    });

    this.dashboardService.getTreasurybalance().subscribe(result => {
      this.treasuryBalance = result.result; // TREASURY BALANCE
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
    window.open(`https://etherscan.io/tx/${data}`, '_blank');
  }
  pullpaymentaddress(data) {
    window.open(`https://etherscan.io/address/${data}`, '_blank');
  }
}
