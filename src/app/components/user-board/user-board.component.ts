import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { CollapseComponent } from 'angular-bootstrap-md';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.css'],
})
export class UserBoardComponent implements OnInit {
  content: string;
  currentUser: any;
  restaurants: Restaurant[];
  enableAdd = false;

  constructor(
    private restaurantService: RestaurantService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.restaurants = [];
    this.currentUser = this.tokenStorageService.getUser();
    this.getUserRestaurants();
    this.getAddAllowed();
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
}
