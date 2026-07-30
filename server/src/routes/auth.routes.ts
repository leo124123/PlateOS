import { Router } from 'express';
import { loginWithEmail, loginWithPin, getMe, getWaiters } from '../controllers/auth.controller.js';
import { authenticateJwt } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { loginEmailSchema, loginPinSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', authRateLimiter, validateRequest(loginEmailSchema), loginWithEmail);
router.post('/login-pin', authRateLimiter, validateRequest(loginPinSchema), loginWithPin);
router.get('/me', authenticateJwt, getMe);
router.get('/waiters', getWaiters);

export default router;
