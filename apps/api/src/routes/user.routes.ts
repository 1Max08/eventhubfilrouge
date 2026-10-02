import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  getUser,
  getUsers,
  updateUserController,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
