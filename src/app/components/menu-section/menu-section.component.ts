import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FoodItem } from '../../models/food-item';

@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss'],
})
export class MenuSectionComponent implements OnInit {
  @Input() index;
  @Input() allSectionsList;
  @Input() sectionForm: FormGroup;
  @Input() isUpdate;
  @Output() sectionRemoved = new EventEmitter<{
    currentform: FormGroup;
    index: number;
  }>();

  constructor() {}

  ngOnInit(): void {}

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
  removeSection() {
    this.sectionRemoved.emit({
      currentform: this.sectionForm,
      index: this.index,
    });
  }
  disableItem(item) {
    let index = this.sectionForm.controls.foodItems.value.indexOf(item);
    item.isActive = false;
    this.sectionForm.controls.foodItems.value[index] = item;
  }

  enableItem(item) {
    let index = this.sectionForm.controls.foodItems.value.indexOf(item);
    item.isActive = true;
    this.sectionForm.controls.foodItems.value[index] = item;
  }
}
