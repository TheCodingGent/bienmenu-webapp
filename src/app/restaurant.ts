import { Menu } from './menu';

export interface Restaurant {
  _id: string;
  name: String;
  city: String;
  address: String;
  menus: [Menu];
  rating: Number;
  color: String;
}
