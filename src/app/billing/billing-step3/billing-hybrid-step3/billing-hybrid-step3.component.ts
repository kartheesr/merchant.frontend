import { Component, OnInit } from '@angular/core';
import { BillingServiceStep3 } from '../billing-step3.service';
import { Router, Event } from '@angular/router';
import { StepperComponent } from '@app/billing/stepper/stepper.component';
import { BillingServiceStep2 } from '../../billing-step2/billing-step2.service';
import { DashboardService } from '../../../dashboard/dashboard.service';
import * as moment from 'moment';
@Component({
  selector: 'app-billing-hybrid-step3',
  templateUrl: './billing-hybrid-step3.component.html',
  styleUrls: ['./billing-hybrid-step3.component.scss']
})
export class BillingHybridStep3Component implements OnInit {
  public model: any;
  public amountCurrency: any;
  public calendarlist: any;
  public Placeholdername: any;
  public Priceplaceholdername: any;
  public hideerror: boolean = false;
  public indefinite: boolean;
  newForm;
  data;
  pmavalue;
  BillingPeriod;
  constructor(
    private router: Router,
    private service: BillingServiceStep3,
    private stepTrack: StepperComponent,
    private service1: BillingServiceStep2,
    private ApiService: DashboardService
  ) {
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
        value: 3,
        name: '¥'
      },
      {
        id: 5,
        label: 'KRW',
        value: 4,
        name: '₩'
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
    router.events.subscribe((event: Event) => {
      if (location.hash === '#/pullpayments/step2') {
        this.stepTrack.onBackStep2();
      }
      if (location.hash === '#/pullpayments/hybrid/step4') {
        this.stepTrack.onStep4();
      }
    });
  }

  ngOnInit() {
    this.ApiService.getPMA('USD').subscribe(result => {
      this.pmavalue = result.PMA;
    });
    var dt = new Date();
    this.BillingPeriod = moment(dt).format('D MMM YYYY');
    this.data = this.service1.model;
    console.log('This.data-->', this.data);
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
      daycount: '',
      billingdaycount: ''
    };
    this.indefinite = false;
    this.model.Currency = this.amountCurrency[0].label;
    this.model.calendar = this.calendarlist[0].label;
    this.model.PeriodCurrency = this.amountCurrency[0].label;
    this.model.billingcalendar = this.calendarlist[0].label;
    this.Placeholdername = '$0.00';
    this.Priceplaceholdername = '$0.00';
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    }
  }
  onSubmit(data) {
    if (data.value.Recurringdays == 1) {
      this.hideerror == true;
    } else if (data.value) {
      if (this.indefinite) {
        this.model.price = this.model.price * 100;
        this.model.Periodprice = this.model.Periodprice * 100;
        this.model.Recurringdays = 'indefinite';
        this.stepTrack.onStep4();
        this.service.setValues(this.model);
        console.log(this.model);
        this.router.navigate(['pullpayments/hybrid/step4']);
      } else {
        this.model.price = this.model.price * 100;
        this.model.Periodprice = this.model.Periodprice * 100;
        this.stepTrack.onStep4();
        this.service.setValues(this.model);
        console.log(this.model);
        this.router.navigate(['pullpayments/hybrid/step4']);
      }
    }
  }
  onBack() {
    this.stepTrack.onBackStep2();
    this.router.navigate(['pullpayments/step2']);
  }
  handlevalidate(data) {
    if (data.value == 1) this.hideerror = true;
    else this.hideerror = false;
  }
  handlechangecurrency(data) {
    this.ApiService.getPMA(data.value).subscribe(result => {
      this.pmavalue = result.PMA;
    });
    if (data.value == 'USD') {
      this.Placeholdername = '$0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else if (data.value == 'EUR') {
      this.Placeholdername = '€0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else if (data.value == 'GBP') {
      this.Placeholdername = '£0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else if (data.value == 'JPY') {
      this.Placeholdername = '¥0.00';
      this.model.PeriodCurrency = this.model.Currency;
    } else {
      this.Placeholdername = '₩0.00';
      this.model.PeriodCurrency = this.model.Currency;
    }
  }
  handlecurrency(data) {
    this.ApiService.getPMA(data.value).subscribe(result => {
      this.pmavalue = result.PMA;
    });
  }
  handlechangecalculatecycle(data) {
    if (data.value == 'Days') {
      let val = this.model.billingdays;
      this.model.daycount = val * 24 * 60 * 60;
    } else if (data.value == 'Weeks') {
      let val = this.model.billingdays * 7;
      this.model.daycount = val * 24 * 60 * 60;
    } else if (data.value == 'Months') {
      let val = this.model.billingdays * 30;
      this.model.daycount = val * 24 * 60 * 60;
    } else {
      let val = this.model.billingdays * 365;
      this.model.daycount = val * 24 * 60 * 60;
    }
  }
  handlechangedayscycle() {
    if (this.model.billingcalendar == 'Days') {
      let val = this.model.billingdays;
      this.model.daycount = val * 24 * 60 * 60;
    }
  }
  handlechangestartbilling(data) {
    if (data.value == 'Days') {
      let val = this.model.days;
      this.model.billingdaycount = val * 24 * 60 * 60;
    } else if (data.value == 'Weeks') {
      let val = this.model.days * 7;
      this.model.billingdaycount = val * 24 * 60 * 60;
    } else if (data.value == 'Months') {
      let val = this.model.days * 30;
      this.model.billingdaycount = val * 24 * 60 * 60;
    } else {
      let val = this.model.days * 365;
      this.model.billingdaycount = val * 24 * 60 * 60;
    }
  }
  handlechangestartdays() {
    if (this.model.calendar == 'Days') {
      let val = this.model.days;
      this.model.billingdaycount = val * 24 * 60 * 60;
    }
  }

  checkbox() {
    if (this.indefinite == false) {
      this.indefinite = true;
      this.model.Recurringdays = '';
      console.log(this.indefinite);
    } else {
      this.indefinite = false;
      console.log(this.indefinite);
    }
  }
}
