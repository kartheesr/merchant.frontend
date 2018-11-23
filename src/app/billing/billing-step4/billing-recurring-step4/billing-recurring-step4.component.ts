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
  constructor(
    private router: Router,
    private service1: BillingServiceStep1,
    private service2: BillingServiceStep2,
    private service3: BillingServiceStep3,
    private service4: BillingServiceCall,
    private stepTrack: StepperComponent
  ) {
    this.transcationoption = [
      {
        id: 1,
        label: 'At the end of contract',
        value: 0
      },
      {
        id: 2,
        label: 'On every transaction',
        value: 1
      }
    ];
  }

  ngOnInit() {
    this.model = {
      EtherValue: '',
      Recurrence: '',
      TotalCost: '',
      transactions: '',
      TransRecurrence: 1,
      TotalcostRecuurence: '',
      TotalETH: ''
    };
    this.model.transactions = this.transcationoption[0].label;
    this.data1 = this.service1.model;
    this.data2 = this.service2.model;
    this.data3 = this.service3.model;
    this.editId = localStorage.getItem('editId');
    localStorage.removeItem('newForm');
    let putdata = {
      id: this.editId,
      title: this.data2.billingModelName,
      description: this.data2.billModelDes,
      amount: this.data3.amount,
      initialPaymentAmount: 0,
      trialPeriod: 0,
      currency: this.data3.rupees,
      numberOfPayments: 1,
      typeID: 2,
      frequency: this.data3.No2,
      networkID: 1,
      automatedCashOut: true,
      cashOutFrequency: 1
    };
    this.getputdata = putdata;
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
      frequency: this.data3.No2,
      networkID: 1,
      automatedCashOut: true,
      cashOutFrequency: 1
    };
    this.data = data;
    this.service4.gasvalueCalcualtion().subscribe(result => {
      let data = web3.fromWei(result.result, 'ether');
      this.model.EtherValue = data;
      let sample = this.model.EtherValue * this.data3.No2;
      this.model.TotalCost = sample.toFixed(20).replace(/0+$/, '');
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.EtherValue);
      this.model.TotalETH = Total.toFixed(20).replace(/0+$/, '');
      this.model.TotalcostRecuurence = this.model.EtherValue;
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
    if (data.value == 'At the end of contract') {
      this.model.TransRecurrence = 1;
      this.model.TotalcostRecuurence = this.model.EtherValue;
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(20).replace(/0+$/, '');
      this.service4.setValues(this.model);
    } else {
      this.model.TransRecurrence = this.data3.No2;
      let total = parseFloat(this.model.TransRecurrence) * parseFloat(this.model.EtherValue);
      this.model.TotalcostRecuurence = total.toFixed(20).replace(/0+$/, '');
      let Total1 = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total1.toFixed(20).replace(/0+$/, '');
      this.service4.setValues(this.model);
    }
  }
}
