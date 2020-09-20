import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ObjectID } from 'bson';
import { Subscription } from 'rxjs';
import { FoodItem } from 'src/app/models/food-item';
import { Menu } from 'src/app/models/menu';
import { MenuSection } from 'src/app/models/menu-section';
import { MenuSectionItem } from 'src/app/models/menu-section-item';
import { FoodItemService } from 'src/app/services/food-item.service';
import { MenuService } from 'src/app/services/menu.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss'],
})
export class CreateMenuComponent implements OnInit, OnDestroy {
  @ViewChild('addFoodItem') addFoodItem;

  private routeSub: Subscription;
  private menuID: string;
  private menu: Menu;
  public foodItems: FoodItem[];
  private isEditMode = false;

  menuForm: FormGroup;
  ctrlMenuName: FormControl;
  ctrlMenuSections: FormArray;

  // allSectionsList = ['foodItemsList', ...this.menuSections.map((_) => _._id)];
  allSectionsList = ['foodItemsList'];
  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private foodItemService: FoodItemService,
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.ctrlMenuName = this.fb.control('', Validators.required);
    this.ctrlMenuSections = this.fb.array([]);
    this.menuForm = this.fb.group({
      ctrlMenuName: this.ctrlMenuName,
      ctrlMenuSections: this.ctrlMenuSections,
    });

    this.routeSub = this.route.queryParams.subscribe((params) => {
      if (params['menuID']) {
        this.menuID = params['menuID'];
        this.isEditMode = true;
      } else {
        this.menuID = [new ObjectID()].toString();
        this.createSectionControl(null);
      }
      this.getFoodItems();
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  initSection(menuSection: MenuSection): FormGroup {
    const generatedID = [new ObjectID()].toString();
    this.allSectionsList.push(generatedID);

    if (menuSection) {
      return this.fb.group({
        _id: menuSection._id,
        menuId: menuSection.menuId,
        name: [menuSection.name, [Validators.required]],
        order: menuSection.order,
        menuSectionItems: menuSection.menuSectionItems,
        isActive: menuSection.isActive,
        foodItems: [menuSection.foodItems],
      });
    } else {
      return this.fb.group({
        _id: generatedID,
        menuId: this.menuID,
        name: ['', [Validators.required]],
        order: this.ctrlMenuSections.length + 1,
        menuSectionItems: [[]],
        isActive: true,
        foodItems: [[]],
      });
    }
  }
  createSectionControl(menuSection: MenuSection) {
    const control = <FormArray>this.menuForm.controls['ctrlMenuSections'];
    const addrCtrl = this.initSection(menuSection);
    control.push(addrCtrl);
  }

  getMenu(_menuID: string): void {
    this.menuService.getMenu(_menuID).subscribe((data) => {
      if (data) {
        this.menu = data;
      }
      this.ctrlMenuName.setValue(this.menu.name);
      this.convertMenuSectionItemToFoodItem(this.menu.sections);
      this.menu.sections.forEach((item) => {
        this.createSectionControl(item);
      });
    });
  }

  getFoodItems(): void {
    // this.menuService.getFoodItems().subscribe((data) => {
    //   if (data) {
    //     this.foodItems = data;
    //   }
    //   if (this.isEditMode) {
    //     this.getMenu(this.menuID);
    //   }
    // });
    this.foodItemService.getFoodItemsForUser().subscribe((data) => {
      if (data) {
        this.foodItems = data.foodItems;
      }
      if (this.isEditMode) {
        this.getMenu(this.menuID);
      }
    });
  }

  addSection() {
    this.createSectionControl(null);
  }

  onSectionRemoved(section) {
    this.foodItems.push(...section.currentform.controls.foodItems.value);
    this.allSectionsList = this.allSectionsList.filter(
      (arrayItem) => arrayItem !== section.currentform.controls._id.value
    );
    const control = <FormArray>this.menuForm.controls['ctrlMenuSections'];
    control.removeAt(section.index);
  }

  openFoodItemModal(id: string, foodItem?: any) {
    if (foodItem) {
      this.addFoodItem.isEditing = true;
      this.addFoodItem.currentFoodItem = foodItem;
    }
    this.modalService.open(id);
  }

  onClosedModal(foodItem: FoodItem) {
    if (foodItem) {
      const i = this.foodItems.findIndex((item) => item._id === foodItem._id);
      // replace if exists
      if (i > -1) this.foodItems[i] = foodItem;
      // add if does not exist
      else this.foodItems.push(foodItem);
    }
  }

  onSubmit(): void {
    this.createMenuObject();
  }

  createMenuObject(): void {
    if (!this.menu) {
      this.menu = new Menu();
      this.menu._id = this.menuID;
    }
    this.menu.name = this.ctrlMenuName.value;
    this.menu.isActive = true;
    this.menu.lastupdated = new Date().toLocaleString();
    this.menu.sections = this.convertFoodItemToMenuSectionItem();

    console.log(this.menu);
  }
  convertFoodItemToMenuSectionItem(): MenuSection[] {
    let menuSections: MenuSection[] = [];
    this.ctrlMenuSections.controls.forEach(
      (element: FormGroup, index: number) => {
        let menuSection: MenuSection = new MenuSection();
        const menuSectionItemList: MenuSectionItem[] = [];
        menuSection.menuId = this.menuID;
        menuSection.order = index + 1;
        element.controls.foodItems.value.forEach(
          (item: FoodItem, index: number) => {
            const menuSectionItem: MenuSectionItem = new MenuSectionItem();
            menuSectionItem._id = [new ObjectID()].toString();
            menuSectionItem.foodItemId = item._id;
            menuSectionItem.order = index + 1;
            menuSectionItemList.push(menuSectionItem);
          }
        );
        menuSection.menuSectionItems = menuSectionItemList;
        menuSections.push(menuSection);
      }
    );
    return menuSections;
  }
  convertMenuSectionItemToFoodItem(menuSections: MenuSection[]) {
    menuSections.forEach((element) => {
      const foodItemList: FoodItem[] = [];
      element.menuSectionItems.forEach((item) => {
        foodItemList.push(
          this.foodItems.filter((element) => element._id == item.foodItemId)[0]
        );
      });
      element.foodItems = foodItemList;
    });
    this.getUnAssignedFoodItems(menuSections);
  }

  getUnAssignedFoodItems(menuSections: MenuSection[]) {
    let sectionFoodItems: FoodItem[] = [];
    let activeFoodItems = this.foodItems;
    menuSections.forEach((item) => {
      sectionFoodItems.push(...item.foodItems);
    });
    this.foodItems = activeFoodItems.filter(
      (entry1) => !sectionFoodItems.some((entry2) => entry1._id === entry2._id)
    );
  }

  getSectionControls() {
    return (this.menuForm.get('ctrlMenuSections') as FormArray).controls;
  }

  getSectionControlsIndex(index: number) {
    return (this.menuForm.get('ctrlMenuSections') as FormArray).controls[index];
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
