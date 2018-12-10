import { Component, OnInit } from '@angular/core';
import { BillingServiceStep1 } from '../../billing-step1/billing-step1.service';
import { BillingServiceStep2 } from '../../billing-step2/billing-step2.service';
import { BillingServiceStep3 } from '../../billing-step3/billing-step3.service';
import { BillingServiceCall } from '../billing-step4.service';
import { Router } from '@angular/router';
import { JsonpCallbackContext } from '@angular/common/http/src/jsonp';
import { StepperComponent } from '@app/billing/stepper/stepper.component';
import Web3 from 'web3';
var web3 = new Web3();

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
  getputdata: any = {};
  editId;
  public model: any = {};
  public transcationoption: any;
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
      transactions: '',
      initialRecurrence: 1,
      initialETH: '',
      initialcost: '',
      Recurrence: '',
      RecurrenceETH: '',
      PullRecurrence: 1,
      PullRecurrencecost: '',
      TotalETH: '',
      USDValue: '',
      TotalUSD: ''
    };
    this.transcationoption = [
      {
        id: 1,
        label: 'Once at the end of contract',
        value: 0
      },
      {
        id: 2,
        label: 'On every billing cycle',
        value: 1
      }
    ];
    this.model.transactions = this.transcationoption[0].label;
    this.Step1data = this.service1.model;
    this.Step2data = this.service2.model;
    this.Step3data = this.service3.model;
    this.editId = localStorage.getItem('editId');
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      title: this.Step2data.productName,
      description: this.Step2data.billModelDes,
      amount: this.Step3data.Periodprice,
      initialPaymentAmount: this.Step3data.price,
      trialPeriod: 1,
      currency: this.Step3data.Currency,
      numberOfPayments: this.Step3data.Recurringdays,
      typeID: 6,
      frequency: this.Step3data.daycount,
      networkID: 3,
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
        let double = result.res.gasprice * gasused * 2;
        //let data = web3.fromWei(double, 'ether');
        this.model.initialETH = double.toFixed(20).replace(/0+$/, '');
        this.model.initialcost = this.model.initialETH;
        let sample = this.model.initialETH * this.Step3data.Recurringdays;
        this.model.RecurrenceETH = sample.toFixed(20).replace(/0+$/, '');
        let cost = this.model.PullRecurrence * this.model.initialETH;
        this.model.PullRecurrencecost = cost.toFixed(20).replace(/0+$/, '');
        let Total =
          parseFloat(this.model.RecurrenceETH) +
          parseFloat(this.model.initialcost) +
          parseFloat(this.model.PullRecurrencecost);
        this.model.TotalETH = Total.toFixed(20).replace(/0+$/, '');
        let USD = this.model.TotalETH * this.model.USDValue;
        this.model.TotalUSD = parseFloat(USD.toFixed(20).replace(/0+$/, ''));
      });
    });
    this.model.Recurrence = this.Step3data.Recurringdays;
    this.service4.setValues(this.model);
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
    this.router.navigate(['pullpayments/hybrid/step3']);
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
  handleChangetransactions(data) {
    if (data.value == 'At the end of contract') {
      this.model.PullRecurrence = 1;
      let cost = this.model.PullRecurrence * this.model.initialETH;
      this.model.PullRecurrencecost = cost.toFixed(20).replace(/0+$/, '');
      let Total =
        parseFloat(this.model.RecurrenceETH) +
        parseFloat(this.model.initialcost) +
        parseFloat(this.model.PullRecurrencecost);
      this.model.TotalETH = Total.toFixed(20).replace(/0+$/, '');
      this.service4.setValues(this.model);
    } else {
      this.model.PullRecurrence = this.Step3data.Recurringdays;
      let cost = this.model.PullRecurrence * this.model.initialETH;
      this.model.PullRecurrencecost = cost.toFixed(20).replace(/0+$/, '');
      let Total =
        parseFloat(this.model.RecurrenceETH) +
        parseFloat(this.model.initialcost) +
        parseFloat(this.model.PullRecurrencecost);
      this.model.TotalETH = Total.toFixed(20).replace(/0+$/, '');
      this.service4.setValues(this.model);
    }
  }
}
