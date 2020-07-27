import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['../../app.component.css', './user-board.component.css'],
})
export class UserBoardComponent implements OnInit {
  content: string;
  currentUser: any;
  restaurants: Restaurant[];

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.restaurants = [];
    this.userService.getUserBoard().subscribe(
      (data) => {
        this.currentUser = this.tokenStorageService.getUser();
        this.content = data;
        for (let restaurant of this.currentUser.restaurants) {
          this.getRestaurant(restaurant._id);
        }
      },
      (err) => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  getRestaurant(restaurantId: string): void {
    this.restaurantService
      .getRestaurant(restaurantId)
      .subscribe((restaurant) => this.restaurants.push(restaurant));
  }
}
