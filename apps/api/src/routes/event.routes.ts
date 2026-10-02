import { Router } from 'express';
import {
  createEventController,
  deleteEventController,
  getEvent,
  getEvents,
  updateEventController,
} from '../controllers/event.controller.js';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEventController);
router.put('/:id', updateEventController);
router.delete('/:id', deleteEventController);

export default router;
