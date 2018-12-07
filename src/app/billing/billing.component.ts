import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { I18nService } from '@app/core';
import { finalize } from 'rxjs/operators';
import { BillingService } from '@app/billing/billing.service';
import { currencyPipe } from '@app/billing/currency.pipe';
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { restElement } from 'babel-types';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [CurrencyPipe, NgbModalConfig, NgbModal]
})
export class BillingComponent implements OnInit {
  public sample = [];
  public billcycledays = [];
  version: string = environment.version;
  pullPaymentsBalance;
  pullPaymentsCurrency;
  error: string;
  loginForm: FormGroup;
  isLoading = false;
  submitted = false;
  show1: boolean;
  show2: boolean;
  newForm = 'newForm';
  temp;

  SinglePullValue: number;
  RecurringPullValue: number;
  SingleWithRecurringValue: number;
  RecurringWithTrialValue: number;
  YearValue: any = {};
  YearValue1: any = {};

  days: any;
  weeks: any;
  months: any;
  years: any;
  month;
  year;
  day;
  month1;
  year1;
  month2;
  month3;
  month4;
  week;
  week1;
  week2;
  week3;
  week4;
  week5;

  day1;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private billingService: BillingService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.sample = [];
    this.show1 = true;
    this.Getpull();
    this.getPullPayment();
  }
  open(content) {
    this.modalService.open(content);
  }
  open1(data) {
    this.modalService.open(data);
  }
  update(data) {
    localStorage.removeItem('newForm');
    localStorage.setItem('editId', data);
    this.router.navigate(['/pullpayments/step1']);
  }
  Getpull() {
    var i = 0;
    this.SinglePullValue = 0;
    this.RecurringPullValue = 0;
    this.SingleWithRecurringValue = 0;
    this.RecurringWithTrialValue = 0;
    this.billingService.Getpull().subscribe(result => {
      if (result.success == true) {
        if (result.data.length != 0) {
          this.show1 = false;
          this.show2 = true;
          this.sample = result.data;
          for (let val of result.data) {
            if (val.typeID == 2) {
              this.SinglePullValue++;
            } else if (val.typeID == 3 || val.typeID == 5) {
              this.RecurringPullValue++;
            } else if (val.typeID == 6) {
              this.SingleWithRecurringValue++;
            } else {
              this.RecurringWithTrialValue++;
            }
          }

          for (let cal of result.data) {
            let temp = { days: '', weeks: '', months: '', years: '' };
            this.days = cal.frequency / (24 * 60 * 60);
            console.log('this.days', this.days);
            if (this.days > 360) {
              console.log('no years', this.days);
              this.year = this.days / 360;
              this.year1 = parseInt(this.year);
              temp.years = this.year1;
              console.log('year360', this.year1);
              this.month = this.days - this.year1 * 360;
              // console.log("month360", this.month);
              this.sample[i].data = temp;
              if (this.month > 30) {
                this.month1 = this.month / 30;
                this.month2 = parseInt(this.month1);
                temp.months = this.month2;
                console.log('month36031', this.month2);
                this.week = this.month - this.month2 * 30;
                console.log('day3608', this.week);
                this.sample[i].data = temp;
                if (this.month2 == 30) {
                  this.month3 = this.month2 / 30;
                  temp.months = this.month3;
                  console.log('month36030', this.month3);
                  this.sample[i].data = temp;
                } else if (this.month2 > 7) {
                  this.week2 = this.week / 7;
                  this.week1 = parseInt(this.week2);
                  temp.weeks = this.week1;
                  console.log('week3608', this.week1);
                  this.day = this.week - this.week1 * 7;
                  temp.days = this.day;
                  console.log('day3608', this.day);
                  this.sample[i].data = temp;
                } else if (this.month2 == 7) {
                  this.week3 = this.month2 / 7;
                  temp.weeks = this.week3;
                  console.log('week3607', this.week4);
                  this.sample[i].data = temp;
                } else if (this.month2 < 7) {
                  temp.days = this.month2;
                  console.log('day3607', this.month2);
                  this.sample[i].data = temp;
                }
              } else if (this.month < 30 && this.month > 7) {
                this.week2 = this.month / 7;
                this.week5 = parseInt(this.week2);
                console.log('week360307', this.week5);
                temp.weeks = this.week5;
                this.day = this.month - this.week5 * 7;
                console.log('day360307', this.day);
                temp.days = this.day;
                this.sample[i].data = temp;
              } else if (this.month < 7) {
                temp.days = this.month;
                this.sample[i].data = temp;
              }
            } else if (this.days > 30 && this.days < 360) {
              console.log('no month', this.days);
              if (this.days > 30) {
                this.month1 = this.days / 30;
                this.month2 = parseInt(this.month1);
                temp.months = this.month2;
                console.log('month30360', this.month2);
                this.week = this.days - this.month2 * 30;
                // temp.weeks = this.week;
                console.log('week30360', this.week);
                this.sample[i].data = temp;

                if (this.week == 30) {
                  this.month3 = this.week / 30;
                  // this.month4 = parseInt(this.month3);
                  temp.months = this.month3;
                  console.log('month36030', this.month4);
                  this.sample[i].data = temp;
                } else if (this.week > 7) {
                  this.week2 = this.week / 7;
                  this.week1 = parseInt(this.week2);
                  temp.weeks = this.week1;
                  console.log('week3608', this.week1);
                  this.day = this.week - this.week1 * 7;
                  temp.days = this.day;
                  console.log('day3608', this.day);
                  this.sample[i].data = temp;
                } else if (this.week == 7) {
                  this.week3 = this.week / 7;
                  // this.week4 = parseInt(this.week3);
                  temp.weeks = this.week3;
                  console.log('week3607', this.week4);
                  this.sample[i].data = temp;
                } else if (this.week < 7) {
                  temp.days = this.week;
                  console.log('day3607', this.week);
                  this.sample[i].data = temp;
                }
              }
            } else if (this.days == 30) {
              console.log('1month', this.days);
              console.log('1month');
              this.month3 = this.days / 30;
              temp.months = this.month3;
              console.log('month30', this.month3);
              this.sample[i].data = temp;
            } else if (this.days > 7 && this.days < 30) {
              console.log('7month30');
              this.week2 = this.days / 7;
              this.week1 = parseInt(this.week2);
              temp.weeks = this.week1;
              console.log('week730', this.week1);
              this.day = this.days - this.week1 * 7;
              temp.days = this.day;
              console.log('day730', this.day);
              this.sample[i].data = temp;
            } else if (this.days == 7) {
              console.log('1week');
              console.log('this.days', this.days);
              this.week3 = this.days / 7;
              // this.week4 = parseInt(this.week3);
              temp.weeks = this.week3;
              console.log('week3607', this.week4);
              this.sample[i].data = temp;
            } else if (this.days < 7) {
              console.log('days');
              temp.days = this.days;
              console.log('day3607', temp.days);
              this.sample[i].data = temp;
            }

            console.log('sample', this.sample);
            i++;
          }
          // for (var i = 0; i <= this.sample.length; i++) {
          //   this.sample[i].days = this.billcycledays[i].days;
          //   this.sample[i].weeks = this.billcycledays[i].weeks;
          //   this.sample[i].months = this.billcycledays[i].months;
          //   this.sample[i].years = this.billcycledays[i].years;
          // }
        }
      } else {
        this.show1 = true;
        this.show2 = false;
      }
    });
  }
  new() {
    localStorage.setItem('newForm', this.newForm);
    localStorage.removeItem('editId');
  }

  deletePull(data) {
    this.billingService.Deletepull(data.id).subscribe(result => {
      if (result.success == true) {
        this.Getpull();
      }
    });
  }
  getPullPayment() {
    this.isLoading = true;
    this.billingService.getPullPayment().subscribe(result => {
      this.pullPaymentsBalance = result.data.pullPayments.balance;
      this.pullPaymentsCurrency = result.data.pullPayment.currency;
    });
  }

  onClick(data) {
    this.router.navigate(['./billing/billingmodeloverview'], { queryParams: { pullPayId: data } });
  }
}
