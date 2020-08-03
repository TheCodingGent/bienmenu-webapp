import { Menu } from './menu';

export interface Restaurant {
  _id: string;
  name: string;
  city: string;
  address: string;
  menus: [Menu];
  maxMenuCount: Number;
  rating: Number;
  color: string;
}
