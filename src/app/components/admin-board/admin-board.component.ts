import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['../../app.component.css', './admin-board.component.css'],
})
export class AdminBoardComponent implements OnInit {
  accessAllowed = false;
  content: string;
  restaurants: Restaurant[];

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      (_) => {
        this.accessAllowed = true;
        this.getRestaurants();
      },
      (err) => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  getRestaurants(): void {
    this.restaurantService
      .getRestaurants()
      .subscribe((restaurants) => (this.restaurants = restaurants));
  }
}
