import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentUrl: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.paymentUrl = appConfig.apiBaseUrl + 'api/payment';
  }

  getPaymentSession(product: string, email: string): Observable<any> {
    const url = `${this.paymentUrl}/get-session`;
    return this.http.post<any>(
      url,
      { product: product, email: email },
      this.httpOptions
    );
  }
}
