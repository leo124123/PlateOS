import prisma from '../config/prisma.js';

export class GoalService {
  static async getTodayGoal() {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      let goal = await prisma.dailyGoal.findUnique({ where: { date: todayStr } });
      if (!goal) {
        goal = await prisma.dailyGoal.create({
          data: { date: todayStr, targetSales: 5000, targetOrders: 100, achievedSales: 1250, achievedOrders: 22 },
        });
      }
      return goal;
    } catch (e) {
      return {
        id: 'goal-demo',
        date: todayStr,
        targetSales: 5000,
        targetOrders: 100,
        achievedSales: 1850,
        achievedOrders: 28,
      };
    }
  }
}
