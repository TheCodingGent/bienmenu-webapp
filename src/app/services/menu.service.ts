import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  constructor(private http: HttpClient, appConfig: AppConfigService) {
    this.menusUrl = appConfig.apiBaseUrl + 'menus';
  }

  getMenu(id: string): Observable<Menu> {
    const url = `${this.menusUrl}/menu/${id}`;
    return this.http.get<Menu>(url);
  }

  getMenusForRestaurant(): Observable<any> {
    return this.http.get(`${this.menusUrl}/restaurnt`);
  }

  addMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(
      `${this.menusUrl}/menu/add`,
      menu,
      this.httpOptions
    );
  }

  addMenuForRestaurant(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(
      `${this.menusUrl}/menu/add/restaurant`,
      menu,
      this.httpOptions
    );
  }

  deleteMenuById(menuId: string): Observable<Menu> {
    return this.http.post<Menu>(
      `${this.menusUrl}/menu/delete`,
      { menuId: menuId },
      this.httpOptions
    );
  }
}
