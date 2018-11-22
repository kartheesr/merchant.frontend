import { Component, OnInit } from '@angular/core';
import { BillingServiceStep3 } from '../billing-step3.service';
import { Router } from '@angular/router';
import { StepperComponent } from '@app/billing/stepper/stepper.component';

@Component({
  selector: 'app-billing-hybrid-step3',
  templateUrl: './billing-hybrid-step3.component.html',
  styleUrls: ['./billing-hybrid-step3.component.scss']
})
export class BillingHybridStep3Component implements OnInit {
  public model: any;
  editId;
  public amountCurrency: any;
  public calendarlist: any;
  public Placeholdername: any;
  public Priceplaceholdername: any;
  constructor(private router: Router, private service: BillingServiceStep3, private stepTrack: StepperComponent) {
    this.amountCurrency = [
      {
        id: 1,
        label: 'USD',
        value: 0
      },
      {
        id: 2,
        label: 'EUR',
        value: 1
      },
      {
        id: 3,
        label: 'GBP',
        value: 2
      },
      {
        id: 4,
        label: 'JPY',
        value: 3
      }
    ];
    this.calendarlist = [
      {
        id: 1,
        label: 'Day',
        value: 0
      },
      {
        id: 2,
        label: 'Month',
        value: 1
      },
      {
        id: 3,
        label: 'Year',
        value: 2
      }
    ];
  }

  ngOnInit() {
    this.model = {
      Currency: '',
      price: '',
      days: '',
      calendar: '',
      PeriodCurrency: '',
      Periodprice: '',
      billingdays: '',
      billingcalendar: '',
      Recurringdays: '',
      daycount: ''
    };
    this.model.Currency = this.amountCurrency[0].label;
    this.model.calendar = this.calendarlist[0].label;
    this.model.PeriodCurrency = this.amountCurrency[0].label;
    this.model.billingcalendar = this.calendarlist[0].label;
    this.Placeholdername = '$0.00';
    this.Priceplaceholdername = '$0.00';
    this.editId = localStorage.getItem('editId');
    if (this.editId) {
      this.Updateget();
    }
  }
  onSubmit(data) {
    if (data.value) {
      this.stepTrack.onStep4();
      this.service.setValues(this.model);
      this.router.navigate(['pullpayments/hybrid/step4']);
    }
  }
  onBack() {
    this.stepTrack.onBackStep2();
    this.router.navigate(['pullpayments/step2']);
  }
  Updateget() {
    this.service.Updateget(this.editId).subscribe(result => {
      if (result.success == true) {
        if (this.editId) {
          this.model.price = result.data.amount;
          this.model.Currency = result.data.currency;
          this.model.days = result.data.frequency;
        }
      }
    });
  }
  handlechangecurrency(data) {
    if (data.value == 'USD') this.Placeholdername = '$0.00';
    else if (data.value == 'EUR') this.Placeholdername = '€0.00';
    else if (data.value == 'GBP') this.Placeholdername = '£0.00';
    else this.Placeholdername = '¥0.00';
  }
  handlechangeperiodcurrency(data) {
    if (data.value == 'USD') this.Priceplaceholdername = '$0.00';
    else if (data.value == 'EUR') this.Priceplaceholdername = '€0.00';
    else if (data.value == 'GBP') this.Priceplaceholdername = '£0.00';
    else this.Priceplaceholdername = '¥0.00';
  }
  handlechangecalculate(data) {
    if (data.value == 'Day') this.model.daycount = this.model.days;
    else if (data.value == 'Month') this.model.daycount = this.model.days * 30;
    else this.model.daycount = this.model.days * 365;
  }
}
