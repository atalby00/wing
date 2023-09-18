export interface Order {
  id: string;
  items: OrderItem[];
  date: string;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
}
