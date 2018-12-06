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
      console.log('result.data', result.data);
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
            if (this.days <= 7) {
              temp.days = this.days;
              this.sample[i].data = temp;
            } else if (this.days >= 7 && this.days <= 29) {
              this.week = this.days % 7;
              temp.weeks = this.week;
              this.week1 = this.days / 7;
              this.week2 = parseInt(this.week1);
              temp.days = this.week2;
              this.sample[i].data = temp;
            } else if (this.days > 30 && this.days <= 360) {
              this.week1 = this.days / 30;
              this.week2 = parseInt(this.week1);
              temp.months = this.week2;
              this.week = this.days % 30;
              temp.days = this.week2;
              this.sample[i].data = temp;
            } else if (this.days > 360) {
              this.week1 = this.days / 360;
              this.week2 = parseInt(this.week1);
              temp.years = this.week2;
              this.week = this.days % 360;
              this.week3 = this.week / 30;
              this.week4 = parseInt(this.week3);
              temp.months = this.week4;
              this.week5 = this.week % 30;
              temp.days = this.week5;
              this.sample[i].data = temp;
            }
            i++;
            console.log('sample', this.sample);
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
