import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Restaurant } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
import { ModalService } from 'src/app/services/modal.service';
import { Menu } from 'src/app/models/menu';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['../../app.component.css', './restaurant-detail.component.css'],
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant;
  success = false;
  menuUpdating = -1;
  notAllowed = false;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private location: Location,
    private modalService: ModalService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (
      this.tokenStorageService
        .getUser()
        .restaurants.find(
          (r) => r._id === this.route.snapshot.paramMap.get('id')
        ) ||
      this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN')
    ) {
      this.getRestaurant();
    } else {
      this.notAllowed = true;
    }
  }

  openModal(id: string, index: number) {
    this.menuUpdating = index;
    this.modalService.open(id);
  }

  onClosedModal(_) {
    this.ngOnInit();
  }

  updateSuccess(_) {
    this.success = true;
    setTimeout(() => (this.success = false), 3000);
    this.ngOnInit();
  }

  formatDate(utcDate: string) {
    return new Date(utcDate).toLocaleString();
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

  deleteMenu(menu: Menu, restaurantId: string) {
    if (confirm('Are you sure you want to delete this menu?')) {
      console.log('Deleting menu: ' + menu.name);

      this.restaurantService
        .deleteMenu(menu, restaurantId)
        .subscribe((data) => {
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
