import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { ProductService } from '@app/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  model: any = {};
  data: any = {};
  description;
  valid: boolean;
  productCount;
  tagsCount;
  constructor(private route: ActivatedRoute, private router: Router, private service: ProductService) {}

  ngOnInit() {
    TagInputModule.withDefaults({
      tagInput: {
        placeholder: 'Add a new tag'
      }
    });
    this.model = {
      productName: '',
      productDes: '',
      tags: []
    };
    this.description = {
      count: 140
    };
    this.productCount = {
      count: 50
    };
    this.tagsCount = {
      count: 10
    };
  }
  // cancel() {
  //   this.model = {
  //     productName: '',
  //     Description: '',
  //     tags: []
  //   };
  //}
  // postProduct(model) {
  //   console.log('post product: ', model);
  //   this.cancel();
  // }

  handleCount(data) {
    if (data.value.length > 0) {
      let count = 140 - data.value.length;
      this.description.count = count;
    } else {
      this.description.count = 140;
    }
  }

  productNameCount(data) {
    if (data.value.length > 0) {
      let count = 50 - data.value.length;
      this.productCount.count = count;
    } else {
      this.productCount.count = 50;
    }
  }

  TagsCount(data) {
    if (data.value.length > 0) {
      let count = 10 - data.value.length;
      this.tagsCount.count = count;
    } else {
      this.tagsCount.count = 10;
    }
  }
  publish() {
    let dateTime = new Date().getTime();
    let data = {
      merchantID: '4a17335e-bf18-11e8-a355-000000fb1459',
      productname: this.model.productName,
      producttimestamp: Math.floor(dateTime / 1000),
      productdescription: this.model.productDes,
      tagid: this.model.tags
    };
    this.data = data;
    console.log('this.data', this.data);
    this.service.billingPost(this.data).subscribe(result => {
      console.log('publishStart');
      if (result.success == true) {
        console.log('publish');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onPublish() {
    this.publish();
  }
}
