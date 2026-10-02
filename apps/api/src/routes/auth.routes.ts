import { Router } from 'express';
import {
  loginController,
  registerController,
} from '../controllers/auth.controller.js';
import {
  authenticateToken,
  type AuthenticatedRequest,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);

router.get('/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({
    message: 'Utilisateur authentifié',
    user: req.user,
  });
});

export default router;
