import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Logger } from '@app/core';
// import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { BillingServiceCall } from '../billing/billing-step4/billing-step4.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '@app/app.constants';
import { $ } from 'protractor';
// import { ConsoleReporter } from 'jasmine';

const log = new Logger('Login');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  error: string;
  treasuryBalance;
  usdTreasuryBal;
  treasuryCurrency;
  pullPaymentsBalance;
  usdPullPayBalance;
  sumBal;
  pullPaymentsCurrency;
  gasBalance;
  usdGasBalance;
  gasCurrency;
  value: string = '';
  transactionHistorArray = [];
  pmaAddressList;
  addressList;
  treasuryAddress;
  collection;
  usdValue;
  usdETHValue;
  previouslist = '';
  nextlist = '';
  imgSrc: string = 'assets/images/BTC1.png';
  p: number = 1;
  valuer;
  sample;
  pageShow: boolean = false;
  qrShow: boolean = false;
  constructor(
    private modalService: NgbModal,
    private dashboardService: DashboardService,
    @Inject(DOCUMENT) private document: any,
    private BillingServiceCall: BillingServiceCall
  ) {}

  ngOnInit() {
    var pullpaymentAddress = [];
    // this.dashboardService.getTransactionHistory().subscribe(result => {
    //   this.previouslist = '<';
    //   this.nextlist = '>';
    //   this.transactionHistorArray = result.data.data;

    //   let data = 0;
    //   for (let val of result.data.data) {
    //     if (val.balance != '0') {
    //       data += parseFloat(val.balance);
    //       this.pullPaymentsBalance = data.toFixed(5).replace(/0+$/, '');
    //       var nf = new Intl.NumberFormat();
    //       this.pullPaymentsBalance = nf.format(this.pullPaymentsBalance);
    //     }
    //   }
    // });
    this.dashboardService.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = parseFloat(res.data)
        .toFixed(5)
        .replace(/0+$/, ''); // GAS VALUE
      var nf = new Intl.NumberFormat();
      this.gasBalance = nf.format(this.gasBalance);
      this.usdGasBalance = (this.gasBalance * this.usdETHValue).toFixed(2);
    });
    this.dashboardService.getUsd().subscribe(result => {
      this.usdValue = result.data.USD; //EASURY ADDRESS
    });
    this.dashboardService.getEther().subscribe(result => {
      this.usdETHValue = result.data.USD; //EASURY ADDRESS
    });
    this.dashboardService.getQRCodeaddress().subscribe(result => {
      this.treasuryAddress = result.data; // TREASURY ADDRESS
    });

    this.dashboardService.getTreasurybalance().subscribe(result => {
      this.treasuryBalance = parseFloat(result.data)
        .toFixed(2)
        .replace(/0+$/, ''); // TREASURY BALANCE
      var nf = new Intl.NumberFormat();
      this.usdTreasuryBal = (this.treasuryBalance * this.usdValue).toFixed(2);
      this.treasuryBalance = nf.format(this.treasuryBalance);
      setTimeout(() => {
        this.qr();
      }, 3000);
    });

    this.dashboardService.gettabledata().subscribe(result => {
      this.previouslist = '<';
      this.nextlist = '>';
      result.data.map((value, index) => {
        this.dashboardService.getvalue(value.from, value.blockNumber).subscribe(result => {
          result.result[0].billName = value.billingName;
          this.transactionHistorArray.push(result.result[0]);
        });
        setTimeout(() => {
          this.getdecimal();
        }, 3000);
      });
    });
  }
  getdecimal() {
    let data = 0;
    let length = this.transactionHistorArray.length;
    // let length = 0;
    if (length != 0) {
      this.pageShow = true;
      this.qrShow = false;
    } else {
      this.pageShow = false;
      this.qrShow = true;
    }
    this.transactionHistorArray.map((value, index) => {
      data += parseFloat(this.transactionHistorArray[index].value) / 1000000000000000000;
    });
    var num = new Number(data);
    this.pullPaymentsBalance = num.toFixed(2);
    this.usdPullPayBalance = (this.pullPaymentsBalance * this.usdValue).toFixed(2);
    // this.sample.map((value, index) => {
    //   this.transactionHistorArray[index].billName = value.name;
    // })
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
  open(content) {
    this.modalService.open(content);
    document.body.classList.add('home');
  }
  closepopup() {
    document.body.classList.remove('home');
  }
  mouseOver() {
    this.imgSrc = 'assets/images/BTC2.png';
  }
  mouseOut() {
    this.imgSrc = 'assets/images/BTC1.png';
  }
}
