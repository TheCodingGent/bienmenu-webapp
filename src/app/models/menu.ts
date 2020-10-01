import { MenuSection } from './menu-section';

export enum MenuType {
  FileBasedMenu,
  BienMenuMenu,
  ExternalMenuLink,
}

export class Menu {
  _id: string;
  name: string;
  type: MenuType;
  filename: string;
  lastupdated: string;
  sections: MenuSection[];
  isActive: boolean;
  schedule: boolean[];
  externalMenuLink: string;
}
