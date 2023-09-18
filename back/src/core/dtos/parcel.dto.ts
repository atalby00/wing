import { OrderItemDto } from "./orderItem.dto";

export class ParcelDto {
  public order_id: string;
  public items: OrderItemDto[];
  public palette_number: number;
  public weight: number;
  public tracking_id: number;

  constructor(
    order_id: string,
    items: OrderItemDto[],
    palette_number: number,
    weight: number,
    tracking_id: number
  ) {
    this.order_id = order_id;
    this.palette_number = palette_number;
    this.items = items;
    this.weight = weight;
    this.tracking_id = tracking_id;
  }

  static calculateEarnings(weight: number) {
    if (weight <= 1) return 1;
    if (weight <= 5) return 2;
    if (weight <= 10) return 3;
    if (weight <= 20) return 5;
    return 10;
  }
}
