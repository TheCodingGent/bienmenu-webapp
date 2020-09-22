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

const menuBucketUrl = 'https://bienmenu.s3.amazonaws.com/menus/';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
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
  isOpeningMenu = false;
  isHostedInternal = true;

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
        } else {
          if (!this.isHostedInternal) {
            window.location.href = this.formatMenuUrl(
              this.currentRestaurant.externalMenuLink
            );
          }
        }
      }, 1500);
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onClosedModal(_) {
    //navigate to menus
    if (!this.isHostedInternal) {
      window.location.href = this.formatMenuUrl(
        this.currentRestaurant.externalMenuLink
      );
    }
  }

  getMenus() {
    this.restaurantService
      .getRestaurant(this.currentRestaurantId)
      .subscribe((restaurant) => {
        this.currentRestaurant = restaurant;
        this.menus = restaurant.menus;
        this.isContactTracingEnabled = restaurant.tracingEnabled;
        this.isHostedInternal = restaurant.hostedInternal;
        this.mainColor = this.currentRestaurant.color;
        this.setColorThemeProperty();
      });
  }

  openMenu(filename: string) {
    this.isOpeningMenu = true;

    var windowReference = window.open();

    windowReference.location.href = this.formatMenuUrl(
      menuBucketUrl + this.currentRestaurant._id + '/' + filename + '.pdf'
    );

    // window.location.href = this.formatMenuUrl(
    //   menuBucketUrl + this.currentRestaurant._id + '/' + filename + '.pdf'
    // );

    this.isOpeningMenu = false;

    // this.restaurantService
    //   .getMenuForRestaurant(this.currentRestaurantId, filename)
    //   .subscribe(
    //     (data) => {
    //       var file = new Blob([data], { type: 'application/pdf' });
    //       var fileURL = URL.createObjectURL(file);
    //       //this.pdfSrc = URL.createObjectURL(file);
    //       this.isOpeningMenu = false;
    //       //window.open(fileURL);
    //       windowReference.location.href = fileURL;
    //     },
    //     (err) => {
    //       console.log(
    //         'An error occurred while retrieving pdf file for menu...' +
    //           err.message
    //       );
    //       this.isOpeningMenu = false;
    //     }
    //   );
  }

  formatMenuUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    } else {
      return '//' + url;
    }
  }
}
