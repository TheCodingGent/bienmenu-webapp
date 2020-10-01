import { MenuBank } from './menu-bank';

export interface Restaurant {
  _id: string;
  name: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  phone: string;
  // menus: [Menu];
  menuBank: MenuBank;
  rating: Number;
  color: string;
  tracingEnabled: boolean;
  // externalMenuLink: string;
  // hostedInternal: boolean;
  coverPhotoUrl: string;
}
