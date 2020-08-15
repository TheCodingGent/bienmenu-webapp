import { Menu } from './menu';

export interface Restaurant {
  _id: string;
  name: string;
  country: String;
  province: String;
  city: string;
  postalCode: String;
  address: string;
  phone: string;
  menus: [Menu];
  rating: Number;
  color: string;
}
