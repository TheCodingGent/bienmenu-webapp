import { FoodItem } from './food-item';

export class MenuSectionItem {
  _id: string;
  order: number;
  foodItem: FoodItem;
  menuSectionId: string;
  isActive: boolean;
  quantityLow: boolean;
}
