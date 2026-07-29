import prisma from '../config/prisma.js';

const mockTables = [
  // Row 1 (Z = -8)
  { id: 'tbl-1',  number: 1,  name: 'Mesa 1',  capacity: 4, positionX: -10,  positionY: 0, positionZ: -8, rotationY: 0, shape: 'ROUND',     status: 'AVAILABLE',      currentOrderId: null },
  { id: 'tbl-2',  number: 2,  name: 'Mesa 2',  capacity: 2, positionX: -3.5, positionY: 0, positionZ: -8, rotationY: 0, shape: 'SQUARE',    status: 'ORDER_PENDING',  currentOrderId: 'ord-101' },
  { id: 'tbl-3',  number: 3,  name: 'Mesa 3',  capacity: 6, positionX: 3.5,  positionY: 0, positionZ: -8, rotationY: 0, shape: 'RECTANGLE', status: 'OCCUPIED',       currentOrderId: 'ord-102' },
  { id: 'tbl-4',  number: 4,  name: 'Mesa 4',  capacity: 4, positionX: 10,   positionY: 0, positionZ: -8, rotationY: 0, shape: 'SQUARE',    status: 'BILL_REQUESTED', currentOrderId: 'ord-103' },

  // Row 2 (Z = -2)
  { id: 'tbl-5',  number: 5,  name: 'Mesa 5',  capacity: 2, positionX: -10,  positionY: 0, positionZ: -2, rotationY: 0, shape: 'ROUND',     status: 'EATING',         currentOrderId: 'ord-104' },
  { id: 'tbl-6',  number: 6,  name: 'Mesa 6',  capacity: 4, positionX: -3.5, positionY: 0, positionZ: -2, rotationY: 0, shape: 'SQUARE',    status: 'AVAILABLE',      currentOrderId: null },
  { id: 'tbl-7',  number: 7,  name: 'Mesa 7',  capacity: 8, positionX: 3.5,  positionY: 0, positionZ: -2, rotationY: 0, shape: 'RECTANGLE', status: 'CLEANING',       currentOrderId: null },
  { id: 'tbl-8',  number: 8,  name: 'Mesa 8',  capacity: 4, positionX: 10,   positionY: 0, positionZ: -2, rotationY: 0, shape: 'ROUND',     status: 'AVAILABLE',      currentOrderId: null },

  // Row 3 (Z = 4)
  { id: 'tbl-9',  number: 9,  name: 'Mesa 9',  capacity: 4, positionX: -10,  positionY: 0, positionZ: 4,  rotationY: 0, shape: 'SQUARE',    status: 'AVAILABLE',      currentOrderId: null },
  { id: 'tbl-10', number: 10, name: 'Mesa 10', capacity: 2, positionX: -3.5, positionY: 0, positionZ: 4,  rotationY: 0, shape: 'ROUND',     status: 'OCCUPIED',       currentOrderId: 'ord-105' },
  { id: 'tbl-11', number: 11, name: 'Mesa 11', capacity: 6, positionX: 3.5,  positionY: 0, positionZ: 4,  rotationY: 0, shape: 'RECTANGLE', status: 'ORDER_PENDING',  currentOrderId: 'ord-106' },
  { id: 'tbl-12', number: 12, name: 'Mesa 12', capacity: 4, positionX: 10,   positionY: 0, positionZ: 4,  rotationY: 0, shape: 'SQUARE',    status: 'AVAILABLE',      currentOrderId: null },

  // Row 4 (Z = 9)
  { id: 'tbl-13', number: 13, name: 'Mesa 13', capacity: 2, positionX: -10,  positionY: 0, positionZ: 9,  rotationY: 0, shape: 'ROUND',     status: 'AVAILABLE',      currentOrderId: null },
  { id: 'tbl-14', number: 14, name: 'Mesa 14', capacity: 4, positionX: -3.5, positionY: 0, positionZ: 9,  rotationY: 0, shape: 'SQUARE',    status: 'CLEANING',       currentOrderId: null },
  { id: 'tbl-15', number: 15, name: 'Mesa 15', capacity: 4, positionX: 3.5,  positionY: 0, positionZ: 9,  rotationY: 0, shape: 'SQUARE',    status: 'EATING',         currentOrderId: 'ord-107' },
  { id: 'tbl-16', number: 16, name: 'Mesa 16', capacity: 6, positionX: 10,   positionY: 0, positionZ: 9,  rotationY: 0, shape: 'RECTANGLE', status: 'AVAILABLE',      currentOrderId: null },
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
