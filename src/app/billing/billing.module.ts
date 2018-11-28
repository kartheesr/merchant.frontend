import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingRoutingModule } from '@app/billing/billing-routing.module';
import { BillingComponent } from '@app/billing/billing.component';
import { BillingStep4Component } from './billing-step4/billing-step4.component';
import { currencyPipe } from '@app/billing/currency.pipe';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {
  BillingModelOverviewComponent,
  enlargeQrCode
} from '@app/billing/billing-model-overview/billing-model-overview.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { StepperComponent } from './stepper/stepper.component';

// import { BillingHybirdStep4Component } from '@app/billing/billing-step4/billing-hybird-step4/billing-hybird-step4.component';
@NgModule({
  declarations: [
    BillingComponent,
    BillingStep4Component,
    currencyPipe,
    BillingModelOverviewComponent,
    StepperComponent,
    enlargeQrCode
    // BillingHybirdStep4Component
  ],
  imports: [CommonModule, BillingRoutingModule, FormsModule, NgxQRCodeModule],
  providers: [currencyPipe],
  entryComponents: [enlargeQrCode]
})
export class BillingModule {}
