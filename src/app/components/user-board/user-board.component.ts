import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import { UserService } from 'src/app/services/user.service';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.scss'],
})
export class UserBoardComponent implements OnInit {
  content: string;
  currentUser: any;
  restaurants: Restaurant[];
  enableAdd = false;
  lang;
  language = '';

  constructor(
    private restaurantService: RestaurantService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.lang = JSON.parse(localStorage.getItem('languages'));
    if (this.lang !== null) this.language = this.lang[0].language;
    console.log(this.language);
  }

  ngOnInit(): void {
    this.restaurants = [];
    this.currentUser = this.tokenStorageService.getUser();
    this.getUserRestaurants();
    this.getAddAllowed();
    if (this.language === 'en') {
      this.translate.use('fr');
    } else if (this.language === 'fr') {
      this.translate.use('en');
    }
    this.lang = JSON.parse(localStorage.getItem('languages'));
    this.language = this.lang[0].language;
  }

  getUserRestaurants(): void {
    this.userService.getUserRestaurants().subscribe((data) => {
      if (data.restaurants) {
        data.restaurants.forEach((restaurantId: string) => {
          this.getRestaurant(restaurantId);
        });
      }
    });
  }

  getRestaurant(restaurantId: string): void {
    this.restaurantService
      .getRestaurant(restaurantId)
      .subscribe((restaurant) => this.restaurants.push(restaurant));
  }

  getAddAllowed(): void {
    this.userService.getRestaurantAddAllowed().subscribe(
      (_) => {
        this.enableAdd = true;
      },
      (err) => {
        console.log(err.message);
        this.enableAdd = false;
      }
    );
  }

  goToRoute(url: string): void {
    this.router.navigateByUrl(url);
  }
}
