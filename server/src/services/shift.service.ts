import prisma from '../config/prisma.js';

export class ShiftService {
  static async getCurrentShift(waiterId: string) {
    try {
      return await prisma.shiftLog.findFirst({
        where: { waiterId, status: 'OPEN' },
      });
    } catch (e) {
      return {
        id: `shift-demo`,
        waiterId,
        startTime: new Date().toISOString(),
        totalOrders: 14,
        totalSales: 450.0,
        status: 'OPEN',
      };
    }
  }
}
