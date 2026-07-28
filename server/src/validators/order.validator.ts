import { z } from 'zod';

export const createOrderSchema = z.object({
  tableId: z.string().min(1, 'El ID de la mesa es requerido'),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1, 'ID de platillo requerido'),
      quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
      notes: z.string().optional(),
    })
  ).min(1, 'Debe incluir al menos un platillo en el pedido'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'ACCEPTED_BY_WAITER',
    'IN_PREPARATION',
    'READY_FOR_DELIVERY',
    'SERVED',
    'PAID',
    'CANCELLED',
  ]),
});
