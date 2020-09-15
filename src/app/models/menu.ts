import { MenuSection } from './menu-section';
import { WeekDay } from '@angular/common';

export interface Menu {
  _id: string;
  name: string;
  type: string;
  filename: string;
  lastupdated: string;
  sections: MenuSection[];
  isActive: boolean;
  schedule: WeekDay[];
}
