import prisma from '../config/prisma.js';

const mockTables = [
  { id: 'tbl-1', number: 1, name: 'Mesa 1', capacity: 2, positionX: -6, positionY: 0, positionZ: -6, rotationY: 0, shape: 'ROUND', status: 'AVAILABLE', orders: [] },
  { id: 'tbl-2', number: 2, name: 'Mesa 2', capacity: 4, positionX: 0, positionY: 0, positionZ: -6, rotationY: 0, shape: 'SQUARE', status: 'OCCUPIED', orders: [] },
  { id: 'tbl-3', number: 3, name: 'Mesa 3', capacity: 4, positionX: 6, positionY: 0, positionZ: -6, rotationY: 0, shape: 'ROUND', status: 'ORDER_PENDING', orders: [] },
  { id: 'tbl-4', number: 4, name: 'Mesa 4', capacity: 6, positionX: -6, positionY: 0, positionZ: 0, rotationY: 0, shape: 'RECTANGLE', status: 'EATING', orders: [] },
  { id: 'tbl-5', number: 5, name: 'Mesa 5', capacity: 4, positionX: 0, positionY: 0, positionZ: 0, rotationY: 0, shape: 'SQUARE', status: 'BILL_REQUESTED', orders: [] },
  { id: 'tbl-6', number: 6, name: 'Mesa 6', capacity: 2, positionX: 6, positionY: 0, positionZ: 0, rotationY: 0, shape: 'ROUND', status: 'CLEANING', orders: [] },
  { id: 'tbl-7', number: 7, name: 'Mesa VIP 7', capacity: 8, positionX: -4, positionY: 0, positionZ: 6, rotationY: 0, shape: 'RECTANGLE', status: 'AVAILABLE', orders: [] },
  { id: 'tbl-8', number: 8, name: 'Mesa VIP 8', capacity: 4, positionX: 4, positionY: 0, positionZ: 6, rotationY: 0, shape: 'SQUARE', status: 'AVAILABLE', orders: [] },
];

export class TableService {
  static async getAllTables() {
    try {
      return await prisma.table.findMany({
        orderBy: { number: 'asc' },
        include: {
          orders: {
            where: { status: { notIn: ['PAID', 'CANCELLED'] } },
            include: { items: { include: { menuItem: true } } },
          },
        },
      });
    } catch (error) {
      return mockTables;
    }
  }

  static async updateTableStatus(id: string, status: any, currentOrderId?: string) {
    try {
      return await prisma.table.update({
        where: { id },
        data: {
          status,
          ...(currentOrderId !== undefined && { currentOrderId }),
        },
      });
    } catch (error) {
      const table = mockTables.find((t) => t.id === id || String(t.number) === id);
      if (table) table.status = status;
      return table || { id, status };
    }
  }

  static async updateTablePosition(id: string, pos: { positionX: number; positionY: number; positionZ: number; rotationY: number }) {
    try {
      return await prisma.table.update({
        where: { id },
        data: pos,
      });
    } catch (error) {
      const table = mockTables.find((t) => t.id === id);
      if (table) Object.assign(table, pos);
      return table || { id, ...pos };
    }
  }
}
