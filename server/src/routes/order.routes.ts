import { Router } from 'express';
import { createOrder, getKitchenOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';

const router = Router();

router.post('/', validateRequest(createOrderSchema), createOrder);
router.get('/kitchen', getKitchenOrders);
router.patch('/:id/status', validateRequest(updateOrderStatusSchema), updateOrderStatus);

export default router;
