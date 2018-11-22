import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillingServiceStep3 } from './billing-step3.service';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-billing-step3',
  templateUrl: './billing-step3.component.html',
  styleUrls: ['./billing-step3.component.scss']
})
export class BillingStep3Component implements OnInit {
  model: any = {};
  public selectOption: any;
  Placeholdername: string;
  constructor(private router: Router, private service: BillingServiceStep3, private stepTrack: StepperComponent) {
    this.selectOption = [
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
        value: 4
      }
    ];
    this.model.rupees = this.selectOption[0].label;
    this.Placeholdername = '$0.00';
  }

  ngOnInit() {}
  onSubmit(data) {
    if (data.value) {
      this.stepTrack.onStep4();
      console.log('This Model-->', this.model);
      this.service.setValues(this.model);
      this.router.navigate(['/pullpayments/single/step4']);
    }
    return this.model;
  }

  onBack() {
    this.stepTrack.onBackStep2();
    this.router.navigate(['pullpayments/step2']);
  }
  handleChangeCurrency(data) {
    if (data.value == 'USD') this.Placeholdername = '$0.00';
    else if (data.value == 'EUR') this.Placeholdername = '€0.00';
    else if (data.value == 'GBP') this.Placeholdername = '£0.00';
    else if (data.value == 'JPY') this.Placeholdername = '¥0.00';
  }
}
