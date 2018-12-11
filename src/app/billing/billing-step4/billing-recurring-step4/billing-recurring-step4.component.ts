import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillingServiceStep1 } from '../../billing-step1/billing-step1.service';
import { BillingServiceStep2 } from '../../billing-step2/billing-step2.service';
import { BillingServiceStep3 } from '../../billing-step3/billing-step3.service';
import { BillingServiceCall } from '../../billing-step4/billing-step4.service';
import { StepperComponent } from '@app/billing/stepper/stepper.component';
import Web3 from 'web3';
var web3 = new Web3();

@Component({
  selector: 'app-billing-recurring-step4',
  templateUrl: './billing-recurring-step4.component.html',
  styleUrls: ['./billing-recurring-step4.component.scss']
})
export class BillingRecurringStep4Component implements OnInit {
  data1: any = {};
  data2: any = {};
  data3: any = {};
  data: any = {};
  getputdata: any = {};
  editId;
  public model: any = {};
  public transcationoption: any;
  public disabledBtn: boolean = true;
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
      Recurrence: '',
      TotalCost: '',
      transactions: '',
      TransRecurrence: 1,
      TotalcostRecuurence: '',
      TotalETH: '',
      USDValue: '',
      TotalUSD: ''
    };
    this.transcationoption = [
      {
        id: 1,
        label: 'Choose frequency',
        value: 0
      },
      {
        id: 2,
        label: 'Once at the end of contract',
        value: 1
      },
      {
        id: 3,
        label: 'On every billing cycle',
        value: 2
      }
    ];
    this.model.transactions = this.transcationoption[0].label;
    this.data1 = this.service1.model;
    this.data2 = this.service2.model;
    this.data3 = this.service3.model;
    this.editId = localStorage.getItem('editId');
    localStorage.removeItem('newForm');
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      title: this.data2.productName,
      description: this.data2.billModelDes,
      amount: this.data3.amount,
      initialPaymentAmount: 0,
      trialPeriod: parseInt(this.data3.trialdaycount),
      currency: this.data3.rupees,
      numberOfPayments: this.data3.No2,
      typeID: this.data3.typeid,
      frequency: this.data3.daycount,
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
        //let data = web3.fromWei(result.result, 'ether');
        let cal = result.res.gasprice * gasused;
        this.model.EtherValue = cal.toFixed(5).replace(/0+$/, '');
        let sample = this.model.EtherValue * this.data3.No2;
        this.model.TotalCost = sample.toFixed(5).replace(/0+$/, '');
        let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.EtherValue);
        this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
        this.model.TotalcostRecuurence = this.model.EtherValue;
        let USD = this.model.TotalETH * this.model.USDValue;
        this.model.TotalUSD = parseFloat(USD.toFixed(5).replace(/0+$/, ''));
      });
    });
    this.model.Recurrence = this.data3.No2;
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
    this.router.navigate(['pullpayments/recurring/step3']);
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
    if (data.value == 'Once at the end of contract') {
      this.disabledBtn = false;
      this.model.TransRecurrence = 1;
      let cal = this.model.EtherValue * this.model.TransRecurrence;
      this.model.TotalcostRecuurence = cal.toFixed(5).replace(/0+$/, '');
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      this.service4.setValues(this.model);
    } else if (data.value == 'On every billing cycle') {
      this.disabledBtn = false;
      this.model.TransRecurrence = this.data3.No2;
      let total = parseFloat(this.model.TransRecurrence) * parseFloat(this.model.EtherValue);
      this.model.TotalcostRecuurence = total.toFixed(5).replace(/0+$/, '');
      let Total1 = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total1.toFixed(5).replace(/0+$/, '');
      this.service4.setValues(this.model);
    } else {
      this.disabledBtn = true;
      this.model.TransRecurrence = 1;
      let cal = this.model.EtherValue * this.model.TransRecurrence;
      this.model.TotalcostRecuurence = cal.toFixed(5).replace(/0+$/, '');
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
    }
  }
}
