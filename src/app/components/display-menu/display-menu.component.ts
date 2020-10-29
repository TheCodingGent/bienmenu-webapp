import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MenuService } from 'src/app/services/menu.service';
import { Menu } from 'src/app/models/menu';
import { MenuSection } from 'src/app/models/menu-section';
import { FoodItem } from 'src/app/models/food-item';
import { LightOrDark } from 'src/app/helpers/color.helper';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-display-menu',
  templateUrl: './display-menu.component.html',
  styleUrls: ['./display-menu.component.scss'],
})
export class DisplayMenuComponent implements OnInit {
  menu: Menu = new Menu();
  sections: MenuSection[] = [];
  selectedFoodItem: FoodItem;
  foodItem: FoodItem = new FoodItem();
  FoodItems: FoodItem[] = [];
  tag: string = '';
  color: string = '';
  mainColor = '#009688';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private menuService: MenuService,
    private tokenStorageService: TokenStorageService,
    private navbarService: NavbarService,
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
    if (!this.tokenStorageService.getToken()) {
      // if user is not logged in hide the navigation bar
      this.navbarService.hide();
    }

    this.color = this.activatedRoute.snapshot.paramMap.get('color');
    this.menuService
      .getMenu(this.activatedRoute.snapshot.paramMap.get('id'))
      .subscribe((menu) => {
        this.mainColor = this.color;
        this.setColorThemeProperty();
        this.menu = menu;
        this.sections = this.menu.sections;
        // this.foodItemService.getFoodItemsForUser().subscribe((items) => {
        //   items.foodItems;
        //   console.log(items.foodItems);

        //   for (let section of this.sections) {
        //     for (let menuSectionItem of section.menuSectionItems) {
        //       this.FoodItems = items.foodItems.filter(
        //         (foodItem) => foodItem._id === menuSectionItem.foodItemId
        //       );
        //       section.foodItems = this.FoodItems;
        //     }
        //   }
        // });
      });
  }

  goToFoodItemDetails(foodItemId: string) {
    this.router.navigateByUrl('/food-items/food-item/' + foodItemId);
  }

  goBack(): void {
    this.location.back();
  }
}
