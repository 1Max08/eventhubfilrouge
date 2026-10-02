import { Router } from 'express';
import {
  createReservationController,
  deleteReservationController,
  getReservation,
  getReservations,
  updateReservationController,
} from '../controllers/reservation.controller.js';

const router = Router();

router.get('/', getReservations);
router.get('/:id', getReservation);
router.post('/', createReservationController);
router.put('/:id', updateReservationController);
router.delete('/:id', deleteReservationController);

export default router;
