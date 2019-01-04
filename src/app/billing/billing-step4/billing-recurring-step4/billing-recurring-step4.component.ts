import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
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
  public model: any = {};
  public recurrence;
  public transcationoption: any;
  public disabledBtn: boolean = true;
  public automatedCashOut: boolean = false;
  public showNoOfRecurrence: boolean = false;
  public showInputRecurrence: boolean = false;
  public showTable: boolean = true;
  constructor(
    private router: Router,
    private service1: BillingServiceStep1,
    private service2: BillingServiceStep2,
    private service3: BillingServiceStep3,
    private service4: BillingServiceCall,
    private stepTrack: StepperComponent
  ) {
    router.events.subscribe((event: Event) => {
      if (location.hash === '#/pullpayments/recurring/step3') {
        this.stepTrack.onBackStep3();
      }
    });
  }

  ngOnInit() {
    this.model = {
      EtherValue: '',
      Recurrence: '',
      TotalCost: '',
      transactions: '',
      TransRecurrence: 1,
      Transfergas: '',
      recurrencegas: '',
      TotalcostRecuurence: '',
      TotalETH: '',
      USDValue: '',
      TotalUSD: ''
    };

    this.transcationoption = [
      {
        id: 1,
        label: 'Choose custom frequency',
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

    this.data1 = this.service1.model;
    this.data2 = this.service2.model;
    this.data3 = this.service3.model;
    if (this.data3.No2 == 'indefinite') {
      this.model.transactions = this.transcationoption[0].label;
      this.showInputRecurrence = true;
      this.showTable = false;
    } else {
      this.model.transactions = this.transcationoption[1].label;
      this.showInputRecurrence = false;
      this.showTable = true;
    }
    console.log('this.data3', this.data3);
    localStorage.removeItem('newForm');
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      title: this.data2.billingModelName,
      description: this.data2.billModelDes,
      amount: this.data3.amount,
      initialPaymentAmount: 0,
      trialPeriod: parseInt(this.data3.trialdaycount),
      currency: this.data3.rupees,
      numberOfPayments: this.data3.No2,
      typeID: this.data3.typeid,
      frequency: this.data3.daycount,
      networkID: 3,
      automatedCashOut: this.automatedCashOut,
      cashOutFrequency: 0
    };
    this.data = data;
    this.service4.gasusdvalue().subscribe(result => {
      this.model.USDValue = result.data.USD;
      this.service4.gasrecurrence().subscribe(result => {
        let val = result.data * 0.00000001;
        this.model.recurrencegas = val.toFixed(5).replace(/0+$/, '');
        let valUSD = this.model.recurrencegas * this.model.USDValue;
        this.model.RecurrenceUSD = parseFloat(valUSD.toFixed(2).replace(/0+$/, ''));

        setTimeout(() => {
          this.gasValueCalculation();
        }, 3000);
      });
    });
    this.model.Recurrence = this.data3.No2;
    this.service4.setValues(this.model);
  }
  gasValueCalculation() {
    this.service4.gastransferpull().subscribe(result => {
      let gas = result.data * 0.00000001;
      this.model.Transfergas = gas.toFixed(5).replace(/0+$/, '');
      let gasUSD = this.model.Transfergas * this.model.USDValue;
      this.model.TransferUSD = parseFloat(gasUSD.toFixed(2).replace(/0+$/, ''));
      let sample = this.model.recurrencegas * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalCost = sample.toFixed(5).replace(/0+$/, '');
      let USDCost = this.model.RecurrenceUSD * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalUSDCost = parseFloat(USDCost.toFixed(2).replace(/0+$/, ''));
      this.model.TransRecurrence = 1;
      let data = parseFloat(this.model.Transfergas) * this.model.TransRecurrence;
      this.model.TotalcostRecuurence = data.toFixed(5).replace(/0+$/, '');
      let dataUSD = this.model.TransferUSD * this.model.TransRecurrence;
      this.model.TotalcostRecuurenceUSD = parseFloat(dataUSD.toFixed(2).replace(/0+$/, ''));
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.TotalUSDCost + this.model.TotalcostRecuurenceUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
    });
  }
  publish() {
    this.service4.billingPost(this.data).subscribe(result => {
      if (result.success == true) {
        localStorage.setItem('publishId', result.data.id);
        this.router.navigate(['./billing/billingmodeloverview']);
      }
    });
  }

  onBack() {
    this.stepTrack.onBackStep3();
    this.router.navigate(['pullpayments/recurring/step3']);
  }
  onPublish() {
    this.publish();
  }
  handleChangetransactions(data) {
    if (data.value == 'Once at the end of contract') {
      this.disabledBtn = false;
      this.data.automatedCashOut = false;
      this.data.cashOutFrequency = 0;
      let sample = this.model.recurrencegas * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalCost = sample.toFixed(5).replace(/0+$/, '');
      let USDCost = this.model.RecurrenceUSD * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalUSDCost = parseFloat(USDCost.toFixed(2).replace(/0+$/, ''));
      this.model.TransRecurrence = 1;
      let data = parseFloat(this.model.Transfergas) * this.model.TransRecurrence;
      this.model.TotalcostRecuurence = data.toFixed(5).replace(/0+$/, '');
      let dataUSD = this.model.TransferUSD * this.model.TransRecurrence;
      this.model.TotalcostRecuurenceUSD = parseFloat(dataUSD.toFixed(2).replace(/0+$/, ''));
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.TotalUSDCost + this.model.TotalcostRecuurenceUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
      this.service4.setValues(this.model);
    } else if (data.value == 'On every billing cycle') {
      this.disabledBtn = false;
      this.data.automatedCashOut = true;
      this.data.cashOutFrequency = 1;
      // this.model.TransRecurrence = this.data3.No2;
      let sample = this.model.recurrencegas * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalCost = sample.toFixed(5).replace(/0+$/, '');
      let USDCost = this.model.RecurrenceUSD * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalUSDCost = parseFloat(USDCost.toFixed(2).replace(/0+$/, ''));
      this.model.TransRecurrence = this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2;
      let data = parseFloat(this.model.Transfergas) * this.model.TransRecurrence;
      this.model.TotalcostRecuurence = data.toFixed(5).replace(/0+$/, '');
      let dataUSD = this.model.TransferUSD * this.model.TransRecurrence;
      this.model.TotalcostRecuurenceUSD = parseFloat(dataUSD.toFixed(2).replace(/0+$/, ''));
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.TotalUSDCost + this.model.TotalcostRecuurenceUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
      this.service4.setValues(this.model);
    } else {
      this.disabledBtn = true;
      let sample = this.model.recurrencegas * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalCost = sample.toFixed(5).replace(/0+$/, '');
      let USDCost = this.model.RecurrenceUSD * (this.data3.No2 == 'indefinite' ? this.recurrence : this.data3.No2);
      this.model.TotalUSDCost = parseFloat(USDCost.toFixed(2).replace(/0+$/, ''));
      this.model.TransRecurrence = 1;
      let data = parseFloat(this.model.Transfergas) * this.model.TransRecurrence;
      this.model.TotalcostRecuurence = data.toFixed(5).replace(/0+$/, '');
      let dataUSD = this.model.TransferUSD * this.model.TransRecurrence;
      this.model.TotalcostRecuurenceUSD = parseFloat(dataUSD.toFixed(2).replace(/0+$/, ''));
      let Total = parseFloat(this.model.TotalCost) + parseFloat(this.model.TotalcostRecuurence);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.TotalUSDCost + this.model.TotalcostRecuurenceUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
      this.service4.setValues(this.model);
    }
  }

  noOfRecurrence() {
    console.log(this.recurrence);
    this.showNoOfRecurrence = true;
    this.showInputRecurrence = false;
    this.showTable = true;
  }
}
