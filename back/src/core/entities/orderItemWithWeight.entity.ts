import { OrderItem } from "./orderItem.entity";

export class OrderItemWithWeight extends OrderItem {
  public item_weight: number;

  constructor(item_id: string, quantity: number, item_weight: number) {
    super(item_id, quantity);
    this.item_weight = item_weight;
  }
}
