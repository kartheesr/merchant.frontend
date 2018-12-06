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
  newForm;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BillingServiceStep2,
    private billingdata: BillingServiceStep1,
    private stepTrack: StepperComponent
  ) {}
  ngOnInit() {
    this.datavalidation = this.billingdata.model;
    this.model.billingModelName = this.datavalidation.billing;
    this.editId = localStorage.getItem('editId');
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    } else if (this.editId) {
      this.Updateget();
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
    else if (this.datavalidation.billing == 'Recurring') this.router.navigate(['pullpayments/recurring/step3']);
    else if (this.datavalidation.billing == 'Single + Recurring') this.router.navigate(['pullpayments/hybrid/step3']);
  }
  Updateget() {
    this.service.Updateget(this.editId).subscribe(result => {
      if (result.success == true) {
        if (this.editId) {
          this.model.productName = result.data.title;
          this.model.billingModelName = this.datavalidation.billing;
          this.model.billModelDes = result.data.description;
        }
      }
    });
  }
}
