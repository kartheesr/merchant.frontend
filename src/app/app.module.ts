import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from '@app/home/home.module';

import { ShellModule } from '@app/shell/shell.module';
import { AboutModule } from '@app/about/about.module';
import { LoginModule } from '@app/login/login.module';
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';

import { AuthenticationService } from '@app/services/authentication.service';
import { AlertModalService } from '@app/services/alert-modal.service';
import { ChangePasswordService } from '@app/services/change-password.service';
import { DashboardModule } from '@app/dashboard/dashboard.module';
import { BillingModule } from '@app/billing/billing.module';
import { BillingStep2Component } from './billing/billing-step2/billing-step2.component';
import { BillingStep1Component } from './billing/billing-step1/billing-step1.component';
import { BillingStep3Component } from './billing/billing-step3/billing-step3.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BillingRecurringStep3Component } from './billing/billing-step3/billing-recurring-step3/billing-recurring-step3.component';
import { currencyPipe } from '@app/currency.pipe';
import { MainPipe } from '@app/main-pipe.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BillingHybirdStep4Component } from './billing/billing-step4/billing-hybird-step4/billing-hybird-step4.component';
import { BillingRecurringStep4Component } from './billing/billing-step4/billing-recurring-step4/billing-recurring-step4.component';
import { CustomFormsModule } from 'ng2-validation';
import { BillingHybridStep3Component } from './billing/billing-step3/billing-hybrid-step3/billing-hybrid-step3.component';
import { BlockCopyPasteDirective } from '@app/block-copy-paste.directive';
import { ProductComponent } from './product/product.component';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    DashboardModule,
    BillingModule,
    AboutModule,
    LoginModule,
    MainPipe,
    NgxQRCodeModule,
    CustomFormsModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [
    AppComponent,
    BillingStep2Component,
    BillingStep1Component,
    BillingStep3Component,
    BillingRecurringStep3Component,
    BillingRecurringStep4Component,
    BillingHybridStep3Component,
    BillingHybirdStep4Component,
    BlockCopyPasteDirective,
    ProductComponent
  ],
  providers: [
    AuthenticationService,
    AlertModalService,
    ChangePasswordService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
