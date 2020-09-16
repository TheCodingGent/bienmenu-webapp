import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { FoodItem } from 'src/app/models/food-item';
import { ModalService } from 'src/app/services/modal.service';

const foodItems = {
  foodItems: [
    {
      _id: 'abcd',
      name: 'foodItem1',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: 'some-url',
      tags: ['vegetrian', 'spicy'],
      price: 15,
      promotionPrice: 12,
    },
    {
      _id: 'efgh',
      name: 'foodItem2',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: 'some-url',
      tags: ['vegetrian', 'spicy'],
      price: 10,
      promotionPrice: 7,
    },
    {
      _id: 'ijkl',
      name: 'foodItem3',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: 'some-url',
      tags: ['vegetrian', 'spicy'],
      price: 21,
      promotionPrice: 8,
    },
  ],
};

@Component({
  selector: 'app-food-item-manager',
  templateUrl: './food-item-manager.component.html',
  styleUrls: ['./food-item-manager.component.scss'],
})
export class FoodItemManagerComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  foodItems: FoodItem[];

  constructor(private modalService: ModalService) {
    this.foodItems = foodItems.foodItems;
    console.log(this.foodItems);
  }

  ngOnInit(): void {}

  openModal(id: string) {
    this.modalService.open(id);
  }

  onClosedModal(_) {
    this.ngOnInit();
  }
}
