import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss'],
  providers: [NgbActiveModal]
})
export class ProductHomeComponent implements OnInit {
  productArray;
  myDIV: boolean = false;
  id;
  noProducts: boolean;

  constructor(
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.noProducts = false;
    console.log('my Div', this.myDIV);
    this.productArray = [
      {
        productName: 'New life',
        totalEarnings: '34',
        activeCustomers: '0',
        NoOfBillingModels: '2',
        creationDate: '2018/10/18'
      },
      {
        productName: 'New life',
        totalEarnings: '34',
        activeCustomers: '4',
        NoOfBillingModels: '2',
        creationDate: '2018/10/18'
      },
      {
        productName: 'New life',
        totalEarnings: '34',
        activeCustomers: ' ',
        NoOfBillingModels: '2',
        creationDate: '2018/10/18'
      }
    ];

    console.log('array', this.productArray[1]);
  }

  deletefunction(deletePopup, id) {
    console.log('delete fuction', id);
    this.id = id;
    this.modalService.open(deletePopup);
  }
  delete() {
    console.log('this.id', this.id);
    //call delete service here
  }
  productName(row) {
    console.log('row', row);
    if (row.activeCustomers > 0) {
      this.router.navigate(['']);
    }
  }
}
