import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ObjectID } from 'bson';

import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';
import { Menu } from '../menu';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getRestaurant();
  }

  getRestaurant(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.restaurantService
      .getRestaurant(id)
      .subscribe((restaurant) => (this.restaurant = restaurant));
  }

  handleInputFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      console.log(file.name);
    });
  }

  addMenu() {
    const menu: Menu = {
      _id: new ObjectID().toString(),
      name: 'Test Menu',
      filename: 'test_menu',
    };
    this.restaurantService
      .addMenu(menu, '5f10e5cc72135674084ecebb')
      .subscribe((menu) => {
        console.log(menu);
        this.ngOnInit();
      }),
      (err) => {
        console.log('An error occurred: ' + err);
      };
  }

  deleteMenu(menuId: string) {
    if (confirm('Are you sure you want to delete this menu?')) {
      console.log('Deleting menu: ' + menuId);

      this.restaurantService.deleteMenu(menuId).subscribe((data) => {
        console.log(data);
        this.ngOnInit();
      }),
        (err) => {
          console.log('An error occurred: ' + err);
        };
    }
  }

  goBack(): void {
    this.location.back();
  }
}
