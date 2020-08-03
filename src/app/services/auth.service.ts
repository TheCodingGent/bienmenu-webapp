import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl: string;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.authUrl = appConfig.apiBaseUrl + 'api/auth';
  }

  login(credentials): Observable<any> {
    return this.http.post(this.authUrl + '/signin', credentials, httpOptions);
  }

  register(user): Observable<any> {
    console.log(user);
    return this.http.post(this.authUrl + '/signup', user, httpOptions);
  }

  getPlusSubscription(): Observable<any> {
    return this.http.get(this.authUrl + '/subscription/plus', httpOptions);
  }

  requestResetPassword(email): Observable<any> {
    return this.http.post(this.authUrl + '/reset-password', email, httpOptions);
  }

  updatePassword(body): Observable<any> {
    return this.http.post(this.authUrl + '/new-password', body, httpOptions);
  }
}
