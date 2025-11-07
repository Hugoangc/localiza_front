export interface Order {
  id: number;
  totalPrice: number;
  orderDate: string;
  status: string;
  items: any[];
}
