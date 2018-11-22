import { Component, OnInit, NgModule, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BillingServiceStep1 } from './billing-step1.service';
import { BillingService } from '@app/billing/billing.service';

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
  editId: any = {};
  typeID;
  Typeid1: any = {};
  @Output() topic = new EventEmitter<string>();
  constructor(
    private router: Router,
    private service: BillingServiceStep1,
    private billingService: BillingService,
    private step1: StepperComponent
  ) {}
  ngOnInit() {
    this.editId = localStorage.getItem('editId');
    if (this.editId) {
      this.Updateget();
    }
  }
  onSubmit(data) {
    if (!data.value.billing) {
      this.showerror = true;
    } else {
      this.step1.onStep2(this.model.billing);
      this.showerror = false;
      this.service.setValues(this.model);
      this.router.navigate(['/pullpayments/step2']);
    }
  }
  Updateget() {
    this.service.Updateget(this.editId).subscribe(result => {
      if (result.success == true) {
        if (this.editId) {
          this.Typeid1 = result.data.typeID;
          if (this.Typeid1 == 1) this.model.billing = 'Single';
          else if (this.Typeid1 == 2) this.model.billing = 'Recurring';
          else this.model.billing = 'Single + Recurring';
        }
      }
    });
  }
}
