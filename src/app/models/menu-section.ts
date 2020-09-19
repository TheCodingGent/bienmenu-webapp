import { FoodItem } from './food-item';
import { MenuSectionItem } from './menu-section-item';

export class MenuSection {
  _id: string;
  menuId: string;
  name: string;
  order: number;
  menuSectionItems: MenuSectionItem[];
  isActive: boolean;
  foodItems: FoodItem[];
}
