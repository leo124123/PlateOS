import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const processPayment = asyncWrap(async (req: any, res: Response) => {
  const { orderId, customerName, method, tipAmount } = req.body;
  const processedById = req.user?.id || 'cashier-demo';
  const payment = await PaymentService.processPayment({ orderId, customerName, method, tipAmount, processedById });
  return sendSuccess(res, payment, 'Pago procesado exitosamente', 201);
});
