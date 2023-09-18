export class OrderItem {
  public item_id: string;
  public quantity: number;

  constructor(item_id: string, quantity: number) {
    this.item_id = item_id;
    this.quantity = quantity;
  }
}
