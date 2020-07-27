import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:5000/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', credentials, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user, httpOptions);
  }

  requestResetPassword(email): Observable<any> {
    return this.http.post(AUTH_API + 'reset-password', email, httpOptions);
  }

  updatePassword(body): Observable<any> {
    return this.http.post(AUTH_API + 'new-password', body, httpOptions);
  }
}
