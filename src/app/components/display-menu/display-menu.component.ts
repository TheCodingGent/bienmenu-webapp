import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { Menu } from 'src/app/models/menu';
import { MenuSection } from 'src/app/models/menu-section';
import { FoodItemService } from 'src/app/services/food-item.service';
import { FoodItem } from 'src/app/models/food-item';

@Component({
  selector: 'app-display-menu',
  templateUrl: './display-menu.component.html',
  styleUrls: ['./display-menu.component.scss'],
})
export class DisplayMenuComponent implements OnInit {
  menu: Menu = new Menu();
  sections: MenuSection[] = [];
  foodItem: FoodItem = new FoodItem();
  FoodItems: FoodItem[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private foodItemService: FoodItemService
  ) {}

  async ngOnInit() {
    this.menuService
      .getMenu(this.activatedRoute.snapshot.paramMap.get('id'))
      .subscribe((menu) => {
        this.menu = menu;
        this.sections = this.menu.sections;
      });
  }
}
