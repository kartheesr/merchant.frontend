import { Component, OnInit, Input } from '@angular/core';
import { BillingServiceStep1 } from '../billing-step1/billing-step1.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  data1: string = '';
  titleOfPayment: string = '';
  title1: boolean = true;
  title2: boolean = false;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  constructor(private service1: BillingServiceStep1, private route: ActivatedRoute, private router: Router) {}
  onBackStep1() {
    this.step2 = false;
    this.title1 = true;
    this.title2 = false;
  }
  onBackStep2() {
    this.step3 = false;
  }
  onBackStep3() {
    this.step4 = false;
  }
  onStep2(title: string) {
    this.title1 = false;
    this.title2 = true;
    this.titleOfPayment = title;
    this.step2 = true;
  }
  onStep3() {
    this.step3 = true;
  }
  onStep4() {
    this.step4 = true;
  }
  ngOnInit() {
    if (this.data1 == '') {
      this.title1 = true;
    } else if (this.data1 != '') {
      this.title2 = true;
    }
  }
  handleclosebtn() {
    this.router.navigate(['/billing']);
  }
}
