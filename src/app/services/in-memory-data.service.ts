import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const menus = [
      {
        id: 'menu1a',
        restaurantId: 'restaurant1',
        type: 'general',
        url: 'http://www.google.com',
      },
      {
        id: 'menu1b',
        restaurantId: 'restaurant1',
        type: 'dessert',
        url: 'http://www.google.com',
      },
      {
        id: 'menu2a',
        restaurantId: 'restaurant2',
        type: 'lunch',
        url: 'http://www.google.com',
      },
      {
        id: 'menu3a',
        restaurantId: 'restaurant3',
        type: 'dinner',
        url: 'http://www.google.com',
      },
      {
        id: 'menu4a',
        restaurantId: 'restaurant4',
        type: 'general',
        url: 'http://www.google.com',
      },
      {
        id: 'menu5a',
        restaurantId: 'restaurant5',
        type: 'drink',
        url: 'http://www.google.com',
      },
      {
        id: 'menu6a',
        restaurantId: 'restaurant6',
        type: 'dessert',
        url: 'http://www.google.com',
      },
    ];

    let restaurants = [
      { id: 'restaurant1', menus: ['menu1a', 'menu1b'] },
      { id: 'restaurant2', menus: ['menu2a'] },
      { id: 'restaurant3', menus: ['menu3a'] },
      { id: 'restaurant4', menus: ['menu4a'] },
      { id: 'restaurant5', menus: ['menu5a'] },
      { id: 'restaurant6', menus: ['menu6a'] },
    ];

    return { menus, restaurants };
  }
}
