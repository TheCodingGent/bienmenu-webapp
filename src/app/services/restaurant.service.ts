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

  /** GET restaurants. Will 404 if id not found */
  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.restaurantsUrl);
  }

  /** GET restaurant by id. Will 404 if id not found */
  getRestaurant(id: string): Observable<Restaurant> {
    const url = `${this.restaurantsUrl}/${id}`;
    return this.http.get<Restaurant>(url);
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
    return this.http.put<Menu>(url, JSON.stringify(menu), this.httpOptions);
  }

  updateMenu(menu: Menu, id: string): Observable<Menu> {
    const url = `${this.restaurantsUrl}/menus/update/${id}`;
    return this.http.post<Menu>(url, JSON.stringify(menu), this.httpOptions);
  }

  deleteMenu(menu: Menu, restaurantId: string): Observable<unknown> {
    const url = `${this.restaurantsUrl}/menus/delete/${restaurantId}`;
    return this.http.post(url, JSON.stringify(menu), this.httpOptions);
  }

  getMenuForRestaurant(id: string, filename: string): Observable<any> {
    const url = `${this.appConfig.apiBaseUrl}menu/pdf/${id}/${filename}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }
}
