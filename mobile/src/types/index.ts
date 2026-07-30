export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'ORDER_PENDING' | 'EATING' | 'BILL_REQUESTED' | 'CLEANING';

export type OrderStatus = 'PENDING' | 'ACCEPTED_BY_WAITER' | 'IN_PREPARATION' | 'READY_FOR_DELIVERY' | 'SERVED' | 'PAID' | 'CANCELLED';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  displayOrder: number;
  items?: MenuItem[];
}

export interface OrderItem {
  id?: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  tableId: string;
  customerName?: string;
  status: OrderStatus;
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface TableItem {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string | null;
  orders?: Order[];
}
