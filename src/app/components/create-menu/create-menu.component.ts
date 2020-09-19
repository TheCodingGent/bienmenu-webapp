import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObjectID } from 'bson';
import { Subscription } from 'rxjs';
import { FoodItem } from 'src/app/models/food-item';
import { Menu } from 'src/app/models/menu';
import { MenuSection } from 'src/app/models/menu-section';
import { MenuSectionItem } from 'src/app/models/menu-section-item';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss'],
})
export class CreateMenuComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  private menuID: string;
  private menu: Menu;
  public menuName: string;
  public foodItems: FoodItem[];
  private isEditMode = false;

  public menuSections: MenuSection[] = [
    {
      _id: [new ObjectID()].toString(),
      menuId: '',
      name: '',
      order: 1,
      menuSectionItems: [],
      isActive: true,
      foodItems: [],
    },
  ];

  allSectionsList = ['foodItemsList', ...this.menuSections.map((_) => _._id)];

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      if (params['menuID']) {
        this.menuID = params['menuID'];
        this.menuSections = [];
        this.isEditMode = true;
      } else {
        this.menuID = [new ObjectID()].toString();
        this.menuSections[0].menuId = this.menuID;
      }
      this.getFoodItems();
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  getMenu(_menuID: string): void {
    this.menuService.getMenu(_menuID).subscribe((data) => {
      if (data) {
        this.menu = data;
      }
      this.menuName = this.menu.name;
      this.menuSections = this.menu.sections;
      this.convertMenuSectionItemToFoodItem();
    });
  }

  getFoodItems(): void {
    this.menuService.getFoodItems().subscribe((data) => {
      if (data) {
        this.foodItems = data;
      }
      if (this.isEditMode) {
        this.getMenu(this.menuID);
      }
    });
  }

  addSection() {
    const generatedID = [new ObjectID()].toString();
    this.menuSections.push({
      _id: generatedID,
      menuId: this.menuID,
      name: '',
      order: this.menuSections.length + 1,
      menuSectionItems: [],
      isActive: true,
      foodItems: [],
    });
    this.allSectionsList.push(generatedID);
  }

  onSectionRemoved(_menuSection: MenuSection) {
    this.foodItems.push(..._menuSection.foodItems);
    this.menuSections.splice(this.menuSections.indexOf(_menuSection), 1);
  }

  createMenuObject(): void {
    this.menu.isActive = true;
    this.menu.lastupdated = new Date().toLocaleString();
    this.menu.sections = this.convertFoodItemToMenuSectionItem();

    console.log(this.menu);
  }
  convertFoodItemToMenuSectionItem(): MenuSection[] {
    this.menuSections.forEach((element, index) => {
      const menuSectionItemList: MenuSectionItem[] = [];
      element.menuId = this.menuID;
      element.order = index + 1;
      element.foodItems.forEach((item, index) => {
        const menuSectionItem: MenuSectionItem = new MenuSectionItem();
        menuSectionItem._id = [new ObjectID()].toString();
        menuSectionItem.foodItemId = item._id;
        menuSectionItem.order = index + 1;
        menuSectionItemList.push(menuSectionItem);
      });
      element.menuSectionItems = menuSectionItemList;
    });
    return this.menuSections;
  }
  convertMenuSectionItemToFoodItem() {
    this.menuSections.forEach((element) => {
      const foodItemList: FoodItem[] = [];
      element.menuSectionItems.forEach((item) => {
        foodItemList.push(
          this.foodItems.filter((element) => element._id == item.foodItemId)[0]
        );
      });
      element.foodItems = foodItemList;
    });
    this.getUnAssignedFoodItems(this.foodItems);
  }

  getUnAssignedFoodItems(activeFoodItems: FoodItem[]) {
    let sectionFoodItems: FoodItem[] = [];
    this.menuSections.forEach((item) => {
      sectionFoodItems.push(...item.foodItems);
    });
    this.foodItems = activeFoodItems.filter(
      (entry1) => !sectionFoodItems.some((entry2) => entry1._id === entry2._id)
    );
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
