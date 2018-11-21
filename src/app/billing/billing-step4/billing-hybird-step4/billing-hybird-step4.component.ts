import { Component, OnInit } from '@angular/core';
import { BillingServiceStep1 } from '../../billing-step1/billing-step1.service';
import { BillingServiceStep2 } from '../../billing-step2/billing-step2.service';
import { BillingServiceStep3 } from '../../billing-step3/billing-step3.service';
import { BillingServiceCall } from '../billing-step4.service';
import { Router } from '@angular/router';
import { JsonpCallbackContext } from '@angular/common/http/src/jsonp';
@Component({
  selector: 'app-billing-hybird-step4',
  templateUrl: './billing-hybird-step4.component.html',
  styleUrls: ['./billing-hybird-step4.component.scss']
})
export class BillingHybirdStep4Component implements OnInit {
  Step1data: any = {};
  Step2data: any = {};
  Step3data: any = {};
  data: any = {};
  constructor(
    private router: Router,
    private service1: BillingServiceStep1,
    private service2: BillingServiceStep2,
    private service3: BillingServiceStep3,
    private service4: BillingServiceCall
  ) {}

  ngOnInit() {
    this.Step1data = this.service1.model;
    this.Step2data = this.service2.model;
    this.Step3data = this.service3.model;
    console.log('Step1' + JSON.stringify(this.Step1data));
    console.log('Step2' + JSON.stringify(this.Step2data));
    console.log('Step3' + JSON.stringify(this.Step3data));
    console.log('1' + this.Step2data.billingModelName);
    console.log('2' + this.Step2data.billModelDes);
    console.log('3' + this.Step3data.Periodprice);
    console.log('4' + this.Step3data.price);
    console.log('5' + this.Step3data.PeriodCurrency);
    console.log('6' + this.Step3data.Recurringdays);
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      title: this.Step2data.billingModelName,
      description: this.Step2data.billModelDes,
      amount: parseInt(this.Step3data.Periodprice),
      initialPaymentAmount: 0,
      trialPeriod: 0,
      currency: this.Step3data.PeriodCurrency,
      numberOfPayments: parseInt(this.Step3data.Recurringdays),
      typeID: 3,
      frequency: 604800,
      networkID: 3,
      automatedCashOut: true,
      cashOutFrequency: 1
    };
    this.data = data;
    console.log(this.data);
  }
  publish() {
    this.service4.billingPost(this.data).subscribe(result => {
      if (result.success == true) {
        console.log(result);
        //this.router.navigate(['/dashboard']);
      }
    });
  }

  onPublish() {
    this.publish();
  }
}
