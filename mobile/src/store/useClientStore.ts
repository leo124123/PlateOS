import { create } from 'zustand';
import { TableItem, Category, Order, MenuItem } from '../types';
import api from '../services/api';
import { getSocket } from '../services/socket';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface ClientState {
  connectedTable: TableItem | null;
  categories: Category[];
  cart: CartItem[];
  customerName: string;
  activeOrder: Order | null;
  isCallWaiterActive: boolean;
  isWaiterOnTheWay: boolean;
  waiterOnTheWayMessage: string | null;
  isConnecting: boolean;
  orderSuccessMessage: string | null;

  connectTable: (tableCode: string) => Promise<boolean>;
  disconnectTable: () => void;
  fetchMenu: () => Promise<void>;
  setCustomerName: (name: string) => void;
  addToCart: (item: MenuItem) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  callWaiter: () => void;
  dismissWaiterOnTheWay: () => void;
  submitOrder: (notes?: string) => Promise<boolean>;
  requestBill: () => Promise<boolean>;
  setActiveOrder: (order: Order | null) => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  connectedTable: null,
  categories: [],
  cart: [],
  customerName: '',
  activeOrder: null,
  isCallWaiterActive: false,
  isWaiterOnTheWay: false,
  waiterOnTheWayMessage: null,
  isConnecting: false,
  orderSuccessMessage: null,

  connectTable: async (tableCode: string) => {
    set({ isConnecting: true });
    try {
      const res = await api.get(`/tables/lookup/${encodeURIComponent(tableCode)}`);
      const tableData: TableItem = res.data.data;
      set({ connectedTable: tableData, isConnecting: false });

      // Connect to Socket room and listen to waiter response
      const socket = getSocket();
      socket.emit('join:room', 'waiters');
      socket.off('waiter:attending_table');
      socket.on('waiter:attending_table', (data: { tableNumber: number; tableId: string }) => {
        const { connectedTable } = get();
        if (connectedTable && (connectedTable.id === data.tableId || connectedTable.number === data.tableNumber)) {
          set({
            isWaiterOnTheWay: true,
            isCallWaiterActive: false,
            waiterOnTheWayMessage: 'El mesero va de camino, espera unos minutos por favor.',
          });
          setTimeout(() => {
            set({ isWaiterOnTheWay: false, waiterOnTheWayMessage: null });
          }, 15000);
        }
      });

      // Fetch Menu
      get().fetchMenu();

      // Check if table has active order
      if (tableData.orders && tableData.orders.length > 0) {
        set({ activeOrder: tableData.orders[0] });
      }

      return true;
    } catch (e) {
      console.error('Error conectando a mesa', e);
      set({ isConnecting: false });
      return false;
    }
  },

  disconnectTable: () => {
    set({ connectedTable: null, cart: [], activeOrder: null });
  },

  fetchMenu: async () => {
    try {
      const res = await api.get('/menu');
      set({ categories: res.data.data });
    } catch (e) {
      console.error('Error cargando menú', e);
    }
  },

  setCustomerName: (name: string) => set({ customerName: name }),

  addToCart: (item: MenuItem) => {
    set((state) => {
      const existing = state.cart.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { menuItem: item, quantity: 1 }] };
    });
  },

  updateCartQuantity: (itemId: string, delta: number) => {
    set((state) => ({
      cart: state.cart
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[],
    }));
  },

  removeFromCart: (itemId: string) => {
    set((state) => ({
      cart: state.cart.filter((i) => i.menuItem.id !== itemId),
    }));
  },

  clearCart: () => set({ cart: [] }),

  dismissWaiterOnTheWay: () => set({ isWaiterOnTheWay: false, waiterOnTheWayMessage: null }),

  callWaiter: () => {
    const { connectedTable } = get();
    if (!connectedTable) return;

    set({ isCallWaiterActive: true });
    const socket = getSocket();
    socket.emit('customer:call_waiter', {
      tableNumber: connectedTable.number,
      tableId: connectedTable.id,
    });

    setTimeout(() => {
      set({ isCallWaiterActive: false });
    }, 5000);
  },

  submitOrder: async (notes?: string) => {
    const { connectedTable, cart, customerName } = get();
    if (!connectedTable || cart.length === 0) return false;

    try {
      const payload = {
        tableId: connectedTable.id,
        customerName: customerName || `Cliente Mesa #${connectedTable.number}`,
        notes: notes || '',
        items: cart.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          notes: i.notes || '',
        })),
      };

      const res = await api.post('/orders', payload);
      const createdOrder: Order = res.data.data;

      const socket = getSocket();
      socket.emit('order:new', createdOrder);

      set({
        activeOrder: createdOrder,
        cart: [],
        orderSuccessMessage: '¡Comanda enviada a cocina con éxito!',
      });

      setTimeout(() => set({ orderSuccessMessage: null }), 3000);
      return true;
    } catch (e) {
      console.error('Error enviando pedido desde app móvil', e);
      return false;
    }
  },

  requestBill: async () => {
    const { connectedTable } = get();
    if (!connectedTable) return false;

    try {
      await api.patch(`/tables/${connectedTable.id}/status`, { status: 'BILL_REQUESTED' });
      const socket = getSocket();
      socket.emit('table:change_status', { tableId: connectedTable.id, status: 'BILL_REQUESTED' });
      set({
        connectedTable: { ...connectedTable, status: 'BILL_REQUESTED' },
      });
      return true;
    } catch (e) {
      console.error('Error pidiendo la cuenta', e);
      return false;
    }
  },

  setActiveOrder: (order: Order | null) => set({ activeOrder: order }),
}));
