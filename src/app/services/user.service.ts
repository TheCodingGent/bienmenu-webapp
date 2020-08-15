import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl: string; // URL to web api

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.userApiUrl = appConfig.apiBaseUrl + 'api/content/';
  }

  getPublicContent(): Observable<any> {
    return this.http.get(this.userApiUrl + 'all', { responseType: 'text' });
  }

  getUserContent(): Observable<any> {
    return this.http.get(this.userApiUrl + 'user', { responseType: 'text' });
  }

  getAdminContent(): Observable<any> {
    return this.http.get(this.userApiUrl + 'admin', {
      responseType: 'text',
    });
  }

  getUserRestaurants(): Observable<any> {
    return this.http.get(this.userApiUrl + 'restaurants', {
      responseType: 'json',
    });
  }

  getMenuUpdateAllowed(): Observable<any> {
    return this.http.get(this.userApiUrl + 'features/update-allowed', {
      responseType: 'text',
    });
  }

  getRestaurantAddAllowed(): Observable<any> {
    return this.http.get(this.userApiUrl + 'features/add-restaurant-allowed', {
      responseType: 'text',
    });
  }

  getMaxMenuCountAllowed(): Observable<any> {
    return this.http.get(this.userApiUrl + 'features/max-menu-count-allowed');
  }

  updateMenuUpdateCount(): Observable<any> {
    return this.http.get(this.userApiUrl + 'features/update-count', {
      responseType: 'text',
    });
  }

  // updateFeatureExpiry(): Observable<any> {
  //   return this.http.get(this.userApiUrl + 'features/update-feature-expiry', {
  //     responseType: 'text',
  //   });
  // }

  updateRestaurantCount(): Observable<any> {
    return this.http.get(this.userApiUrl + 'features/update-restaurant-count', {
      responseType: 'text',
    });
  }
}
