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

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [CurrencyPipe, NgbModalConfig, NgbModal]
})
export class BillingComponent implements OnInit {
  public sample = [];
  version: string = environment.version;
  pullPaymentsBalance;
  pullPaymentsCurrency;
  error: string;
  loginForm: FormGroup;
  isLoading = false;
  submitted = false;
  show1: boolean;
  show2: boolean;

  SinglePullValue: number;
  RecurringPullValue: number;
  SingleWithRecurringValue: number;
  RecurringWithTrialValue: number;

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
    console.log(' Update data', data);
    localStorage.setItem('editId', data);
    this.router.navigate(['/billing/step1']);
  }

  Saveclick() {
    console.log('button clicked');
  }
  Getpull() {
    console.log('GetAPI');
    this.SinglePullValue = 0;
    this.RecurringPullValue = 0;
    this.SingleWithRecurringValue = 0;
    this.RecurringWithTrialValue = 0;
    this.billingService.Getpull().subscribe(result => {
      if (result.success == true) {
        console.log('GETsuccess', result);
        this.show1 = false;
        this.show2 = true;
        this.sample = result.data;
        for (let val of result.data) {
          if (val.typeID == 1) {
            this.SinglePullValue++;
          } else if (val.typeID == 2) {
            this.RecurringPullValue++;
          } else if (val.typeID == 3) {
            this.SingleWithRecurringValue++;
          } else {
            this.RecurringWithTrialValue++;
          }
        }
      } else {
        this.show1 = true;
        this.show2 = false;
      }
    });
  }

  deletePull(data) {
    console.log('delete start', data.id);
    this.billingService.Deletepull(data.id).subscribe(result => {
      console.log('delete2', result);
      if (result.success == true) {
        console.log('deleteif', result);
        this.Getpull();
      }
    });
  }
  getPullPayment() {
    this.isLoading = true;
    this.billingService.getPullPayment().subscribe(result => {
      console.log('response of pullPayment', result);
      this.pullPaymentsBalance = result.data.pullPayments.balance;
      this.pullPaymentsCurrency = result.data.pullPayment.currency;
    });
  }
}
