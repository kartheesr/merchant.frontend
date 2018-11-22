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
  Stepcount1: any = 1;
  Stepcount2: any = 2;
  Stepcount3: any = 3;
  Stepcount4: any = 4;
  constructor(private service1: BillingServiceStep1, private route: ActivatedRoute, private router: Router) {}
  onBackStep1() {
    this.step2 = false;
    this.title1 = true;
    this.title2 = false;
    this.Stepcount1 = 1;
  }
  onBackStep2() {
    this.step3 = false;
    this.Stepcount2 = 2;
  }
  onBackStep3() {
    this.step4 = false;
    this.Stepcount3 = 3;
  }
  onStep2(title: string) {
    this.title1 = false;
    this.title2 = true;
    this.titleOfPayment = title;
    this.step2 = true;
    this.Stepcount1 = `<img src="assets/images/Complete.svg"/>`;
  }
  onStep3() {
    this.step3 = true;
    this.Stepcount2 = `<img src="assets/images/Complete.svg"/>`;
  }
  onStep4() {
    this.step4 = true;
    this.Stepcount3 = `<img src="assets/images/Complete.svg"/>`;
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
