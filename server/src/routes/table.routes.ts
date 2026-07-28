import { Router } from 'express';
import { getTables, updateTableStatus, updateTablePosition } from '../controllers/table.controller.js';

const router = Router();

router.get('/', getTables);
router.patch('/:id/status', updateTableStatus);
router.patch('/:id/position', updateTablePosition);

export default router;
