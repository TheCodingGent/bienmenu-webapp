import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.css'],
})
export class UserBoardComponent implements OnInit {
  content: string;
  currentUser: any;
  restaurants: Restaurant[];
  enableAdd = true;

  constructor(
    private restaurantService: RestaurantService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.restaurants = [];
    this.currentUser = this.tokenStorageService.getUser();
    for (let restaurant of this.currentUser.restaurants) {
      this.getRestaurant(restaurant._id);
    }
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
        console.log(JSON.parse(err.error).message);
        this.enableAdd = false;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
