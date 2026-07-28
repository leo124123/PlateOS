import prisma from '../config/prisma.js';

const mockTables = [
  { id: 'tbl-1', number: 1, name: 'Mesa 1 (Sala)', capacity: 4, positionX: -7, positionY: 0, positionZ: -7, rotationY: 0, shape: 'ROUND', status: 'AVAILABLE', currentOrderId: null },
  { id: 'tbl-2', number: 2, name: 'Mesa 2 (Sala)', capacity: 2, positionX: -3, positionY: 0, positionZ: -8, rotationY: 0, shape: 'SQUARE', status: 'ORDER_PENDING', currentOrderId: 'ord-101' },
  { id: 'tbl-3', number: 3, name: 'Mesa 3 (Terraza)', capacity: 6, positionX: 7, positionY: 0, positionZ: -7, rotationY: 0, shape: 'RECTANGLE', status: 'OCCUPIED', currentOrderId: 'ord-102' },
  { id: 'tbl-4', number: 4, name: 'Mesa 4 (Terraza)', capacity: 4, positionX: 3, positionY: 0, positionZ: -8, rotationY: 0, shape: 'SQUARE', status: 'BILL_REQUESTED', currentOrderId: 'ord-103' },
  { id: 'tbl-5', number: 5, name: 'Mesa 5 (Bar)', capacity: 2, positionX: -7, positionY: 0, positionZ: 7, rotationY: 0, shape: 'ROUND', status: 'EATING', currentOrderId: 'ord-104' },
  { id: 'tbl-6', number: 6, name: 'Mesa 6 (Bar)', capacity: 4, positionX: -3, positionY: 0, positionZ: 8, rotationY: 0, shape: 'SQUARE', status: 'AVAILABLE', currentOrderId: null },
  { id: 'tbl-7', number: 7, name: 'Mesa 7 (VIP)', capacity: 8, positionX: 7, positionY: 0, positionZ: 7, rotationY: 0, shape: 'RECTANGLE', status: 'CLEANING', currentOrderId: null },
  { id: 'tbl-8', number: 8, name: 'Mesa 8 (VIP)', capacity: 4, positionX: 3, positionY: 0, positionZ: 8, rotationY: 0, shape: 'ROUND', status: 'AVAILABLE', currentOrderId: null },
];

export class TableService {
  static async getAllTables() {
    try {
      const dbTables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
      if (dbTables.length > 0) return dbTables;
      return mockTables;
    } catch (e) {
      return mockTables;
    }
  }

  static async updateTableStatus(id: string, status: any) {
    try {
      return await prisma.table.update({
        where: { id },
        data: { status },
      });
    } catch (e) {
      const tbl = mockTables.find((t) => t.id === id);
      if (tbl) tbl.status = status;
      return tbl || { id, status };
    }
  }

  static async updateTablePosition(id: string, coords: { positionX?: number; positionY?: number; positionZ?: number; rotationY?: number }) {
    try {
      return await prisma.table.update({
        where: { id },
        data: coords,
      });
    } catch (e) {
      const tbl = mockTables.find((t) => t.id === id);
      if (tbl) Object.assign(tbl, coords);
      return tbl || { id, ...coords };
    }
  }
}
