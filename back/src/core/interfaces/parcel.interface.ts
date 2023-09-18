import { OrderItem } from "./order.interface";

export interface ParcelWithoutTracking {
  order_id: string;
  items: ParcelItem[];
  weight: number;
  palette_number: number;
}

export interface Parcel extends ParcelWithoutTracking {
  tracking_id: number;
}

export interface ParcelItem extends OrderItem {
  name: string;
  weight: number;
}
