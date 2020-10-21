import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectID } from 'bson';
import { map } from 'rxjs/operators';
import { FoodItem } from 'src/app/models/food-item';
import { Menu, MenuType } from 'src/app/models/menu';
import { MenuSection } from 'src/app/models/menu-section';
import { MenuSectionItem } from 'src/app/models/menu-section-item';
import { FoodItemService } from 'src/app/services/food-item.service';
import { MenuService } from 'src/app/services/menu.service';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss'],
})
export class CreateMenuComponent implements OnInit {
  @ViewChild('addFoodItem') addFoodItem;

  private menuID: string;
  private restaurantID: string;
  private menu: Menu;

  isEditMode = false;
  isSelectAllScheduleDays = true;

  public foodItems: FoodItem[] = [];
  public allSectionsList = ['foodItemsList'];

  menuForm: FormGroup;
  ctrlMenuName: FormControl;
  ctrlMenuSections: FormArray;
  ctrlScheduleDays: FormArray;

  scheduleDays = [
    'Monday/Lundi',
    'Tuesday/Mardi',
    'Wednesday/Mercredi',
    'Thursday/Jeudi',
    'Friday/Vendredi',
    'Saturday/Samedi',
    'Sunday/Dimanche',
  ];

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private foodItemService: FoodItemService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.ctrlMenuName = this.fb.control('', Validators.required);
    this.ctrlMenuSections = this.fb.array([]);
    this.ctrlScheduleDays = this.fb.array(
      this.scheduleDays.map(() => this.fb.control(true))
    );
    this.menuForm = this.fb.group({
      ctrlMenuName: this.ctrlMenuName,
      ctrlMenuSections: this.ctrlMenuSections,
      ctrlScheduleDays: this.ctrlScheduleDays,
    });
    this.restaurantID = this.route.snapshot.paramMap.get('id');
    this.menuID = this.route.snapshot.paramMap.get('menuId');
    if (this.menuID && this.menuID !== 'new-menu') {
      this.isEditMode = true;
    } else {
      this.menuID = [new ObjectID()].toString();
      this.createSectionControl(null);
    }
    this.getFoodItems();
  }

  onSubmit(): void {
    if (!this.menuForm.valid) return;

    if (this.isEditMode) {
      Swal.fire({
        title: 'Are you sure you want to Update this Menu?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.createMenuObject();
        }
      });
    } else {
      this.createMenuObject();
    }
  }

  createMenuObject(): void {
    if (!this.menu) {
      this.menu = new Menu();
      this.menu._id = this.menuID;
    }
    this.menu.name = this.ctrlMenuName.value;
    this.menu.isActive = true;
    this.menu.type = MenuType.BienMenuMenu;
    this.menu.lastupdated = new Date().toISOString();
    this.menu.sections = this.convertFoodItemToMenuSectionItem();
    this.menu.schedule = this.ctrlScheduleDays.value;

    this.menuService
      .addMenuForRestaurant(this.restaurantID, this.menu)
      .subscribe(
        (data) => {
          this.router.navigate(['/user']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  addSection() {
    this.createSectionControl(null);
  }

  initSection(menuSection: MenuSection): FormGroup {
    if (menuSection) {
      this.allSectionsList.push(menuSection._id);
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
      const generatedID = [new ObjectID()].toString();
      this.allSectionsList.push(generatedID);
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

  onSectionRemoved(section) {
    const removedFood: FoodItem[] = [];
    section.currentform.controls.foodItems.value.map((element: FoodItem) => {
      element.isActive = true;
      removedFood.push(element);
    });

    this.foodItems.push(...removedFood);
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

  convertFoodItemToMenuSectionItem(): MenuSection[] {
    let menuSections: MenuSection[] = [];
    this.ctrlMenuSections.controls.forEach(
      (element: FormGroup, index: number) => {
        let menuSection: MenuSection = new MenuSection();
        const menuSectionItemList: MenuSectionItem[] = [];
        menuSection._id = element.controls._id.value;
        menuSection.menuId = this.menuID;
        menuSection.name = element.controls.name.value;
        menuSection.order = index + 1;
        menuSection.isActive = true;
        element.controls.foodItems.value.forEach(
          (item: FoodItem, index: number) => {
            const menuSectionItem: MenuSectionItem = new MenuSectionItem();
            menuSectionItem._id = [new ObjectID()].toString();
            menuSectionItem.foodItem = item;
            menuSectionItem.isActive = item.isActive;
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
        const currentFood = this.foodItems.filter(
          (element) => element._id == item.foodItem._id
        )[0];
        currentFood.isActive = item.isActive;
        foodItemList.push(currentFood);
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

  get scheduleDaysControl() {
    return (this.menuForm.get('ctrlScheduleDays') as FormArray).controls;
  }

  getMenu(_menuID: string): void {
    this.menuService.getMenu(_menuID).subscribe((data) => {
      if (data) {
        console.log(data);
        this.menu = data;
      }
      this.ctrlMenuName.setValue(this.menu.name);
      this.convertMenuSectionItemToFoodItem(this.menu.sections);
      this.ctrlScheduleDays.setValue(this.menu.schedule);
      this.checkIfAllSelected();
      this.menu.sections.forEach((item) => {
        this.createSectionControl(item);
      });
    });
  }

  getFoodItems(): void {
    this.foodItemService
      .getFoodItemsForUser()
      .pipe(
        map((data) => {
          data.foodItems.map((item) => (item.isActive = true));
          return data;
        })
      )
      .subscribe((data) => {
        console.log(data.foodItems);
        if (data) {
          this.foodItems = data.foodItems;
        }
        if (this.isEditMode) {
          this.getMenu(this.menuID);
        }
      });
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
    if (this.foodItems[event.currentIndex])
      this.foodItems[event.currentIndex].isActive = true;
  }

  isAnySectionEmpty(): boolean {
    let isEmpty: boolean = false;
    if (this.ctrlMenuSections) {
    }
    this.ctrlMenuSections.controls.forEach((element: FormGroup) => {
      if (element.controls && element.controls.foodItems.value.length === 0) {
        isEmpty = true;
        return;
      }
    });
    return isEmpty;
  }

  selectAllScheduleDays(): void {
    this.isSelectAllScheduleDays = !this.isSelectAllScheduleDays;

    if (this.isSelectAllScheduleDays) {
      this.scheduleDaysControl.map((control) => control.setValue(true));
    } else {
      this.scheduleDaysControl.map((control) => control.setValue(false));
    }
  }

  checkIfAllSelected() {
    this.isSelectAllScheduleDays = this.scheduleDaysControl.every(function (
      item: any
    ) {
      return item.value == true;
    });
  }

  checkShcedulDaysSelected(): boolean {
    return this.scheduleDaysControl.some(function (item: any) {
      return item.value == true;
    });
  }
}
