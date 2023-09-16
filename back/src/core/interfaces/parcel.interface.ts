import { OrderItem } from "./order.interface";

export interface Parcel {
  order_id: string;
  items: OrderItem[];
  weight: number;
  tracking_id: number;
  palette_number: number;
}
