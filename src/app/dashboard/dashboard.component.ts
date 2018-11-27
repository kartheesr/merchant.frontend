import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Logger } from '@app/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { DOCUMENT } from '@angular/common';
import { BillingServiceCall } from '../billing/billing-step4/billing-step4.service';
import Web3 from 'web3';
var web3 = new Web3();

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
  sumBal;
  pullPaymentsCurrency;
  gasBalance;
  gasCurrency;
  value: string = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a';
  transactionHistorArray;
  pmaAddressList;
  addressList;

  constructor(
    private dashboardService: DashboardService,
    @Inject(DOCUMENT) private document: any,
    private BillingServiceCall: BillingServiceCall
  ) {}

  ngOnInit() {
    this.pullPaymentsBalance = 0;
    var pullpaymentAddress = [];
    this.dashboardService.getTransactionHistory().subscribe(result => {
      this.transactionHistorArray = result.data;
      for (let val of result.data) {
        {
          pullpaymentAddress.push(val.merchantAddress);
        }
      }
      this.addressList = pullpaymentAddress.join(',');
      this.pullpaymentdata(this.addressList);
      for (let val of result.data) {
        if (this.pmaAddressList.length > 0) {
          if (this.pmaAddressList.indexOf(val.merchantAddress) < 0) {
            this.pullPaymentsBalance += val.balance;
          }
        } else {
          this.pullPaymentsBalance += val.balance;
        }
      }
    });
    this.BillingServiceCall.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = res.res.gasprice;
    });
    this.dashboardService.getTreasuryBalance().subscribe(result => {
      this.treasuryBalance = web3.fromWei(result.result, 'ether');
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

  txhash(data) {
    //this.document.location.href = `https://etherscan.io/tx/${data}`;
    window.open('https://etherscan.io/tx/${data}', '_blank');
  }
  pullpaymentdata(data) {
    this.sumBal = 0;
    let i = 0;
    this.dashboardService.getPullpaymentBalance(data).subscribe(result => {
      for (var val of result.result) {
        this.sumBal += parseInt(val.balance);
        this.transactionHistorArray[i].balance = web3.fromWei(val.balance, 'ether');
        i++;
      }
      this.pullPaymentsBalance = web3.fromWei(this.sumBal, 'ether');
    });
  }
}
