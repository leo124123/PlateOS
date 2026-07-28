import { Router } from 'express';
import { getTodayGoal } from '../controllers/goal.controller.js';

const router = Router();

router.get('/today', getTodayGoal);

export default router;
