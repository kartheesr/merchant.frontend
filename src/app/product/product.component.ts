import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  model: any = {};

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.model = {
      productName: '',
      Description: '',
      tags: ''
    };
  }
  cancel() {
    this.model = {
      productName: '',
      Description: '',
      tags: ''
    };
  }
  postProduct(model) {
    console.log('post product: ', model);
    this.cancel();
  }
}
