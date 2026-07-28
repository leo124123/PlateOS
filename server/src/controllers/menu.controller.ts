import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const getCategoriesWithItems = asyncWrap(async (req: Request, res: Response) => {
  const categories = await MenuService.getCategoriesWithItems();
  return sendSuccess(res, categories, 'Menú obtenido exitosamente');
});
