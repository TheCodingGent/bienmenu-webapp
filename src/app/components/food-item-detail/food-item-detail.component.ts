import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodItem } from 'src/app/models/food-item';
import { Location } from '@angular/common';
import { FoodItemService } from 'src/app/services/food-item.service';

@Component({
  selector: 'app-food-item-detail',
  templateUrl: './food-item-detail.component.html',
  styleUrls: ['./food-item-detail.component.scss'],
})
export class FoodItemDetailComponent implements OnInit {
  foodItem: FoodItem;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private foodItemService: FoodItemService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.foodItemService
      .getFoodItemById(id)
      .subscribe((foodItem) => (this.foodItem = foodItem));
  }

  goBack(): void {
    this.location.back();
  }
}
