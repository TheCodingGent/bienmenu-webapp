import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Menu } from 'src/app/models/menu';
import { Restaurant } from 'src/app/models/restaurant';
import { LightOrDark } from 'src/app/helpers/color.helper';
import { NavbarService } from 'src/app/services/navbar.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(1000)),
    ]),
  ],
})
export class MenuListComponent implements OnInit {
  currentRestaurantId: string;
  currentRestaurant: Restaurant;
  menus: Menu[];
  mainColor = '#009688';
  pdfSrc: string;
  showSplashScreen = true;
  isLoggedIn = false;
  isContactTracingEnabled = false;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private elRef: ElementRef,
    private navbarService: NavbarService,
    private tokenStorageService: TokenStorageService,
    private modalService: ModalService
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
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (!this.isLoggedIn) {
      // if user is not logged in hide the navigation bar
      this.navbarService.hide();
    }

    this.currentRestaurantId = this.route.snapshot.paramMap.get('id');

    if (this.currentRestaurantId) {
      this.getMenus();
      setTimeout(() => {
        this.showSplashScreen = false;
        if (this.isContactTracingEnabled) {
          this.openModal('contacttracingmodal');
        }
      }, 3000);
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onClosedModal(_) {}

  getMenus() {
    this.restaurantService
      .getRestaurant(this.currentRestaurantId)
      .subscribe((restaurant) => {
        this.currentRestaurant = restaurant;
        this.menus = restaurant.menus;
        this.isContactTracingEnabled = restaurant.tracingEnabled;
        this.mainColor = this.currentRestaurant.color;
        this.setColorThemeProperty();
      });
  }

  openMenu(filename: string) {
    this.restaurantService
      .getMenuForRestaurant(this.currentRestaurantId, filename)
      .subscribe(
        (data) => {
          console.log('Successfully fetched data.');
          var file = new Blob([data], { type: 'application/pdf' });
          // var fileURL = URL.createObjectURL(file);
          this.pdfSrc = URL.createObjectURL(file);
          //window.open(fileURL);
        },
        (err) => {
          console.log(
            'An error occurred while retrieving pdf file for menu...' +
              err.message
          );
        }
      );
  }
}
