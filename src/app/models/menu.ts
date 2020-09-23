import { MenuSection } from './menu-section';
import { WeekDay } from '@angular/common';

export class Menu {
  _id: string;
  name: string;
  type: string;
  filename: string;
  lastupdated: string;
  sections: MenuSection[];
  isActive: boolean;
  schedule: boolean[];
}
