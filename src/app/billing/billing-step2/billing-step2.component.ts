import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { BillingServiceStep2 } from './billing-step2.service';
import { BillingServiceStep1 } from '../billing-step1/billing-step1.service';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-billing-step2',
  templateUrl: './billing-step2.component.html',
  styleUrls: ['./billing-step2.component.scss']
})
export class BillingStep2Component implements OnInit {
  model: any = {};
  // editId;
  datavalidation: any = {};
  newForm;
  homePage;
  // homePage1;
  valid: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BillingServiceStep2,
    private billingdata: BillingServiceStep1,
    private stepTrack: StepperComponent
  ) {
    router.events.subscribe((event: Event) => {
      if (location.hash === '#/pullpayments/step1') {
        this.stepTrack.onBackStep1();
      }
      if (
        location.hash === '#/pullpayments/single/step3' ||
        location.hash === '#/pullpayments/recurring/step3' ||
        location.hash === '#/pullpayments/hybrid/step3'
      ) {
        this.stepTrack.onStep3();
      }
    });
  }
  ngOnInit() {
    this.homePage = {
      count: 140
    };
    this.datavalidation = this.billingdata.model;
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    }
  }
  onBack() {
    this.stepTrack.onBackStep1();
    this.router.navigate(['pullpayments/step1']);
  }
  onSubmit(f) {
    this.stepTrack.onStep3();
    this.service.setValues(this.model);
    if (this.datavalidation.billing == 'Single') this.router.navigate(['pullpayments/single/step3']);
    else if (this.datavalidation.billing == 'Subscription') this.router.navigate(['pullpayments/recurring/step3']);
    else if (this.datavalidation.billing == 'Single + Subscription')
      this.router.navigate(['pullpayments/hybrid/step3']);
  }

  handleCount(data) {
    if (data.value.length > 0) {
      let count = 140 - data.value.length;
      this.homePage.count = count;
      this.valid = true;
    } else {
      this.homePage.count = 140;
      this.valid = false;
    }
  }
}
