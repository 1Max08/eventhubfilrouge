import { Router } from 'express';

import { authenticateToken } from '../middlewares/auth.middleware.js';

import {
  createEventController,
  deleteEventController,
  getEvent,
  getEvents,
  updateEventController,
} from '../controllers/event.controller.js';

const router = Router();

// Routes publiques
router.get('/', getEvents);
router.get('/:id', getEvent);

// Routes protégées
router.post('/', authenticateToken, createEventController);
router.put('/:id', authenticateToken, updateEventController);
router.delete('/:id', authenticateToken, deleteEventController);

export default router;
