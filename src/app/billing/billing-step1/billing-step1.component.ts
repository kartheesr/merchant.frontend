import { Component, OnInit, NgModule, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BillingServiceStep1 } from './billing-step1.service';

import { Title } from '@angular/platform-browser';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-billing-step1',
  templateUrl: './billing-step1.component.html',
  styleUrls: ['./billing-step1.component.scss']
})
export class BillingStep1Component implements OnInit {
  model: any = {};
  showerror: boolean;
  @Output() topic = new EventEmitter<string>();

  constructor(private router: Router, private service: BillingServiceStep1, private step1: StepperComponent) {}
  ngOnInit() {}
  onSubmit(data) {
    if (!data.value.billing) {
      this.showerror = true;
    } else {
      this.step1.onStep2();
      this.showerror = false;
      this.service.setValues(this.model);
      this.router.navigate(['/pullpayments/step2']);
    }
  }
}
