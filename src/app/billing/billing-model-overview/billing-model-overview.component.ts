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
    var str = document.querySelectorAll('#qr-value div img');
    this.model.data = document.getElementById('qr-value').innerHTML;
    var imgSrc = '';
    for (var i = 0; i < str.length; i++) {
      imgSrc = str[i].getAttribute('src');
    }
    this.model.qrSrc = imgSrc;
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

  copycontent() {
    var html;
    html =
      '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' +
      '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
      '<style>.modal.in .modal-dialog {-webkit-transform: translate(0,0) !important;-ms-transform: translate(0,0) !important;-o-transform: translate(0,0) !important;transform: translate(0,0) !important;background-color: #F8FAFE !important; padding: 15px !important;' +
      'border-radius: 4px !important; } .qr-image{margin-left: 200px; } .txt-box{ width: 80%; margin-left: 10px; } .modalTitle{ background-color: #F8FAFE } .data-info {   margin-left: 20px;   border: black;   border-width: 2px;   box-shadow: 0px 0.652639px 7.83167px rgba(0, 0, 0, 0.1); } .data-info {   th,   td {     text-align: left;     background-color: white;     font-size: 12px;     padding: 7px;     border-bottom: 1px solid #ddd;   }   tr {     padding: 10px; } label { margin: 0px; }} .bm-text { color: #1c67f5; font-size: 12px; }</style>' +
      '</head>' +
      '<body><div class="container"><img src="data:image/png;base64,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" data-toggle="modal" data-target="#myModal"/>   <div class="modal fade" id="myModal" role="dialog">     <div class="modal-dialog"> 	<div class="modalTitle"> <label>Contract details</label> </div>      <div class="modelSize2">     <div>       <div class="qr-image"> 	  <img src="data:image/png;base64,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"/>             </div>       <div class="int-box">         <input class="txt-box" type="text" #userinput [(ngModel)]="model.data" />' +
      '<img src="data:image/png;base64,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UmVhZHlxyWU8AAADImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0QTYwRUIxREU3MjcxMUU4OENGOUQxMDRCNTE3MTBBMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0QTYwRUIxRUU3MjcxMUU4OENGOUQxMDRCNTE3MTBBMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRBNjBFQjFCRTcyNzExRTg4Q0Y5RDEwNEI1MTcxMEEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRBNjBFQjFDRTcyNzExRTg4Q0Y5RDEwNEI1MTcxMEEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+poDK3gAABL1JREFUeNpiYIAAFhAODQ1lBtLMYBEtLS22/2iAm5tbHCQHlpi/ByEBFJMASbBi0SHBxIAFfP36FWzpb0ZGRkmYIFA1A1DTS4AAYgC5BOoaFgcHB7DrGKEWoQCsZhMvyAjEQiAPIYn9BwggkCAz0K4/DAQA0OmCTMBwYkYR9IfggtkY6jngYQcDyGGIDIDqxBmMjY1Z/xMBQIHPCA38X0S4WRwggBiQIx0a4SzowQ0PMp3i7/+JdAYDEx8XA9EAI0ZgQUd09P3fyMCwYC+mH5mIdwTDf1IUMzBY1RIdGiQ64/GrbycIqXry7j883bICc4sQMBsxwnIOKEsh5yQg/wuQ+QUggMACcqmvUz9+/fefUlC86Nd/aPIAA1ZiA4TIQAOXL0zApM9AZcDIgOxsXACUmgLMGRgu3EcVd9DFHXNgF589e5agEwSjIQbB8INXuNWCIpCoNKQgRlo4QFPMf4JBAXMleo5McMbtYlipzkjI8P0tpMcgKFX8p2aSALoWbB4LMPL+MJzllJV9+WqvnDivGiWG3r96ohae67ClQWKCh5A6gABCLhVZkEptcPWNVIKD2TCMXMqjlf4Qi0CKPFopz86P3/z7L5PyuhRmMB+1ygdQWQNyMRMvLy8bNVMCqBJn+vz5MyM1Db127RoDEwMNAN6sWziXgWHCJsx6koD38RsKMhBkyIHLCDEQG1T4KIjjdyneLAsyRBHYdJQXRW0G4HMxEw8PD/Uj6suXLwxUTlL4Yx9PlYLPpfjbK+SUq6AgJxhRBkrA+isKVSzfh0A6JRRRAtyE0yZGOwkYUf+pnaNokU0ZqW4oLEn9v/aEOiHw+PXPp6DEzyguLs7NYDE7WVnPdSIlBj56+fn2m0Vyrj9+/HgC6q8BexuMXMBUwA2MNCYuLi7Gb9++/Udvq+JoTPyHtW1BvUQg/gzEvwjVkIx4xHEmRYAA1Vm/T8JAFH5XoLQqUkPcIDCwKYOzg67+GS4mmhhjXJyMm7ub0c1/wN3JzUkT42JM/BFdGwsJhLTY+l65K0cDGkrR+pLj7sr1+vL67r3ve/X/4NqmyhsfO15a3S4WlDL8obyb7qv3aZ+/ncwdom4u6ha8dKVSqWilrcYdZdqkSL3lerW9poX66eJI0U/KNM3pUiFTKxYYJEVmdQa5KSVPriYrCwgCFEiuBLTcp0h4siDhEgBs+AfS5Yhk2agKE3YhgrSy8H3iH5W1DbBqz7LjuAEpuroIsLQLYDV/pprPp6Ptz4N917KYwBjlm3GESDMp+nLWjxrDLH79OBIh7EECwlpJdlZeIZgYfolVpFwOVDJlUX2W4OKwCkSMlg3efFrXdU/OvVHE4G/q4hogP6RCenUf2bJ9cxUtOx9nUS5m8k5sURVuAHGzrkkkBB/Ljxu2fiMa8PpYlyEmHBt4IsP6hIbcQAG3kVRtKWIJZV3DMJzH28vN5YN2UJD/S2nguVo7asPTw80+RoMORSyZ86Q5yM2pqjpj23YGhTmOEzg4zoHP+2CbdJ2JsbwWx17oPsavBb3YD5/t4bMB+46iKE1N0+qWZbUwMDjh8MqkyqZK3yF5yKCWpb5arWapietiHlo7sPE1WdGke/yx2Je+vokKKXFDWcEvfTl+AINQ5QAAAAAASUVORK5CYII=" (click)="copyInputMessage(userinput)" value="click to copy" />' +
      '</div></div><div class="row box-main "><div class="col-xs-12 col-sm-7 col-md-7"><div class="data-info"><table><tbody><tr><td><img class="img-size" src="assets/images/amount.svg"/></td><td>Amount:' +
      this.amount +
      'PMA</td></tr><tr><td><img class="img-size" src="assets/images/cycle.svg" /></td><td>Transfer: Instantly</td></tr></tbody></table></div></div><div class="col-xs-12 col-sm-5 col-md-5"><label class="tit-text">' +
      this.title +
      '</label> <br /><label class="bm-text">' +
      this.description +
      '</label> <br /><label class="bill-info">Billing Model description.</label><label class="bill-info">Explain briefly what your Billing Model offers Billing Model description.Explain briefly what your Billing Model offers</label></div></div></div></div></div></div></body></html>';
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = html;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
