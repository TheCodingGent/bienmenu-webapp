import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/food-item';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class FoodItemService {
  private foodItemsApiUrl: string; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.foodItemsApiUrl = appConfig.apiBaseUrl + 'food-items';
  }

  getFoodItemById(foodItemId: string): Observable<FoodItem> {
    return this.http.get<FoodItem>(
      `${this.foodItemsApiUrl}/food-item/${foodItemId}`
    );
  }

  getFoodItemsForUser(): Observable<any> {
    return this.http.get(`${this.foodItemsApiUrl}/user`);
  }

  addFoodItem(foodItem: FoodItem): Observable<FoodItem> {
    return this.http.post<FoodItem>(
      `${this.foodItemsApiUrl}/add`,
      foodItem,
      this.httpOptions
    );
  }

  addFoodItemForUser(foodItem: FoodItem): Observable<FoodItem> {
    return this.http.post<FoodItem>(
      `${this.foodItemsApiUrl}/add/user`,
      foodItem,
      this.httpOptions
    );
  }
}
