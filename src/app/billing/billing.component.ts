import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { I18nService } from '@app/core';
import { finalize } from 'rxjs/operators';
import { BillingService } from '@app/billing/billing.service';
import { currencyPipe } from '@app/billing/currency.pipe';
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [CurrencyPipe]
})
export class BillingComponent implements OnInit {
  public sample = [];
  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;
  submitted = false;
  show1: boolean;
  show2: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    // private authenticationService: AuthenticationService,
    private billingService: BillingService
  ) // public modal: NgbActiveModal
  {
    //this.createForm();
  }

  ngOnInit() {
    this.show1 = true;
    this.Getpull();
  }

  Getpull() {
    this.billingService.Getpull().subscribe(
      result => {
        if (result.success == true) {
          console.log('success', result);
          this.show1 = false;
          this.show2 = true;
          this.sample = result.data;
          // this.route.queryParams.subscribe(params =>
          //   this.router.navigate([params.redirect || '/billing/step2'], { replaceUrl: true })
          // );
        } else {
          this.show1 = true;
          this.show2 = false;
        }
      }
      // error => {
      //   console.log('errorsuccesserror1', error);
      //   if (error && error.error['message']) {
      //     this.error = error.error['message'];
      //   } else {
      //     console.log("errorsuccesserror2", error);
      //   }
      // }
    );
  }
}