import { Router } from 'express';
import { getTables, updateTableStatus, updateTablePosition, getTableByCode } from '../controllers/table.controller.js';

const router = Router();

router.get('/', getTables);
router.get('/lookup/:code', getTableByCode);
router.patch('/:id/status', updateTableStatus);
router.patch('/:id/position', updateTablePosition);

export default router;
