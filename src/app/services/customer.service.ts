import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Customer } from '../models/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersUrl: string; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.customersUrl = appConfig.apiBaseUrl + 'customers';
  }

  addCustomer(customer: Customer): Observable<Customer> {
    const url = `${this.customersUrl}/tracing/add`;
    return this.http.post<Customer>(url, customer, this.httpOptions);
  }
}
