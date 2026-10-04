import { Router } from 'express';

import { authenticateToken } from '../middlewares/auth.middleware.js';

import {
  createUserController,
  deleteUserController,
  getUser,
  getUsers,
  updateUserController,
} from '../controllers/user.controller.js';

const router = Router();

// Toutes les routes utilisateurs nécessitent une authentification
router.use(authenticateToken);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
