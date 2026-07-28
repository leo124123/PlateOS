import { Request, Response } from 'express';
import { TableService } from '../services/table.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const getTables = asyncWrap(async (req: Request, res: Response) => {
  const tables = await TableService.getAllTables();
  return sendSuccess(res, tables, 'Mesas obtenidas exitosamente');
});

export const updateTableStatus = asyncWrap(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, currentOrderId } = req.body;
  const updated = await TableService.updateTableStatus(id, status, currentOrderId);
  return sendSuccess(res, updated, 'Estado de mesa actualizado');
});

export const updateTablePosition = asyncWrap(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { positionX, positionY, positionZ, rotationY } = req.body;
  const updated = await TableService.updateTablePosition(id, { positionX, positionY, positionZ, rotationY });
  return sendSuccess(res, updated, 'Posición 3D de mesa actualizada');
});
