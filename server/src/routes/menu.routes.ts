import { Router } from 'express';
import { getCategoriesWithItems } from '../controllers/menu.controller.js';

const router = Router();

router.get('/', getCategoriesWithItems);

export default router;
