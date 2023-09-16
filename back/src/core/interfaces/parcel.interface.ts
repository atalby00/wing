import { OrderItem } from "./order.interface";

export interface ParcelWithoutTrackingId {
  order_id: string;
  items: OrderItem[];
  weight: number;
  palette_number: number;
}

export interface Parcel extends ParcelWithoutTrackingId {
  tracking_id: number;
}
