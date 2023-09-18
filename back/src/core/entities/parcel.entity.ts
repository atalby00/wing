import { OrderItem } from "../interfaces/order.interface";

export class Parcel {
  public order_id: string;
  public items: OrderItem[];
  public palette_number: number;
  public weight: number;

  constructor(
    order_id: string,
    items: OrderItem[],
    palette_number: number,
    weight: number
  ) {
    this.order_id = order_id;
    this.palette_number = palette_number;
    this.items = items;
    this.weight = weight;
  }

  static generateTrackingCode() {
    const min = 100000000;
    const max = 110000000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static calculateEarnings(weight: number) {
    if (weight <= 1) return 1;
    if (weight <= 5) return 2;
    if (weight <= 10) return 3;
    if (weight <= 20) return 5;
    return 10;
  }
}
