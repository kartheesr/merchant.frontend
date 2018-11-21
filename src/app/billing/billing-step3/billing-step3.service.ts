import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillingServiceStep3 {
  public model: any;
  setValues(values) {
    this.model = values;
  }
  constructor() {}
}
