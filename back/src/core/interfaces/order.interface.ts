export interface Order {
  id: string;
  items: OrderItem[];
  date: string;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
  weight?: number;
  name?: string;
}

export type OrderItemWithWeight = OrderItem & {
  item_weight: number;
};
