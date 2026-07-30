import { Router } from 'express';
import {
  createReservation,
  getReservations,
  updateReservationStatus,
} from '../controllers/reservation.controller.js';

const router = Router();

router.post('/', createReservation);
router.get('/', getReservations);
router.patch('/:id/status', updateReservationStatus);

export default router;
