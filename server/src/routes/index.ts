import { Router } from 'express';
import authRoutes from './auth.routes.js';
import tableRoutes from './table.routes.js';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import shiftRoutes from './shift.routes.js';
import goalRoutes from './goal.routes.js';
import reservationRoutes from './reservation.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tables', tableRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/shifts', shiftRoutes);
router.use('/goals', goalRoutes);
router.use('/reservations', reservationRoutes);

export default router;
