import { OrderItem } from "./order.interface";

export interface Parcel {
  order_id: string;
  items: OrderItem[];
  weight: number;
  palette_number: number;
  tracking_id: number;
}
