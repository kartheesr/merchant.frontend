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
  title1: boolean = false;
  title2: boolean = false;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  constructor(private service1: BillingServiceStep1, private route: ActivatedRoute) {}
  onBackStep1() {
    this.step2 = false;
  }
  onBackStep2() {
    this.step3 = false;
  }
  onBackStep3() {
    this.step4 = false;
  }
  onStep2() {
    this.step2 = true;
  }
  onStep3() {
    this.step3 = true;
  }
  onStep4() {
    this.step4 = true;
  }
  ngOnInit() {
    console.log('Thisssd--->', this.data1);
    console.log('Route path-->', this.route);
    console.log('Route path-->', this.route.url);
    if (this.data1 == '') {
      this.title1 = true;
    } else if (this.data1 != '') {
      this.title2 = true;
    }
  }
}
