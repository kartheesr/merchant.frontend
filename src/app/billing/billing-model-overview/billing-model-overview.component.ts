import { Component, OnInit, Inject } from '@angular/core';
import { BillingService } from '../billing.service';
import { CurrencyPipe } from '@angular/common';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { DOCUMENT } from '@angular/common';
import { BillingServiceStep1 } from '../billing-step1/billing-step1.service';
import { BillingServiceStep2 } from '../billing-step2/billing-step2.service';
import { BillingServiceStep3 } from '../billing-step3/billing-step3.service';
import { BillingServiceCall } from '../billing-step4/billing-step4.service';

@Component({
  selector: 'app-billing-model-overview',
  templateUrl: './billing-model-overview.component.html',
  styleUrls: ['./billing-model-overview.component.scss'],
  providers: [BillingService, CurrencyPipe, DashboardService]
})
export class BillingModelOverviewComponent implements OnInit {
  public id;
  public single = false;
  public recurring = false;
  public singleRecurring = false;
  public amount;
  public currency;
  public description;
  public title;
  public subscribers;
  public frequency;
  public pmaAmount;
  public transactionHistorArray;
  public data;
  public date1;
  public date2;
  public date3;
  value: string = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a';

  constructor(
    public service: BillingService,
    @Inject(DOCUMENT) private document: any,
    public dashboardService: DashboardService,
    private service1: BillingServiceStep1,
    private service2: BillingServiceStep2,
    private service3: BillingServiceStep3,
    public overviewdata: BillingServiceCall
  ) {}
  typeID;

  ngOnInit() {
    this.date1 = this.service1.model;
    this.date2 = this.service2.model;
    this.date3 = this.service3.model;
    this.transactionHistory();
    this.id = localStorage.getItem('publishId');

    this.service.getPullPayment().subscribe(result => {
      if (result.success == true) {
        this.pmaAmount = result.data.balance;
      }
    });

    this.service.Getpull().subscribe(result => {
      if (result.success == true) {
        this.subscribers = result.data.length;
      }
    });

    this.service.getByIdBillingModel(this.id).subscribe(result => {
      localStorage.removeItem('publishId');

      if (result.data.typeID == 1) {
        this.data = this.overviewdata.model;
        this.description = this.date2.billingModelName;
        this.title = this.date2.productName;
        this.amount = result.data.amount;
        this.currency = result.data.currency;

        this.single = true;
        this.recurring = false;
        this.singleRecurring = false;
      } else if (result.data.typeID == 2) {
        this.data = this.overviewdata.model;
        this.description = this.date2.billingModelName;
        this.title = this.date2.productName;
        this.amount = result.data.amount;
        this.currency = result.data.currency;
        this.frequency = result.data.frequency;

        this.recurring = true;
        this.single = false;
        this.singleRecurring = false;
      } else {
        this.data = this.overviewdata.model;
        this.description = this.date2.billingModelName;
        this.title = this.date2.productName;
        this.amount = result.data.amount;
        this.currency = result.data.currency;
        this.frequency = result.data.frequency;

        this.singleRecurring = true;
        this.single = false;
        this.recurring = false;
      }
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
  txhash(data) {
    // var data = '0xd5bb7fe4284f34f33becb66f166d26f4bf8fcb97d0184c51b9b1d8604510bcba';
    this.document.location.href = `https://etherscan.io/tx/${data}`;
  }
}
