import { Component, OnInit, NgModule, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BillingServiceStep1 } from './billing-step1.service';
import { BillingService } from '@app/billing/billing.service';

import { Title } from '@angular/platform-browser';
import { StepperComponent } from '../stepper/stepper.component';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '@app/dashboard/dashboard.service';
@Component({
  selector: 'app-billing-step1',
  templateUrl: './billing-step1.component.html',
  styleUrls: ['./billing-step1.component.scss']
})
export class BillingStep1Component implements OnInit {
  model: any = {};
  showerror: boolean;
  typeID;
  Typeid1: any = {};
  newForm;
  button1: boolean = false;
  button2: boolean = false;
  button3: boolean = false;
  disabled: boolean = true;
  public disabledBtn = false;
  public ProductNamelist: any;
  public ProductName: any;
  public id;
  public value;
  public gasBalance;
  public treasuryAddress;
  @Output() topic = new EventEmitter<string>();
  constructor(
    private router: Router,
    private service: BillingServiceStep1,
    private billingService: BillingService,
    private step1: StepperComponent,
    private modalService: NgbModal,
    private dashboardService: DashboardService
  ) {}
  ngOnInit() {
    this.ProductNamelist = [
      {
        id: 1,
        label: 'Choose frequency',
        value: 0
      }
    ];
    this.model.ProductName = this.ProductNamelist[0].label;
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    }
    this.dashboardService.gasvalueCalcualtion().subscribe(res => {
      this.gasBalance = res.balance; // GAS VALUE
      // if (this.gasBalance > 0.01) {
      //   this.disabledBtn = false;
      // }
      // else {
      //   this.disabledBtn = true;
      // }
    });
    this.billingService.getQRCodeaddress().subscribe(result => {
      this.treasuryAddress = result.address; // TREASURY ADDRESS
    });
    setTimeout(() => {
      this.qrValue();
    }, 2000);
  }
  onSubmit(data) {
    if (!data.value.billing) {
      this.showerror = true;
    } else {
      this.step1.onStep2(this.model.billing);
      this.showerror = false;
      this.service.setValues(this.model);
      this.router.navigate(['/pullpayments/step2']);
    }
  }
  onChange(value) {
    if (value == 'Single') {
      this.button1 = true;
      this.disabled = false;
      this.button2 = false;
      this.button3 = false;
    } else if (value == 'Subscription') {
      this.button1 = false;
      this.disabled = false;
      this.button2 = true;
      this.button3 = false;
    } else if (value == 'Single + Subscription') {
      this.button1 = false;
      this.disabled = false;
      this.button2 = false;
      this.button3 = true;
    }
  }
  openpopup(QRPopup) {
    this.modalService.open(QRPopup);
  }
  qrValue() {
    this.dashboardService.getQRValue(this.gasBalance, this.treasuryAddress).subscribe(result => {
      this.value = JSON.stringify(result.data);
    });
  }
}
