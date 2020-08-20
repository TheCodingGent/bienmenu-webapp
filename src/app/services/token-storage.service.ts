import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const PLUS_SUB_KEY = 'auth-plus-sub';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public saveRestaurant(restaurant: Restaurant): void {
    var user = JSON.parse(sessionStorage.getItem(USER_KEY));

    var data = { _id: restaurant._id, name: restaurant.name };

    user.restaurants.push(data);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public deleteRestaurant(restaurantId: string): void {
    var user = JSON.parse(sessionStorage.getItem(USER_KEY));

    var indexToRemove = user.restaurants.findIndex(
      (restaurant) => restaurant._id === restaurantId
    );

    if (indexToRemove > -1) {
      user.restaurants.splice(indexToRemove, 1);
    }

    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public savePlusSubscriptionToken(token: string): void {
    window.sessionStorage.removeItem(PLUS_SUB_KEY);
    window.sessionStorage.setItem(PLUS_SUB_KEY, token);
  }

  public getPlusSubscriptionToken(): string {
    return sessionStorage.getItem(PLUS_SUB_KEY);
  }
}
