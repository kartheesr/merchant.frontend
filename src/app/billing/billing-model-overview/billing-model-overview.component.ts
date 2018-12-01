import { Component, OnInit, Inject } from '@angular/core';
import { BillingService } from '../billing.service';
import { CurrencyPipe } from '@angular/common';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { DOCUMENT } from '@angular/common';
import { BillingServiceCall } from '../billing-step4/billing-step4.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '@app/app.constants';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-billing-model-overview',
  templateUrl: './billing-model-overview.component.html',
  styleUrls: ['./billing-model-overview.component.scss'],
  providers: [BillingService, CurrencyPipe, DashboardService, NgbActiveModal]
})
export class BillingModelOverviewComponent implements OnInit {
  public id;
  public single = false;
  public recurring = false;
  public singleRecurring = false;
  public amount;
  public currency;
  public description;
  public title;
  public subscribers;
  public frequency;
  public pmaAmount;
  public transactionHistorArray;
  public data = '';
  public EtherValue;
  value;
  model;
  typeID;

  constructor(
    public service: BillingService,
    @Inject(DOCUMENT) private document: any,
    public dashboardService: DashboardService,
    public overviewdata: BillingServiceCall,
    public route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.model = {
      data: ''
    };
    this.id = localStorage.getItem('publishId');
    this.dashboardService.getTransactionHistory().subscribe(result => {
      this.transactionHistorArray = result.data;
    });
    if (this.route.snapshot.queryParamMap.get('pullPayId')) {
      this.id = this.route.snapshot.queryParamMap.get('pullPayId');
    } else {
      this.id = localStorage.getItem('publishId');
    }
    this.service.getPullPayment().subscribe(result => {
      if (result.success == true) {
        this.pmaAmount = result.data.balance;
      }
    });

    this.service.Getpull().subscribe(result => {
      if (result.success == true) {
        this.subscribers = result.data.length;
      }
    });
    this.service.getByIdBillingModelqr(this.id).subscribe(result => {
      this.value = result.data.pullPaymentModelURL;
      setTimeout(() => {
        this.base64();
      }, 200);
    });

    this.service.getByIdBillingModel(this.id).subscribe(result => {
      localStorage.removeItem('publishId');

      if (result.data.typeID == 1) {
        this.overviewdata.gasvalueCalcualtion().subscribe(result => {
          let cal = result.res.gasprice * 2;
          this.EtherValue = cal.toFixed(20).replace(/0+$/, '');
        });
        this.data = this.overviewdata.model;
        this.description = 'Single';
        this.title = result.data.title;
        this.amount = result.data.amount / 100;
        this.currency = result.data.currency;

        this.single = true;
        this.recurring = false;
        this.singleRecurring = false;
      } else if (result.data.typeID == 2) {
        this.overviewdata.gasvalueCalcualtion().subscribe(result => {
          this.EtherValue = result.res.gasprice;
        });
        this.data = this.overviewdata.model ? this.overviewdata.model : '';
        this.description = 'Recurring';
        this.title = result.data.title;
        this.amount = result.data.amount / 100;
        this.currency = result.data.currency;
        this.frequency = result.data.frequency;

        this.recurring = true;
        this.single = false;
        this.singleRecurring = false;
      } else {
        this.overviewdata.gasvalueCalcualtion().subscribe(result => {
          let cal = result.res.gasprice * 2;
          this.EtherValue = cal.toFixed(20).replace(/0+$/, '');
        });
        this.data = this.overviewdata.model ? this.overviewdata.model : '';
        this.description = 'Single + Recurring';
        this.title = result.data.title;
        this.amount = result.data.amount / 100;
        this.currency = result.data.currency;
        this.frequency = result.data.frequency;

        this.singleRecurring = true;
        this.single = false;
        this.recurring = false;
      }
    });
  }

  base64() {
    var str = document.getElementById('qr-value').innerHTML;
    var res = str.split(' ');
    var res1 = res[2];
    var final = res1.split('>');
    var tocpytxt = final[0];
    var yyy = tocpytxt.split(',');
    var newyear = yyy[1].split('"');
    this.model.data = str;
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  txhash(data) {
    window.open('https://etherscan.io/tx/${data}', '_blank');
  }

  open(content) {
    this.modalService.open(content);
  }
  openCopyButton(pumacopySingle) {
    this.modalService.open(pumacopySingle);
  }
}
