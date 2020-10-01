import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Menu, MenuType } from 'src/app/models/menu';
import { Restaurant } from 'src/app/models/restaurant';
import { LightOrDark } from 'src/app/helpers/color.helper';
import { NavbarService } from 'src/app/services/navbar.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  useAnimation,
} from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { rubberBand } from 'ng-animate';

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
    trigger('rubberBand', [
      transition(
        '* => *',
        useAnimation(rubberBand, {
          params: { timing: 1, delay: 1 },
        })
      ),
    ]),
  ],
})
export class MenuListComponent implements OnInit {
  currentRestaurantId: string;
  currentRestaurant: Restaurant;
  menus: Menu[];
  mainColor = '#009688';
  pdfSrc: string;
  isLoggedIn = false;
  isOpeningMenu = false;
  isHostedInternal = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private elRef: ElementRef,
    private navbarService: NavbarService,
    private tokenStorageService: TokenStorageService
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
      // if (!this.isHostedInternal) {
      //   window.location.href = this.formatMenuUrl(
      //     this.currentRestaurant.externalMenuLink
      //   );
      // }
    }
  }

  getMenus() {
    this.restaurantService
      .getRestaurant(this.currentRestaurantId)
      .subscribe((restaurant) => {
        this.currentRestaurant = restaurant;
        this.menus = restaurant.menuBank.menus;
        // this.isHostedInternal = restaurant.hostedInternal;
        this.mainColor = this.currentRestaurant.color;
        this.setColorThemeProperty();
        if (this.menus.length === 1) {
          this.openMenu(this.menus[0]);
        }
      });
  }

  // openMenu(filename: string) {
  //   this.isOpeningMenu = true;

  //   var windowReference = window.open();

  //   windowReference.location.href = this.formatMenuUrl(
  //     menuBucketUrl + this.currentRestaurant._id + '/' + filename + '.pdf'
  //   );

  //   this.isOpeningMenu = false;
  // }
  openMenu(menu: Menu) {
    switch (+menu.type) {
      case MenuType.BienMenuMenu:
        this.router.navigate([
          '/display-menu',
          menu._id,
          this.currentRestaurant.color,
        ]);
        break;
      case MenuType.FileBasedMenu:
        this.isOpeningMenu = true;
        var windowReference = window.open();
        windowReference.location.href = this.formatMenuUrl(
          menuBucketUrl +
            this.currentRestaurant._id +
            '/' +
            menu.filename +
            '.pdf'
        );
        this.isOpeningMenu = false;
        break;
      case MenuType.ExternalLinkMenu:
        window.location.href = this.formatMenuUrl(menu.externalMenuLink);
        break;
    }
  }

  formatMenuUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    } else {
      return '//' + url;
    }
  }
}
