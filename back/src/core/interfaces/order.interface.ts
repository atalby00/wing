export interface Order {
  id: string;
  items: OrderItem[];
  order_date: Date;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
}
