import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-billing-model-overview',
  templateUrl: './billing-model-overview.component.html',
  styleUrls: ['./billing-model-overview.component.scss'],
  providers: [BillingService, CurrencyPipe]
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

  constructor(public service: BillingService) {}
  typeID;

  ngOnInit() {
    this.id = localStorage.getItem('publishId');

    this.service.Getpull().subscribe(result => {
      if (result.success == true) {
        this.subscribers = result.data.lenght;
      }
    });

    this.service.getByIdBillingModel(this.id).subscribe(result => {
      console.log('result of overview', result);
      localStorage.removeItem('publishId');

      if (result.data.typeID == 1) {
        this.description = result.description;
        this.title = result.title;
        this.amount = result.amount;
        this.currency = result.currency;
        this.single = true;
        this.recurring = false;
        this.singleRecurring = false;
      } else if (result.data.typeID == 2) {
        this.recurring = true;
        this.single = false;
        this.singleRecurring = false;
      } else {
        this.singleRecurring = true;
        this.single = false;
        this.recurring = false;
      }
    });
  }
}
