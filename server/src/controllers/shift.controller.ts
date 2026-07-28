import { Request, Response } from 'express';
import { ShiftService } from '../services/shift.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const getCurrentShift = asyncWrap(async (req: any, res: Response) => {
  const waiterId = req.user?.id || 'demo-waiter';
  const shift = await ShiftService.getCurrentShift(waiterId);
  return sendSuccess(res, shift, 'Estado del turno actual');
});
