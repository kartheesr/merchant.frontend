import { Component, OnInit } from '@angular/core';
import { BillingServiceStep1 } from '../../billing-step1/billing-step1.service';
import { BillingServiceStep2 } from '../../billing-step2/billing-step2.service';
import { BillingServiceStep3 } from '../../billing-step3/billing-step3.service';
import { BillingServiceCall } from '../billing-step4.service';
import { Router, Event } from '@angular/router';
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
  public model: any = {};
  public transcationoption: any;
  public disabledBtn: boolean = false;
  public automatedCashOut: boolean = false;
  public showNoOfRecurrence: boolean = false;
  public showInputRecurrence: boolean = false;
  public showTable: boolean = true;
  public recurrence;
  constructor(
    private router: Router,
    private service1: BillingServiceStep1,
    private service2: BillingServiceStep2,
    private service3: BillingServiceStep3,
    private service4: BillingServiceCall,
    private stepTrack: StepperComponent
  ) {
    router.events.subscribe((event: Event) => {
      if (location.hash === '#/pullpayments/hybrid/step3') {
        this.stepTrack.onBackStep3();
      }
    });
  }

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
      Recurringdays: '',
      TotalETH: '',
      USDValue: '',
      TotalUSD: '',
      Transfergas: '',
      recurrencegas: ''
    };
    this.recurrence;
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

    this.Step1data = this.service1.model;
    this.Step2data = this.service2.model;
    this.Step3data = this.service3.model;
    console.log(this.Step3data);
    if (this.Step3data.Recurringdays == 'indefinite') {
      this.model.transactions = this.transcationoption[0].label;
      this.showInputRecurrence = true;
      this.showTable = false;
    } else {
      this.model.transactions = this.transcationoption[1].label;
      this.showInputRecurrence = false;
      this.showTable = true;
    }
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      title: this.Step2data.billingModelName,
      description: this.Step2data.billModelDes,
      amount: this.Step3data.Periodprice,
      initialPaymentAmount: this.Step3data.price,
      trialPeriod: this.Step3data.billingdaycount,
      currency: this.Step3data.Currency,
      numberOfPayments: this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays,
      typeID: 6,
      frequency: this.Step3data.daycount,
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
        let valUSD = this.model.USDValue * this.model.recurrencegas;
        this.model.RecurrenceUSD = parseFloat(valUSD.toFixed(2).replace(/0+$/, ''));
        setTimeout(() => {
          this.gasValueCalculation();
        }, 3000);
      });
    });
    this.model.Recurrence = this.Step3data.Recurringdays;
    this.service4.setValues(this.model);
  }
  publish() {
    this.service4.billingPost(this.data).subscribe(result => {
      console.log('hybird', result);
      if (result.success == true) {
        localStorage.setItem('publishId', result.data.id);
        this.router.navigate(['./billing/billingmodeloverview']);
      }
    });
  }
  onBack() {
    this.stepTrack.onBackStep3();
    this.router.navigate(['pullpayments/hybrid/step3']);
  }

  onPublish() {
    this.publish();
  }
  gasValueCalculation() {
    this.service4.gastransferpull().subscribe(result => {
      let gas = result.data * 0.00000001;
      this.model.Transfergas = gas.toFixed(5).replace(/0+$/, '');
      let gasUSD = this.model.USDValue * this.model.Transfergas;
      this.model.TransferUSD = parseFloat(gasUSD.toFixed(2).replace(/0+$/, ''));
      let val = this.model.initialRecurrence * this.model.recurrencegas;
      this.model.initialETH = val.toFixed(5).replace(/0+$/, '');
      let valUSD = this.model.initialRecurrence * this.model.RecurrenceUSD;
      this.model.initialUSD = parseFloat(valUSD.toFixed(2).replace(/0+$/, ''));
      let sample =
        this.model.recurrencegas *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETH = sample.toFixed(5).replace(/0+$/, '');
      let sampleUSD =
        this.model.RecurrenceUSD *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETHUSD = parseFloat(sampleUSD.toFixed(2).replace(/0+$/, ''));
      let cost = this.model.PullRecurrence * this.model.Transfergas;
      this.model.PullRecurrencecost = cost.toFixed(5).replace(/0+$/, '');
      let costUSD = this.model.PullRecurrence * this.model.TransferUSD;
      this.model.PullRecurrencecostUSD = parseFloat(costUSD.toFixed(2).replace(/0+$/, ''));
      let Total =
        parseFloat(this.model.RecurrenceETH) +
        parseFloat(this.model.initialETH) +
        parseFloat(this.model.PullRecurrencecost);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.initialUSD + this.model.RecurrenceETHUSD + this.model.PullRecurrencecostUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
    });
  }
  handleChangetransactions(data) {
    if (data.value == 'Once at the end of contract') {
      this.disabledBtn = false;
      this.data.automatedCashOut = false;
      this.data.cashOutFrequency = 0;
      this.model.PullRecurrence = 1;
      let val = this.model.initialRecurrence * this.model.recurrencegas;
      this.model.initialETH = val.toFixed(5).replace(/0+$/, '');
      let valUSD = this.model.initialRecurrence * this.model.RecurrenceUSD;
      this.model.initialUSD = parseFloat(valUSD.toFixed(2).replace(/0+$/, ''));
      let sample =
        this.model.recurrencegas *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETH = sample.toFixed(5).replace(/0+$/, '');
      let sampleUSD =
        this.model.RecurrenceUSD *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETHUSD = parseFloat(sampleUSD.toFixed(2).replace(/0+$/, ''));
      let cost = this.model.PullRecurrence * this.model.Transfergas;
      this.model.PullRecurrencecost = cost.toFixed(5).replace(/0+$/, '');
      let costUSD = this.model.PullRecurrence * this.model.TransferUSD;
      this.model.PullRecurrencecostUSD = parseFloat(costUSD.toFixed(2).replace(/0+$/, ''));
      let Total =
        parseFloat(this.model.RecurrenceETH) +
        parseFloat(this.model.initialETH) +
        parseFloat(this.model.PullRecurrencecost);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.initialUSD + this.model.RecurrenceETHUSD + this.model.PullRecurrencecostUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
      this.service4.setValues(this.model);
    } else if (data.value == 'On every billing cycle') {
      this.disabledBtn = false;
      this.data.automatedCashOut = true;
      this.data.cashOutFrequency = 1;
      this.model.PullRecurrence =
        this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays;
      let val = this.model.initialRecurrence * this.model.recurrencegas;
      this.model.initialETH = val.toFixed(5).replace(/0+$/, '');
      let valUSD = this.model.initialRecurrence * this.model.RecurrenceUSD;
      this.model.initialUSD = parseFloat(valUSD.toFixed(2).replace(/0+$/, ''));
      let sample =
        this.model.recurrencegas *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETH = sample.toFixed(5).replace(/0+$/, '');
      let sampleUSD =
        this.model.RecurrenceUSD *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETHUSD = parseFloat(sampleUSD.toFixed(2).replace(/0+$/, ''));
      let cost = this.model.PullRecurrence * this.model.Transfergas;
      this.model.PullRecurrencecost = cost.toFixed(5).replace(/0+$/, '');
      let costUSD = this.model.PullRecurrence * this.model.TransferUSD;
      this.model.PullRecurrencecostUSD = parseFloat(costUSD.toFixed(2).replace(/0+$/, ''));
      let Total =
        parseFloat(this.model.RecurrenceETH) +
        parseFloat(this.model.initialETH) +
        parseFloat(this.model.PullRecurrencecost);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.initialUSD + this.model.RecurrenceETHUSD + this.model.PullRecurrencecostUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
      this.service4.setValues(this.model);
    } else {
      this.disabledBtn = true;
      this.model.PullRecurrence = 1;
      let val = this.model.initialRecurrence * this.model.recurrencegas;
      this.model.initialETH = val.toFixed(5).replace(/0+$/, '');
      let valUSD = this.model.initialRecurrence * this.model.RecurrenceUSD;
      this.model.initialUSD = parseFloat(valUSD.toFixed(2).replace(/0+$/, ''));
      let sample =
        this.model.recurrencegas *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETH = sample.toFixed(5).replace(/0+$/, '');
      let sampleUSD =
        this.model.RecurrenceUSD *
        (this.Step3data.Recurringdays == 'indefinite' ? this.recurrence : this.Step3data.Recurringdays);
      this.model.RecurrenceETHUSD = parseFloat(sampleUSD.toFixed(2).replace(/0+$/, ''));
      let cost = this.model.PullRecurrence * this.model.Transfergas;
      this.model.PullRecurrencecost = cost.toFixed(5).replace(/0+$/, '');
      let costUSD = this.model.PullRecurrence * this.model.TransferUSD;
      this.model.PullRecurrencecostUSD = parseFloat(costUSD.toFixed(2).replace(/0+$/, ''));
      let Total =
        parseFloat(this.model.RecurrenceETH) +
        parseFloat(this.model.initialETH) +
        parseFloat(this.model.PullRecurrencecost);
      this.model.TotalETH = Total.toFixed(5).replace(/0+$/, '');
      let USD = this.model.initialUSD + this.model.RecurrenceETHUSD + this.model.PullRecurrencecostUSD;
      this.model.TotalUSD = parseFloat(USD.toFixed(2).replace(/0+$/, ''));
    }
  }

  noOfRecurrence() {
    console.log(this.recurrence);
    this.showNoOfRecurrence = true;
    this.showInputRecurrence = false;
    this.showTable = true;
  }
}
