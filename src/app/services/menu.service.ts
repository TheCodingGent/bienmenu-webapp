import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FoodItem } from 'src/app/models/food-item';
import { Menu } from 'src/app/models/menu';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // URL to web api
  private menusUrl: string; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.menusUrl = appConfig.apiBaseUrl + 'menus';
  }

  getMenu(id: string): Observable<Menu> {
    // const url = `${this.menusUrl}/${id}`;
    const url = 'http://localhost:4200/assets/demoData/menu.json';
    return this.http.get<Menu>(url);
  }
  getFoodItems(): Observable<FoodItem[]> {
    // const url = `${this.menusUrl}`;
    const url = 'http://localhost:4200/assets/demoData/foodItems.json';
    return this.http.get<FoodItem[]>(url);
  }
}
