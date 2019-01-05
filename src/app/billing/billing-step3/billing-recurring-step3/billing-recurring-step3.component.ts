import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { BillingServiceStep3 } from '../billing-step3.service';
import { StepperComponent } from '@app/billing/stepper/stepper.component';
import { BillingServiceStep2 } from '../../billing-step2/billing-step2.service';
import { DashboardService } from '../../../dashboard/dashboard.service';

@Component({
  selector: 'app-billing-recurring-step3',
  templateUrl: './billing-recurring-step3.component.html',
  styleUrls: ['./billing-recurring-step3.component.scss']
})
export class BillingRecurringStep3Component implements OnInit {
  public model;
  newForm;
  public selectOption: any;
  public indefinite: boolean;
  public recurrenceOption = [];
  data;
  pmavalue;
  constructor(
    private router: Router,
    private service: BillingServiceStep3,
    private stepTrack: StepperComponent,
    private service1: BillingServiceStep2,
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
    this.recurrenceOption = [
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
        value: 3
      }
    ];
    router.events.subscribe((event: Event) => {
      if (location.hash === '#/pullpayments/step2') {
        this.stepTrack.onBackStep2();
      }
      if (location.hash === '#/pullpayments/recurring/step4') {
        this.stepTrack.onStep4();
      }
    });
  }

  ngOnInit() {
    this.ApiService.getPMA('USD').subscribe(result => {
      this.pmavalue = result.PMA;
    });
    this.data = this.service1.model;
    this.model = {
      rupees: '',
      amount: '',
      No1: '',
      No2: '',
      No3: '',
      Period1: '',
      Period2: '',
      Toggle: '',
      typeid: 3,
      trialperiod: 0,
      daycount: '',
      trialdaycount: 0
    };
    this.indefinite = false;
    this.model.Period2 = this.recurrenceOption[0].label;
    this.model.Period1 = this.recurrenceOption[0].label;
    this.model.rupees = this.selectOption[0].label;
    this.model.Toggle = false;
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    }
  }
  onBack() {
    this.stepTrack.onBackStep2();
    this.router.navigate(['pullpayments/step2']);
  }
  onSubmit(data) {
    if (data.value) {
      if (this.indefinite) {
        this.model.No2 = 'indefinite';
        this.model.amount = this.model.amount * 100;
        this.stepTrack.onStep4();
        this.service.setValues(this.model);
        this.router.navigate(['pullpayments/recurring/step4']);
      } else {
        this.model.amount = this.model.amount * 100;
        this.stepTrack.onStep4();
        this.service.setValues(this.model);
        this.router.navigate(['pullpayments/recurring/step4']);
      }
    }
  }
  handlechangetrial(data) {
    if (data.value == false) {
      this.model.typeid = 3;
      this.model.trialperiod = 0;
      this.model.No3 = '';
      this.model.trialdaycount = 0;
    } else {
      this.model.typeid = 5;
      this.model.trialperiod = 1;
    }
  }
  handlechangecalculate(data) {
    if (data.value == 'Days') {
      let val = this.model.No1;
      this.model.daycount = val * 24 * 60 * 60;
    } else if (data.value == 'Weeks') {
      let val = this.model.No1 * 7;
      this.model.daycount = val * 24 * 60 * 60;
    } else if (data.value == 'Months') {
      let val = this.model.No1 * 30;
      this.model.daycount = val * 24 * 60 * 60;
    } else {
      let val = this.model.No1 * 365;
      this.model.daycount = val * 24 * 60 * 60;
    }
  }
  handlechangedays() {
    if (this.model.Period1 == 'Days') {
      let val = this.model.No1;
      this.model.daycount = val * 24 * 60 * 60;
    }
  }
  handlechangetrailperiods(data) {
    if (data.value == 'Days') {
      let val = this.model.No3;
      this.model.trialdaycount = val * 24 * 60 * 60;
    } else if (data.value == 'Weeks') {
      let val = this.model.No3 * 7;
      this.model.trialdaycount = val * 24 * 60 * 60;
    } else if (data.value == 'Months') {
      let val = this.model.No3 * 30;
      this.model.trialdaycount = val * 24 * 60 * 60;
    } else {
      let val = this.model.No3 * 365;
      this.model.trialdaycount = val * 24 * 60 * 60;
    }
  }
  handlechangetraildays() {
    if (this.model.Period2 == 'Days') {
      let val = this.model.No3;
      this.model.trialdaycount = val * 24 * 60 * 60;
    }
  }

  handleChangeCurrency(data) {
    this.ApiService.getPMA(data.value).subscribe(result => {
      this.pmavalue = result.PMA;
    });
  }

  checkbox() {
    if (this.indefinite == false) {
      this.indefinite = true;
      this.model.No2 = '';
      console.log(this.indefinite);
    } else {
      this.indefinite = false;
      console.log(this.indefinite);
    }
  }
}
