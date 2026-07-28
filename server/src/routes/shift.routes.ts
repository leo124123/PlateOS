import { Router } from 'express';
import { getCurrentShift } from '../controllers/shift.controller.js';

const router = Router();

router.get('/current', getCurrentShift);

export default router;
