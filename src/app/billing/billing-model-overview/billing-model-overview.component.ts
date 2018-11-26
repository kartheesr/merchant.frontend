import { Component, OnInit, Inject } from '@angular/core';
import { BillingService } from '../billing.service';
import { CurrencyPipe } from '@angular/common';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { DOCUMENT } from '@angular/common';
import { BillingServiceCall } from '../billing-step4/billing-step4.service';
import { ActivatedRoute } from '@angular/router';

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
  value: string = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a';

  constructor(
    public service: BillingService,
    @Inject(DOCUMENT) private document: any,
    public dashboardService: DashboardService,
    public overviewdata: BillingServiceCall,
    public route: ActivatedRoute
  ) {}
  typeID;

  ngOnInit() {
    this.transactionHistory();
    if (this.route.snapshot.queryParamMap.get('pullPayId')) {
      this.id = this.route.snapshot.queryParamMap.get('pullPayId');
    } else {
      this.id = localStorage.getItem('publishId');
    }
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
        this.description = 'Single';
        this.title = result.data.title;
        this.amount = result.data.amount / 100;
        this.currency = result.data.currency;

        this.single = true;
        this.recurring = false;
        this.singleRecurring = false;
      } else if (result.data.typeID == 2) {
        this.data = this.overviewdata.model;
        this.description = 'Recurring';
        this.title = result.data.title;
        this.amount = result.data.amount / 100;
        this.currency = result.data.currency;
        this.frequency = result.data.frequency;

        this.recurring = true;
        this.single = false;
        this.singleRecurring = false;
      } else {
        this.data = this.overviewdata.model;
        this.description = 'Single + Recurring';
        this.title = result.data.title;
        this.amount = result.data.amount / 100;
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
