import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillingServiceStep3 } from '../billing-step3.service';
import { StepperComponent } from '@app/billing/stepper/stepper.component';

@Component({
  selector: 'app-billing-recurring-step3',
  templateUrl: './billing-recurring-step3.component.html',
  styleUrls: ['./billing-recurring-step3.component.scss']
})
export class BillingRecurringStep3Component implements OnInit {
  public model;
  editId;
  newForm;
  public selectOption: any;
  public recurrenceOption = [];
  constructor(private router: Router, private service: BillingServiceStep3, private stepTrack: StepperComponent) {
    this.selectOption = [
      {
        id: 1,
        label: 'USD',
        value: 0
      },
      {
        id: 2,
        label: 'EUR',
        value: 1
      },
      {
        id: 3,
        label: 'GBP',
        value: 2
      },
      {
        id: 4,
        label: 'JPY',
        value: 4
      }
    ];
    this.recurrenceOption = [
      {
        id: 1,
        label: 'Days',
        value: 0
      },
      {
        id: 2,
        label: 'Weeks',
        value: 1
      },
      {
        id: 3,
        label: 'Years',
        value: 2
      }
    ];
  }

  ngOnInit() {
    this.model = {
      rupees: '',
      amount: '',
      No1: '',
      No2: '',
      No3: '',
      Period1: '',
      Period2: ''
    };
    this.model.Period2 = this.recurrenceOption[0].label;
    this.model.Period1 = this.recurrenceOption[0].label;
    this.model.rupees = this.selectOption[0].label;
    this.editId = localStorage.getItem('editId');
    this.newForm = localStorage.getItem('newForm');
    if (this.newForm) {
      this.model.billing = '';
    } else if (this.editId) {
      this.Updateget();
    }
  }
  onBack() {
    this.stepTrack.onBackStep2();
    this.router.navigate(['pullpayments/step2']);
  }
  Updateget() {
    this.service.Updateget(this.editId).subscribe(result => {
      if (result.success == true) {
        if (this.editId) {
          this.model.amount = result.data.amount;
          this.model.rupees = result.data.currency;
        }
      }
    });
  }
  onSubmit(data) {
    if (data.value) {
      this.stepTrack.onStep4();
      this.service.setValues(this.model);
      this.router.navigate(['pullpayments/recurring/step4']);
    }
  }
}
