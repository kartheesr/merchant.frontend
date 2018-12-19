import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '@app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingServiceStep2 {
  public model: any;
  public actionUrl: string;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'api-request-source': 'portal'
  });
  setValues(values) {
    this.model = values;
  }

  constructor(private _http: HttpClient) {}
}
