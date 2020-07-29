import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Menu } from 'src/app/models/menu';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['../../app.component.css', './menu-list.component.css'],
})
export class MenuListComponent implements OnInit {
  currentRestaurantId: string;
  currentRestaurant: Restaurant;
  menus: Menu[];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.currentRestaurantId = this.route.snapshot.paramMap.get('id');

    if (this.currentRestaurantId) {
      this.getMenus();
    }
  }

  getMenus() {
    this.restaurantService
      .getRestaurant(this.currentRestaurantId)
      .subscribe((restaurant) => {
        this.currentRestaurant = restaurant;
        this.menus = restaurant.menus;
      });
  }

  openMenu(filename: string) {
    this.restaurantService
      .getMenuForRestaurant(this.currentRestaurantId, filename)
      .subscribe((data) => {
        console.log('Successfully fetched data.');
        var file = new Blob([data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
