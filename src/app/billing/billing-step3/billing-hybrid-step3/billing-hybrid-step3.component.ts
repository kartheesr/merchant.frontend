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
  newForm;
  public amountCurrency: any;
  public calendarlist: any;
  public Placeholdername: any;
  public Priceplaceholdername: any;
  public hideerror: boolean = false;
  constructor(private router: Router, private service: BillingServiceStep3, private stepTrack: StepperComponent) {
    this.amountCurrency = [
      {
        id: 1,
        label: 'USD',
        value: 0,
        name: '$'
      },
      {
        id: 2,
        label: 'EUR',
        value: 1,
        name: '€'
      },
      {
        id: 3,
        label: 'GBP',
        value: 2,
        name: '£'
      },
      {
        id: 4,
        label: 'JPY',
        value: 4,
        name: '¥'
      }
    ];
    this.calendarlist = [
      {
        id: 1,
        label: 'Days',
        value: 0
      },
      {
        id: 2,
        label: 'Weeks',
        value: 1
      },
      {
        id: 3,
        label: 'Months',
        value: 2
      },
      {
        id: 4,
        label: 'Years',
        value: 1
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
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    } else if (this.editId) {
      this.Updateget();
    }
  }
  onSubmit(data) {
    if (data.value.Recurringdays == 1) {
      this.hideerror == true;
    } else if (data.value) {
      this.model.price = this.model.price * 100;
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
  handlevalidate(data) {
    if (data.value == 1) this.hideerror = true;
    else this.hideerror = false;
  }
  handlechangecurrency(data) {
    if (data.value == 'USD') {
      this.Placeholdername = '$0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else if (data.value == 'EUR') {
      this.Placeholdername = '€0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else if (data.value == 'GBP') {
      this.Placeholdername = '£0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else {
      this.Placeholdername = '¥0.00';
      this.model.PeriodCurrency = this.model.Currency;
    }
  }
  handlechangecalculate(data) {
    if (data.value == 'Days') this.model.daycount = this.model.days;
    else if (data.value == 'Weeks') this.model.daycount = this.model.days * 7;
    else if (data.value == 'Months') this.model.daycount = this.model.days * 30;
    else this.model.daycount = this.model.days * 365;
  }
}
