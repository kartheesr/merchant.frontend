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
  homePage;
  homePage1;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BillingServiceStep2,
    private billingdata: BillingServiceStep1,
    private stepTrack: StepperComponent
  ) {}
  ngOnInit() {
    this.homePage = {
      count: ''
    };
    this.homePage1 = {
      count2: ''
    };
    this.datavalidation = this.billingdata.model;
    //this.model.billingModelName = this.datavalidation.billing;
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
    else if (this.datavalidation.billing == 'Subscription') this.router.navigate(['pullpayments/recurring/step3']);
    else if (this.datavalidation.billing == 'Single + Subscription')
      this.router.navigate(['pullpayments/hybrid/step3']);
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
  showSelectedText(oField) {
    let text;
    let str;
    this.homePage.count = 0;
    let count1 = 0;
    if (window.getSelection) {
      text = window.getSelection().toString();
      str = text.split('');
      for (let val of str) {
        if (val != '') {
          count1 += 1;
        }
      }
    }
    this.homePage.count = count1;
  }
  showSelectedText1(oField) {
    let text;
    let str;
    this.homePage1.count = 0;
    let count2 = 0;
    if (window.getSelection) {
      text = window.getSelection().toString();
      str = text.split('');
      for (let val of str) {
        if (val != '') {
          count2 += 1;
        }
      }
    }
    this.homePage1.count3 = count2;
  }
}
