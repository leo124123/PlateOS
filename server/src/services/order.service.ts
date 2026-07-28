import prisma from '../config/prisma.js';

let mockOrders: any[] = [];

interface OrderItemPayload {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
  name: string;
}

export class OrderService {
  static async createOrder(data: { tableId: string; waiterId?: string; customerName?: string; notes?: string; items: any[] }) {
    let subtotal = 0;
    const itemsData: OrderItemPayload[] = [];

    for (const item of data.items) {
      let price = 25.0;
      let name = 'Platillo Gourmet';
      try {
        const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (menuItem) {
          price = menuItem.price;
          name = menuItem.name;
        }
      } catch (e) {}

      subtotal += price * item.quantity;
      itemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: price,
        notes: item.notes || null,
        name,
      });
    }

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    try {
      // Execute Atomic Database Transaction (ACID)
      const createdOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            tableId: data.tableId,
            waiterId: data.waiterId || null,
            customerName: data.customerName || null,
            notes: data.notes || null,
            subtotal,
            tax,
            total,
            status: 'PENDING',
            items: {
              create: itemsData.map((i) => ({
                menuItemId: i.menuItemId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                notes: i.notes,
              })),
            },
          },
          include: {
            table: true,
            waiter: { select: { id: true, name: true } },
            items: { include: { menuItem: true } },
          },
        });

        // Atomically update Table Status
        await tx.table.update({
          where: { id: data.tableId },
          data: {
            status: 'ORDER_PENDING',
            currentOrderId: order.id,
          },
        });

        return order;
      });

      return createdOrder;
    } catch (e) {
      // Mock fallback for offline/demo environment
      const mockOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: Math.floor(1000 + Math.random() * 9000),
        tableId: data.tableId,
        waiterId: data.waiterId || 'demo-waiter',
        customerName: data.customerName || 'Cliente Salon',
        notes: data.notes || '',
        status: 'PENDING',
        subtotal,
        tax,
        total,
        createdAt: new Date().toISOString(),
        items: itemsData.map((i, idx) => ({
          id: `item-${idx}`,
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          notes: i.notes,
          menuItem: { id: i.menuItemId, name: i.name, price: i.unitPrice },
        })),
        table: { id: data.tableId, number: 1 },
        waiter: { id: 'demo-waiter', name: 'Carlos Mendoza' },
      };
      mockOrders.push(mockOrder);
      return mockOrder;
    }
  }

  static async getKitchenOrders() {
    try {
      return await prisma.order.findMany({
        where: {
          status: { in: ['PENDING', 'ACCEPTED_BY_WAITER', 'IN_PREPARATION', 'READY_FOR_DELIVERY'] },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          table: true,
          waiter: { select: { id: true, name: true } },
          items: { include: { menuItem: true } },
        },
      });
    } catch (e) {
      return mockOrders.filter((o) => ['PENDING', 'ACCEPTED_BY_WAITER', 'IN_PREPARATION', 'READY_FOR_DELIVERY'].includes(o.status));
    }
  }

  static async updateOrderStatus(id: string, status: any) {
    try {
      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { id },
          data: { status },
          include: { table: true, waiter: { select: { id: true, name: true } }, items: { include: { menuItem: true } } },
        });

        if (status === 'SERVED') {
          await tx.table.update({
            where: { id: order.tableId },
            data: { status: 'EATING' },
          });
        } else if (status === 'CANCELLED') {
          await tx.table.update({
            where: { id: order.tableId },
            data: { status: 'AVAILABLE', currentOrderId: null },
          });
        }

        return order;
      });
    } catch (e) {
      const order = mockOrders.find((o) => o.id === id);
      if (order) order.status = status;
      return order || { id, status };
    }
  }
}
