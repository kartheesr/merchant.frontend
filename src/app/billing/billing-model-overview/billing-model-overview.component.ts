import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing.service';
import { CurrencyPipe } from '@angular/common';
import { DashboardService } from '@app/dashboard/dashboard.service';

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
  value: string = '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a';

  constructor(public service: BillingService, public dashboardService: DashboardService) {}
  typeID;

  ngOnInit() {
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
        this.description = result.data.description;
        this.title = result.data.title;
        this.amount = result.data.amount;
        this.currency = result.data.currency;

        this.single = true;
        this.recurring = false;
        this.singleRecurring = false;
      } else if (result.data.typeID == 2) {
        this.description = result.data.description;
        this.title = result.data.title;
        this.amount = result.data.amount;
        this.currency = result.data.currency;
        this.frequency = result.data.frequency;

        this.recurring = true;
        this.single = false;
        this.singleRecurring = false;
      } else {
        this.description = result.data.description;
        this.title = result.data.title;
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
}
