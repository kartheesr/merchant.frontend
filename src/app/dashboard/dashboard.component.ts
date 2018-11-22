import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Logger } from '@app/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { DOCUMENT } from '@angular/common';
import { BillingServiceCall } from '../billing/billing-step4/billing-step4.service';

const log = new Logger('Login');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  error: string;
  treasuryBalance;
  treasuryCurrency;
  pullPaymentsBalance;
  pullPaymentsCurrency;
  gasBalance;
  gasCurrency;
  value: string = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a';
  transactionHistorArray;
  pmaAddressList;

  constructor(
    private dashboardService: DashboardService,
    @Inject(DOCUMENT) private document: any,
    private BillingServiceCall: BillingServiceCall
  ) {}

  ngOnInit() {
    // this.getPullPayment();
    this.transactionHistory();
    this.BillingServiceCall.gasvalueCalcualtion().subscribe(res => {
      console.log('gas value', res);
      // var r = res.result/(1000000000000000000)
      console.log('value:', res.result / 1000000000000000000);
    });

    this.dashboardService.getTreasuryBalance().subscribe(result => {
      this.gasBalance = result.result * 132.2324;
      this.treasuryBalance = result.result;
      console.log('treasury balance', this.treasuryBalance);
    });
  }
  getPullPayment() {
    this.isLoading = true;

    this.dashboardService.getPullPayment().subscribe(result => {
      this.treasuryBalance = result.data.treasury.balance;
      this.treasuryCurrency = result.data.treasury.currency;
      this.pullPaymentsBalance = result.data.pullPayments.balance;
      this.pullPaymentsCurrency = result.data.pullPayment.currency;
      this.gasBalance = result.data.gas.balance;
      this.gasCurrency = result.data.gas.currency;
    });
  }
  getTreasureAddress() {
    this.dashboardService.getTreasuryAddress().subscribe(result => {
      this.value = result.data.address;
    });
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  transactionHistory() {
    this.pullPaymentsBalance = 0;
    this.dashboardService.getTransactionHistory().subscribe(result => {
      console.log('result of txHist ', result.data);
      console.log('Chech');
      this.transactionHistorArray = result.data;
      for (let val of result.data) {
        if (this.pmaAddressList.length > 0) {
          if (this.pmaAddressList.indexOf(val.merchantAddress) < 0) {
            // this.pmaAddressList.push(val.clinic);
            this.pullPaymentsBalance += val.balance;
          }
        } else {
          this.pullPaymentsBalance += val.balance;
        }
      }
    });
  }
  txhash(data) {
    // var data = '0xd5bb7fe4284f34f33becb66f166d26f4bf8fcb97d0184c51b9b1d8604510bcba';
    this.document.location.href = `https://etherscan.io/tx/${data}`;
  }
}
