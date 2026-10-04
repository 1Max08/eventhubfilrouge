import { Router } from 'express';

import { authenticateToken } from '../middlewares/auth.middleware.js';

import {
  createReservationController,
  deleteReservationController,
  getReservation,
  getReservations,
  updateReservationController,
} from '../controllers/reservation.controller.js';

const router = Router();

// Toutes les routes de réservation nécessitent une authentification
router.get('/', authenticateToken, getReservations);
router.get('/:id', authenticateToken, getReservation);

router.post('/', authenticateToken, createReservationController);
router.put('/:id', authenticateToken, updateReservationController);
router.delete('/:id', authenticateToken, deleteReservationController);

export default router;
