import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Logger } from '@app/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { DOCUMENT } from '@angular/common';

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

  constructor(private dashboardService: DashboardService, @Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    // this.getPullPayment();
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
    this.dashboardService.getTransactionHistory().subscribe(result => {
      this.transactionHistorArray = result.data;
    });
  }
  txhash() {
    var data = '0xd5bb7fe4284f34f33becb66f166d26f4bf8fcb97d0184c51b9b1d8604510bcba';
    // this.dashboardService.redirectToEtherscan().subscribe(result => {});
    this.document.location.href = `https://etherscan.io/tx/${data}`;
  }
}
