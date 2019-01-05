import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { BillingServiceStep3 } from './billing-step3.service';
import { StepperComponent } from '../stepper/stepper.component';
import { BillingServiceStep2 } from '../billing-step2/billing-step2.service';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'app-billing-step3',
  templateUrl: './billing-step3.component.html',
  styleUrls: ['./billing-step3.component.scss']
})
export class BillingStep3Component implements OnInit {
  model: any = {};
  newForm;
  public selectOption: any;
  Placeholdername: string;
  data;
  pmavalue;

  constructor(
    private router: Router,
    private service: BillingServiceStep3,
    private stepTrack: StepperComponent,
    private service2: BillingServiceStep2,
    private ApiService: DashboardService
  ) {
    this.selectOption = [
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
    this.model.rupees = this.selectOption[0].label;
    this.Placeholdername = '$0.00';
    router.events.subscribe((event: Event) => {
      if (location.hash === '#/pullpayments/step2') {
        this.stepTrack.onBackStep2();
      }
      if (location.hash === '#/pullpayments/single/step4') {
        this.stepTrack.onStep4();
      }
    });
  }
  ngOnInit() {
    this.ApiService.getPMA('USD').subscribe(result => {
      this.pmavalue = result.PMA;
    });
    this.data = this.service2.model;
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    }
  }
  onSubmit(data) {
    if (data.value.amount != '0') {
      this.model.amount = this.model.amount * 100;
      this.stepTrack.onStep4();
      this.service.setValues(this.model);
      this.router.navigate(['pullpayments/single/step4']);
    }
    return this.model;
  }
  onBack() {
    this.stepTrack.onBackStep2();
    this.router.navigate(['pullpayments/step2']);
  }
  handleChangeCurrency(data) {
    this.ApiService.getPMA(data.value).subscribe(result => {
      this.pmavalue = result.PMA;
    });
    if (data.value == 'USD') this.Placeholdername = '$0.00';
    else if (data.value == 'EUR') this.Placeholdername = '€0.00';
    else if (data.value == 'GBP') this.Placeholdername = '£0.00';
    else if (data.value == 'JPY') this.Placeholdername = '¥0.00';
    else if (data.value == 'KRW') this.Placeholdername = '₩0.00';
  }
}
