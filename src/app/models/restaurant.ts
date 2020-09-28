import { Menu } from './menu';

export interface Restaurant {
  _id: string;
  name: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  phone: string;
  menus: [Menu];
  rating: Number;
  color: string;
  tracingEnabled: boolean;
  externalMenuLink: string;
  hostedInternal: boolean;
  coverPhotoUrl: string;
}
