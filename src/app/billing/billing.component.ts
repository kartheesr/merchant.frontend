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
  gasBalance;
  treasuryAddress;

  SinglePullValue: number;
  RecurringPullValue: number;
  SingleWithRecurringValue: number;
  RecurringWithTrialValue: number;
  YearValue: any = {};
  YearValue1: any = {};
  value: string = '';
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
  USDValue;
  Transfergas;
  recurrencegas;
  workdata;
  workdata1;
  workdata2;
  Totalgas;
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
    this.billingService.gasusdvalue().subscribe(result => {
      this.USDValue = result.data.USD;
      this.billingService.gastransferpull().subscribe(result => {
        let gas = result.data * 0.00000001;
        this.Transfergas = gas.toFixed(5).replace(/0+$/, '');
        this.billingService.gasrecurrence().subscribe(result => {
          let val = result.data * 0.00000001;
          this.recurrencegas = val.toFixed(5).replace(/0+$/, '');
          this.Getpull();
        });
      });
    });

    this.getPullPayment();
    this.billingService.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = res.balance; // GAS VALUE
    });
    this.billingService.getQRCodeaddress().subscribe(result => {
      this.treasuryAddress = result.address; // TREASURY ADDRESS
    });
    setTimeout(() => {
      this.qrValue();
    }, 3000);
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  open(pumacopyHybrid) {
    this.modalService.open(pumacopyHybrid);
  }
  // open1(data) {
  //   this.modalService.open(data);
  // }
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
            let temp = { days: '', weeks: '', months: '', years: '', gascost: '' };
            let temp1 = { day: '', week: '', month: '', year: '' };
            this.days = cal.frequency / (24 * 60 * 60);
            this.years = Math.floor(this.days / 365);
            this.months = Math.floor((this.days % 365) / 30);
            this.weeks = Math.floor(((this.days % 365) % 30) / 7);
            this.days = Math.floor(((this.days % 365) % 30) % 7);
            temp.years = this.years;
            temp.months = this.months;
            temp.weeks = this.weeks;
            temp.days = this.days;
            if (cal.typeID == 2) {
              // this.billingService.gasusdvalue().subscribe(result => {
              //   this.USDValue = result.data.USD;
              //   this.billingService.gastransferpull().subscribe(result => {
              //     let gas = result.data * 0.00000001;
              //     this.Transfergas = gas.toFixed(5).replace(/0+$/, '');
              //     this.billingService.gasrecurrence().subscribe(result => {
              //       let val = result.data * 0.00000001;
              //       this.recurrencegas = val.toFixed(5).replace(/0+$/, '');
              let recurrence = 1;
              this.workdata = (this.recurrencegas * this.USDValue * recurrence).toFixed(5).replace(/0+$/, '');
              let TransRecurrence = 1;
              this.workdata2 = (this.Transfergas * this.USDValue * TransRecurrence).toFixed(5).replace(/0+$/, '');
              let Total = parseFloat(this.workdata) + parseFloat(this.workdata2);
              this.Totalgas = parseFloat(Total.toFixed(2).replace(/0+$/, ''));
              temp.gascost = this.Totalgas;
              //     });
              //   });
              // });
            } else if (cal.typeID == 3 || cal.typeID == 5) {
              // this.billingService.gasusdvalue().subscribe(result => {
              //   this.USDValue = result.data.USD;
              //   this.billingService.gastransferpull().subscribe(result => {
              //     let gas = result.data * 0.00000001;
              //     this.Transfergas = gas.toFixed(5).replace(/0+$/, '');
              //     this.billingService.gasrecurrence().subscribe(result => {
              //       let val = result.data * 0.00000001;
              //       this.recurrencegas = val.toFixed(5).replace(/0+$/, '');
              let recurrence = cal.numberOfPayments;
              this.workdata = (this.recurrencegas * this.USDValue * recurrence).toFixed(5).replace(/0+$/, '');
              let TransRecurrence = 1;
              this.workdata2 = (this.Transfergas * this.USDValue * TransRecurrence).toFixed(5).replace(/0+$/, '');
              let Total = parseFloat(this.workdata) + parseFloat(this.workdata2);
              this.Totalgas = parseFloat(Total.toFixed(2).replace(/0+$/, ''));
              temp.gascost = this.Totalgas;
              //     });
              //   });
              // });
            } else {
              // this.billingService.gasusdvalue().subscribe(result => {
              //   this.USDValue = result.data.USD;
              //   this.billingService.gastransferpull().subscribe(result => {
              //     let gas = result.data * 0.00000001;
              //     this.Transfergas = gas.toFixed(5).replace(/0+$/, '');
              //     this.billingService.gasrecurrence().subscribe(result => {
              //       let val = result.data * 0.00000001;
              //       this.recurrencegas = val.toFixed(5).replace(/0+$/, '');
              let inital = 1;
              this.workdata = (this.recurrencegas * this.USDValue * inital).toFixed(5).replace(/0+$/, '');
              let recurrence = cal.numberOfPayments;
              this.workdata1 = (this.recurrencegas * this.USDValue * recurrence).toFixed(5).replace(/0+$/, '');
              let TransRecurrence = 1;
              this.workdata2 = (this.Transfergas * this.USDValue * TransRecurrence).toFixed(5).replace(/0+$/, '');
              let Total = parseFloat(this.workdata) + parseFloat(this.workdata1) + parseFloat(this.workdata2);
              this.Totalgas = parseFloat(Total.toFixed(2).replace(/0+$/, ''));
              temp.gascost = this.Totalgas;
              //     });
              //   });
              // });
            }
            this.sample[i].data = temp;
            this.day = cal.trialPeriod / (24 * 60 * 60);
            this.year = Math.floor(this.day / 365);
            this.month = Math.floor((this.day % 365) / 30);
            this.week = Math.floor(((this.day % 365) % 30) / 7);
            this.day = Math.floor(((this.day % 365) % 30) % 7);
            temp1.year = this.year;
            temp1.month = this.month;
            temp1.week = this.week;
            temp1.day = this.day;
            this.sample[i].data1 = temp1;
            i++;
          }
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

  qrValue() {
    this.billingService.getQRValue(this.gasBalance, this.treasuryAddress).subscribe(result => {
      this.value = JSON.stringify(result.data);
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
