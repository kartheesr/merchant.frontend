import { Component, OnInit } from '@angular/core';
import { BillingStep1Component } from '@app/billing/billing-step1/billing-step1.component';
import { BillingServiceStep1 } from '../billing-step1/billing-step1.service';
import { BillingServiceStep2 } from '../billing-step2/billing-step2.service';
import { BillingServiceStep3 } from '../billing-step3/billing-step3.service';
import { BillingServiceCall } from './billing-step4.service';
import { Router } from '@angular/router';
import { StepperComponent } from '../stepper/stepper.component';
import { Observable } from 'rxjs';
import Web3 from 'web3';
var web3 = new Web3();

@Component({
  selector: 'app-billing-step4',
  templateUrl: './billing-step4.component.html',
  styleUrls: ['./billing-step4.component.scss']
})
export class BillingStep4Component implements OnInit {
  data1: any = {};
  data2: any = {};
  data3: any = {};
  data: any = {};
  getputdata: any = {};
  editId;
  public model: any = {};
  public SingleRecurrence = 1;
  public TransferRecurrence = 1;
  constructor(
    private router: Router,
    private service1: BillingServiceStep1,
    private service2: BillingServiceStep2,
    private service3: BillingServiceStep3,
    private service4: BillingServiceCall,
    private stepTrack: StepperComponent
  ) {}
  ngOnInit() {
    this.model = {
      EtherValue: '',
      SingleETH: '',
      TransferETH: '',
      USDValue: '',
      TotalUSD: ''
    };
    this.data1 = this.service1.model;
    this.data2 = this.service2.model;
    this.data3 = this.service3.model;
    this.editId = localStorage.getItem('editId');
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      title: this.data2.billingModelName,
      description: this.data2.billModelDes,
      amount: this.data3.amount,
      initialPaymentAmount: 0,
      trialPeriod: 0,
      currency: this.data3.rupees,
      numberOfPayments: 1,
      typeID: 2,
      frequency: 1,
      networkID: 1,
      automatedCashOut: true,
      cashOutFrequency: 1
    };
    this.data = data;
    this.service4.gasusdvalue().subscribe(result => {
      this.model.USDValue = result.data.USD;
    });
    this.service4.gasuseddata().subscribe(result => {
      let gasused = result.data;
      this.service4.gasvalueCalcualtion().subscribe(result => {
        let cal = result.res.gasprice * gasused * 2;
        this.model.EtherValue = cal.toFixed(5).replace(/0+$/, '');
        let sample = this.model.EtherValue * this.SingleRecurrence;
        let data = this.model.EtherValue * this.TransferRecurrence;
        this.model.SingleETH = sample.toFixed(5).replace(/0+$/, '');
        this.model.TransferETH = data.toFixed(5).replace(/0+$/, '');
        let Total = parseFloat(this.model.SingleETH) + parseFloat(this.model.TransferETH);
        this.model.TotalETH = parseFloat(Total.toFixed(5).replace(/0+$/, ''));
        let USD = this.model.TotalETH * this.model.USDValue;
        this.model.TotalUSD = parseFloat(USD.toFixed(5).replace(/0+$/, ''));
        this.service4.setValues(this.model);
      });
    });
  }

  publish() {
    if (this.editId) {
      this.Updateput();
    } else {
      this.service4.billingPost(this.data).subscribe(result => {
        if (result.success == true) {
          localStorage.setItem('publishId', result.data.id);
          this.router.navigate(['./billing/billingmodeloverview']);
        }
      });
    }
  }

  onBack() {
    this.stepTrack.onBackStep3();
    this.router.navigate(['pullpayments/single/step3']);
  }
  Updateput() {
    this.service4.Updateput(this.editId, this.getputdata).subscribe(result => {
      localStorage.removeItem('editId');
      localStorage.setItem('publishId', result.data.id);
      this.router.navigate(['./billing/billingmodeloverview']);
    });
  }
  onPublish() {
    this.publish();
  }
}
