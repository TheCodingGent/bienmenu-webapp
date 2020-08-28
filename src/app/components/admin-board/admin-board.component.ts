import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss'],
})
export class AdminBoardComponent implements OnInit {
  accessAllowed = false;
  content: string;
  restaurants: Restaurant[];

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getAdminContent().subscribe(
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

  goToRoute(url: string): void {
    this.router.navigateByUrl(url);
  }
}
