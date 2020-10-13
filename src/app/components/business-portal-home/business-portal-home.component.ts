import {
  trigger,
  state,
  style,
  transition,
  useAnimation,
} from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';
import { LightOrDark } from 'src/app/helpers/color.helper';
import { Restaurant } from 'src/app/models/restaurant';
import { ModalService } from 'src/app/services/modal.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { fadeIn, tada } from 'ng-animate';

@Component({
  selector: 'app-business-portal-home',
  templateUrl: './business-portal-home.component.html',
  styleUrls: ['./business-portal-home.component.scss'],
  animations: [
    trigger('tada', [
      transition(
        '* => *',
        useAnimation(tada, {
          params: { timing: 1, delay: 1 },
        })
      ),
    ]),
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void => *', useAnimation(fadeIn)),
    ]),
  ],
})
export class BusinessPortalHomeComponent implements OnInit {
  currentRestaurantId: string;
  currentRestaurant: Restaurant;
  mainColor = '#009688';

  showSplashScreen = true;
  showThankYouMessage = false;

  isLoggedIn = false;
  isContactTracingEnabled = false;
  hasMenus = false;
  isHostedInternal = true;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private elRef: ElementRef,
    private navbarService: NavbarService,
    private tokenStorageService: TokenStorageService,
    private modalService: ModalService,
    private router: Router
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
      this.elRef.nativeElement.style.setProperty('--font-color', '#fffef2');
    }
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (!this.isLoggedIn) {
      // if user is not logged in hide the navigation bar
      this.navbarService.hide();
    }

    this.currentRestaurantId = this.route.snapshot.paramMap.get('id');

    if (this.currentRestaurantId) {
      this.getRestaurant();
      setTimeout(() => {
        this.showSplashScreen = false;
      }, 2000);
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onClosedModal(closed: boolean) {
    if (closed) {
      this.showThankYouMessage = true;
      setTimeout(() => {
        this.showThankYouMessage = false;
      }, 5000);
    }
  }

  getRestaurant() {
    this.restaurantService
      .getRestaurant(this.currentRestaurantId)
      .subscribe((restaurant) => {
        this.currentRestaurant = restaurant;
        this.isContactTracingEnabled = restaurant.tracingEnabled;
        this.hasMenus = restaurant.menuBank.menus.length > 0;
        this.mainColor = this.currentRestaurant.color;
        this.setColorThemeProperty();
      });
  }

  goToMenus() {
    this.router.navigate(['/menu-list', { id: this.currentRestaurant._id }]);
  }
}
