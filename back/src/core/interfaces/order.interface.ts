export interface Order {
  id: string;
  items: OrderItem[];
  date: Date;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
}
