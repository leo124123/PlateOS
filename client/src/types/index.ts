export type Role = 'ADMIN' | 'WAITER' | 'KITCHEN' | 'CASHIER';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'ORDER_PENDING' | 'EATING' | 'BILL_REQUESTED' | 'CLEANING';

export type OrderStatus = 'PENDING' | 'ACCEPTED_BY_WAITER' | 'IN_PREPARATION' | 'READY_FOR_DELIVERY' | 'SERVED' | 'PAID' | 'CANCELLED';

export type PaymentMethod = 'CARD' | 'CASH' | 'TRANSFER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  pinCode?: string | null;
  avatarUrl?: string | null;
}

export interface TableItem {
  id: string;
  number: number;
  name: string;
  capacity: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
  shape: 'ROUND' | 'SQUARE' | 'RECTANGLE';
  status: TableStatus;
  currentOrderId?: string | null;
  orders?: Order[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  displayOrder: number;
  items?: MenuItem[];
}

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

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  notes?: string;
  status: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  tableId: string;
  table?: TableItem;
  waiterId?: string;
  waiter?: { id: string; name: string };
  customerName?: string;
  status: OrderStatus;
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  method: PaymentMethod;
  amountPaid: number;
  tipAmount: number;
  createdAt: string;
}

export interface ShiftLog {
  id: string;
  waiterId: string;
  startTime: string;
  endTime?: string;
  totalOrders: number;
  totalSales: number;
  status: 'OPEN' | 'CLOSED';
}

export interface DailyGoal {
  id: string;
  date: string;
  targetSales: number;
  targetOrders: number;
  achievedSales: number;
  achievedOrders: number;
}
