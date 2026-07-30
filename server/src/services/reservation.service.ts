import prisma from '../config/prisma.js';

export interface CreateReservationInput {
  tableNumber: number;
  tableId?: string;
  customerName?: string;
  guests: number;
  date: string;
  time: string;
  notes?: string;
}

export class ReservationService {
  private static mockReservations: any[] = [
    {
      id: 'res-demo-1',
      tableNumber: 3,
      customerName: 'Familia Ramírez',
      guests: 4,
      date: new Date().toISOString().split('T')[0],
      time: '20:30',
      notes: 'Aniversario de bodas, mesa cerca del ventanal',
      status: 'PENDING',
      adminMessage: null,
      createdAt: new Date().toISOString(),
    },
  ];

  static async createReservation(data: CreateReservationInput) {
    try {
      const reservation = await prisma.reservation.create({
        data: {
          tableNumber: data.tableNumber,
          tableId: data.tableId || null,
          customerName: data.customerName || `Cliente Mesa #${data.tableNumber}`,
          guests: data.guests,
          date: data.date,
          time: data.time,
          notes: data.notes || '',
          status: 'PENDING',
        },
      });
      return reservation;
    } catch (e) {
      // Mock fallback if DB schema not migrated yet
      const newRes = {
        id: `res-${Date.now()}`,
        tableNumber: data.tableNumber,
        tableId: data.tableId || `tbl-${data.tableNumber}`,
        customerName: data.customerName || `Cliente Mesa #${data.tableNumber}`,
        guests: data.guests,
        date: data.date,
        time: data.time,
        notes: data.notes || '',
        status: 'PENDING',
        adminMessage: null,
        createdAt: new Date().toISOString(),
      };
      this.mockReservations.unshift(newRes);
      return newRes;
    }
  }

  static async getReservations() {
    try {
      const list = await prisma.reservation.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (list.length > 0) return list;
    } catch (e) {
      // Fallback below
    }
    return this.mockReservations;
  }

  static async updateReservationStatus(id: string, status: string, adminMessage?: string) {
    try {
      const updated = await prisma.reservation.update({
        where: { id },
        data: {
          status,
          adminMessage: adminMessage || null,
        },
      });
      return updated;
    } catch (e) {
      // Mock fallback
      const found = this.mockReservations.find((r) => r.id === id);
      if (found) {
        found.status = status;
        found.adminMessage = adminMessage || null;
        return found;
      }
      return {
        id,
        status,
        adminMessage: adminMessage || null,
        tableNumber: 1,
        time: '20:30',
        guests: 2,
      };
    }
  }
}
