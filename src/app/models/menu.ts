import { MenuSection } from './menu-section';

export enum MenuType {
  BieMenuFileMenu,
  BieMenuMenu,
  ExternalFileMenu,
}

export class Menu {
  _id: string;
  name: string;
  type: number;
  filename: string;
  lastupdated: string;
  sections: MenuSection[];
  isActive: boolean;
  schedule: boolean[];
}
