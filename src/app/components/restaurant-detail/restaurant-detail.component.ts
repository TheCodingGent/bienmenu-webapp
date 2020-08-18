import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ModalService } from 'src/app/services/modal.service';
import { Menu } from 'src/app/models/menu';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { LightOrDark } from 'src/app/helpers/color.helper';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in'),
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant;
  success = false;
  menuUpdating = -1;
  userAllowedOnPage = false;
  menuUpdateAllowed = false;
  maxMenuCountReached = true;
  userHasContactTracing = false;

  contactTracingChecked = false;
  isSettingUpdatedSubmitted = false;

  mainColor = '#009688';

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private userService: UserService,
    private modalService: ModalService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  setColorThemeProperty() {
    this.elRef.nativeElement.style.setProperty('--main-color', this.mainColor);
    this.elRef.nativeElement.style.setProperty(
      '--accent-color',
      this.mainColor + '4d'
    );

    if (LightOrDark(this.mainColor) == 'light') {
      this.elRef.nativeElement.style.setProperty('--font-color', '#000000');
    } else {
      this.elRef.nativeElement.style.setProperty('--font-color', '#ffffff');
    }
  }

  ngOnInit(): void {
    if (
      this.tokenStorageService
        .getUser()
        .restaurants.includes(this.route.snapshot.paramMap.get('id')) ||
      this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN')
    ) {
      this.userAllowedOnPage = true;
      this.getMenuUpdateAllowed();
      this.getUserHasContactTracing();
      this.getRestaurant();
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
    this.restaurantService.getRestaurant(id).subscribe((restaurant) => {
      this.restaurant = restaurant;
      this.getMenuMaxCountReached();
      this.contactTracingChecked = restaurant.tracingEnabled;
      //this.mainColor = restaurant.color;
      //this.setColorThemeProperty();
    });
  }

  getMenuUpdateAllowed(): void {
    this.userService.getMenuUpdateAllowed().subscribe(
      (_) => {
        this.menuUpdateAllowed = true;
      },
      (err) => {
        console.log(err.message);
        this.menuUpdateAllowed = false;
      }
    );
  }

  getUserHasContactTracing(): void {
    this.userService.getUserHasContactTracing().subscribe(
      (_) => {
        this.userHasContactTracing = true;
      },
      (err) => {
        console.log(err.message);
        this.userHasContactTracing = false;
      }
    );
  }

  getMenuMaxCountReached(): void {
    this.restaurantService
      .getMenuMaxCountReached(this.restaurant._id)
      .subscribe(
        (_) => {
          this.maxMenuCountReached = false;
        },
        (err) => {
          console.log(err.message);
          this.maxMenuCountReached = true;
        }
      );
  }

  deleteMenu(menu: Menu, restaurantId: string) {
    if (
      confirm('Are you sure you want to delete this menu and all its data?')
    ) {
      this.restaurantService.deleteMenu(menu, restaurantId).subscribe((_) => {
        window.location.reload();
      }),
        (err) => {
          console.log('An error occurred: ' + err);
        };
    }
  }

  deleteRestaurant(restaurantId: string) {
    if (
      confirm(
        'Are you sure you want to delete this restaurant? This action cannot be undone.'
      )
    ) {
      this.restaurantService.deleteRestaurant(restaurantId).subscribe((_) => {
        this.router.navigate(['/user']).then(() => {
          window.location.reload();
        });
      }),
        (err) => {
          console.log('An error occurred: ' + err);
        };
    }
  }

  saveContactTracing() {
    if (
      confirm('Are you sure you want to modify the contact tracing setting?')
    ) {
      this.isSettingUpdatedSubmitted = true;
      this.restaurantService
        .updateContactTracing(this.contactTracingChecked, this.restaurant._id)
        .subscribe((data) => {
          console.log(data);
          this.isSettingUpdatedSubmitted = false;
          window.location.reload();
        }),
        (err) => {
          console.log('An error occurred: ' + err);
          this.isSettingUpdatedSubmitted = false;
        };
    }
  }

  getContactTracingValue(): string {
    if (this.contactTracingChecked === false) {
      return 'Disabled';
    } else {
      return 'Enabled';
    }
  }
}
