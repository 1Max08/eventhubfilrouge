import type { Request, Response } from 'express';
import {
  createNewReservation,
  deleteExistingReservation,
  getAllReservations,
  getReservationById,
  updateExistingReservation,
} from '../services/reservation.service.js';

export async function getReservations(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const reservations = await getAllReservations();

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);

    res.status(500).json({
      message: 'Impossible de récupérer les réservations',
    });
  }
}

export async function getReservation(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const reservation = await getReservationById(id);

    if (!reservation) {
      res.status(404).json({
        message: 'Réservation introuvable',
      });
      return;
    }

    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);

    res.status(500).json({
      message: 'Impossible de récupérer la réservation',
    });
  }
}

export async function createReservationController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const reservation = await createNewReservation(req.body);

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Impossible de créer la réservation',
    });
  }
}

export async function updateReservationController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const reservation = await updateExistingReservation(id, req.body);

    if (!reservation) {
      res.status(404).json({
        message: 'Réservation introuvable',
      });
      return;
    }

    res.json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Impossible de modifier la réservation',
    });
  }
}

export async function deleteReservationController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const deleted = await deleteExistingReservation(id);

    if (!deleted) {
      res.status(404).json({
        message: 'Réservation introuvable',
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);

    res.status(500).json({
      message: 'Impossible de supprimer la réservation',
    });
  }
}
