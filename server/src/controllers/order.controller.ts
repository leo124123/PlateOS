import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const createOrder = asyncWrap(async (req: any, res: Response) => {
  const { tableId, items, customerName, notes } = req.body;
  const waiterId = req.user?.id;
  const order = await OrderService.createOrder({ tableId, waiterId, customerName, notes, items });
  return sendSuccess(res, order, 'Pedido creado y enviado a cocina', 201);
});

export const getKitchenOrders = asyncWrap(async (req: Request, res: Response) => {
  const orders = await OrderService.getKitchenOrders();
  return sendSuccess(res, orders, 'Pedidos de cocina obtenidos');
});

export const updateOrderStatus = asyncWrap(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await OrderService.updateOrderStatus(id, status);
  return sendSuccess(res, updated, `Estado del pedido actualizado a ${status}`);
});
