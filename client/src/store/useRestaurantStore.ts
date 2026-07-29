import { create } from 'zustand';
import { TableItem, Order, Category, ShiftLog, DailyGoal } from '../types';
import api from '../services/api';

interface RestaurantState {
  tables: TableItem[];
  selectedTable: TableItem | null;
  categories: Category[];
  activeOrders: Order[];
  currentShift: ShiftLog | null;
  dailyGoal: DailyGoal | null;
  isOrderModalOpen: boolean;
  isPaymentModalOpen: boolean;
  alertNotification: { message: string; tableNumber: number; orderId: string; tableId?: string } | null;

  fetchTables: () => Promise<void>;
  fetchMenu: () => Promise<void>;
  fetchShift: () => Promise<void>;
  fetchDailyGoal: () => Promise<void>;
  setSelectedTable: (table: TableItem | null) => void;
  openOrderModal: (table: TableItem) => void;
  closeOrderModal: () => void;
  openPaymentModal: (table: TableItem) => void;
  closePaymentModal: () => void;
  setAlertNotification: (alert: { message: string; tableNumber: number; orderId: string; tableId?: string } | null) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  tables: [],
  selectedTable: null,
  categories: [],
  activeOrders: [],
  currentShift: null,
  dailyGoal: null,
  isOrderModalOpen: false,
  isPaymentModalOpen: false,
  alertNotification: null,

  fetchTables: async () => {
    try {
      const res = await api.get('/tables');
      set({ tables: res.data.data });
    } catch (error) {
      console.error('Error cargando mesas', error);
    }
  },

  fetchMenu: async () => {
    try {
      const res = await api.get('/menu');
      set({ categories: res.data.data });
    } catch (error) {
      console.error('Error cargando menú', error);
    }
  },

  fetchShift: async () => {
    try {
      const res = await api.get('/shifts/current');
      set({ currentShift: res.data.data });
    } catch (error) {
      console.error('Error cargando turno', error);
    }
  },

  fetchDailyGoal: async () => {
    try {
      const res = await api.get('/goals/today');
      set({ dailyGoal: res.data.data });
    } catch (error) {
      console.error('Error cargando meta del día', error);
    }
  },

  setSelectedTable: (table) => set({ selectedTable: table }),
  openOrderModal: (table) => set({ selectedTable: table, isOrderModalOpen: true }),
  closeOrderModal: () => set({ isOrderModalOpen: false }),
  openPaymentModal: (table) => set({ selectedTable: table, isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),
  setAlertNotification: (alert) => set({ alertNotification: alert }),
}));
