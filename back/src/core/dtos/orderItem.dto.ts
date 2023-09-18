export class OrderItemDto {
  public item_id: string;
  public quantity: number;
  public name: string;
  public weight: string;

  constructor(item_id: string, quantity: number, name: string, weight: string) {
    this.item_id = item_id;
    this.quantity = quantity;
    this.name = name;
    this.weight = weight;
  }
}
