import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ModalService } from 'src/app/services/modal.service';
import { Menu } from 'src/app/models/menu';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant;
  success = false;
  menuUpdating = -1;
  notAllowed = false;
  featureAllowed = true;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private userService: UserService,
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
      this.setAllowedFeatures();
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

  setAllowedFeatures(): void {
    if (this.tokenStorageService.getPlusSubscriptionToken()) {
      // if member is a plus member enable all features on manage page for menus; unlimited updates and adds
      return;
    }

    this.userService.getMenuUpdateAllowed().subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(JSON.parse(err.error).message);
        this.featureAllowed = false;
      }
    );
  }

  deleteMenu(menu: Menu, restaurantId: string) {
    if (
      confirm('Are you sure you want to delete this menu and all its data?')
    ) {
      this.restaurantService.deleteMenu(menu, restaurantId).subscribe((_) => {
        this.ngOnInit();
      }),
        (err) => {
          console.log('An error occurred: ' + err);
        };
    }
  }
}
