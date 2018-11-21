import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  editId;
  datavalidation: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BillingServiceStep2,
    private billingdata: BillingServiceStep1,
    private stepTrack: StepperComponent
  ) {}
  ngOnInit() {
    this.datavalidation = this.billingdata.model;
    this.editId = localStorage.getItem('editId');
    if (this.editId) {
      this.Updateget();
    }
  }
  onBack() {
    this.stepTrack.onBackStep1();
    this.router.navigate(['pullpayments/step1']);
  }
  onSubmit() {
    this.stepTrack.onStep3();
    this.service.setValues(this.model);
    if (this.datavalidation.billing == 'Single') this.router.navigate(['pullpayments/single/step3']);
    else if (this.datavalidation.billing == 'Recurring') this.router.navigate(['pullpayments/recurring/step3']);
    else if (this.datavalidation.billing == 'Single and Recurring') this.router.navigate(['pullpayments/hybrid/step3']);
  }
  Updateget() {
    this.service.Updateget(this.editId).subscribe(result => {
      if (result.success == true) {
        if (this.editId) {
          this.model.billingModelName = result.data.title;
          this.model.billModelDes = result.data.description;
        }
      }
    });
  }
}
