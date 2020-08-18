import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { Menu } from '../models/menu';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private restaurantsUrl: string; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.restaurantsUrl = appConfig.apiBaseUrl + 'restaurants';
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.restaurantsUrl);
  }

  getRestaurant(id: string): Observable<Restaurant> {
    const url = `${this.restaurantsUrl}/${id}`;
    return this.http.get<Restaurant>(url);
  }

  getMenuForRestaurant(id: string, filename: string): Observable<any> {
    const url = `${this.appConfig.apiBaseUrl}menu/pdf/${id}/${filename}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  getMenuMaxCountReached(id: string): Observable<any> {
    const url = `${this.restaurantsUrl}/menu-max-count-reached/${id}`;
    return this.http.get(url);
  }

  getContactTracing(id: string): Observable<any> {
    const url = `${this.restaurantsUrl}/get-contact-tracing/${id}`;
    return this.http.get<Menu>(url, this.httpOptions);
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const url = `${this.restaurantsUrl}/add`;
    return this.http.post<Restaurant>(url, restaurant, this.httpOptions);
  }

  addRestaurantForUser(restaurant: Restaurant): Observable<Restaurant> {
    const url = `${this.restaurantsUrl}/add/user`;
    return this.http.post<Restaurant>(url, restaurant, this.httpOptions);
  }

  addMenu(menu: Menu, id: string): Observable<Menu> {
    const url = `${this.restaurantsUrl}/menus/add/${id}`;
    return this.http.post<Menu>(url, JSON.stringify(menu), this.httpOptions);
  }

  updateMenu(menu: Menu, id: string): Observable<Menu> {
    const url = `${this.restaurantsUrl}/menus/update/${id}`;
    return this.http.post<Menu>(url, JSON.stringify(menu), this.httpOptions);
  }

  updateContactTracing(tracingEnabled: boolean, id: string): Observable<any> {
    const url = `${this.restaurantsUrl}/set-contact-tracing/${id}`;
    return this.http.post<Menu>(
      url,
      { tracingEnabled: tracingEnabled },
      this.httpOptions
    );
  }

  deleteMenu(menu: Menu, id: string): Observable<unknown> {
    const url = `${this.restaurantsUrl}/menus/delete/${id}`;
    return this.http.post(url, JSON.stringify(menu), this.httpOptions);
  }

  deleteRestaurant(id: string): Observable<unknown> {
    const url = `${this.restaurantsUrl}/delete/${id}`;
    return this.http.post(url, { restaurantId: id }, this.httpOptions);
  }
}
