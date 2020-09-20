import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { FoodItem } from 'src/app/models/food-item';
import { FoodItemService } from 'src/app/services/food-item.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-food-item-manager',
  templateUrl: './food-item-manager.component.html',
  styleUrls: ['./food-item-manager.component.scss'],
})
export class FoodItemManagerComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('addFoodItem') addFoodItem;

  foodItems: FoodItem[];

  constructor(
    private modalService: ModalService,
    private foodItemService: FoodItemService
  ) {}

  ngOnInit(): void {
    this.getUserFoodItems();
  }

  openModal(id: string, foodItem?: any) {
    if (foodItem) {
      this.addFoodItem.isEditing = true;
      this.addFoodItem.currentFoodItem = foodItem;
    }
    this.modalService.open(id);
  }

  onClosedModal(foodItem: FoodItem) {
    if (foodItem) {
      const index = this.foodItems.findIndex(
        (item) => item._id === foodItem._id
      );
      // replace if exists
      if (index > -1) this.foodItems[index] = foodItem;
      // add if does not exist
      else this.foodItems.push(foodItem);
    }
  }

  getUserFoodItems(): void {
    this.foodItemService
      .getFoodItemsForUser()
      .subscribe((data) => (this.foodItems = data.foodItems));
  }

  deleteFoodItem(foodItem: FoodItem) {
    const index = this.foodItems.findIndex((item) => item._id === foodItem._id);
    if (index > -1) {
      this.foodItems.splice(index, 1);
      // delete food item from database
      this.foodItemService
        .deletFoodItemById(foodItem._id)
        .subscribe((data) => console.log(data));
    }
  }
}
