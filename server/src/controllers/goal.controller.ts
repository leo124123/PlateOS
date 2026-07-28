import { Request, Response } from 'express';
import { GoalService } from '../services/goal.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const getTodayGoal = asyncWrap(async (req: Request, res: Response) => {
  const goal = await GoalService.getTodayGoal();
  return sendSuccess(res, goal, 'Meta del día obtenida');
});
