import {
  createReservation,
  deleteReservation,
  findAllReservations,
  findReservationById,
  updateReservation,
  type CreateReservationData,
  type Reservation,
  type UpdateReservationData,
} from '../repositories/reservation.repository.js';
import { pool } from '../config/database.js';

export async function getAllReservations(): Promise<Reservation[]> {
  return findAllReservations();
}

export async function getReservationById(
  id: number,
): Promise<Reservation | null> {
  return findReservationById(id);
}

export async function createNewReservation(
  data: CreateReservationData,
): Promise<Reservation> {
  if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
    throw new Error('La quantité doit être supérieure à 0');
  }

  const userResult = await pool.query(`SELECT id FROM users WHERE id = $1`, [
    data.userId,
  ]);

  if (userResult.rowCount === 0) {
    throw new Error('Utilisateur introuvable');
  }

  const eventResult = await pool.query(`SELECT id FROM events WHERE id = $1`, [
    data.eventId,
  ]);

  if (eventResult.rowCount === 0) {
    throw new Error('Événement introuvable');
  }

  return createReservation(data);
}

export async function updateExistingReservation(
  id: number,
  data: UpdateReservationData,
): Promise<Reservation | null> {
  if (
    data.quantity !== undefined &&
    (!Number.isInteger(data.quantity) || data.quantity <= 0)
  ) {
    throw new Error('La quantité doit être supérieure à 0');
  }

  return updateReservation(id, data);
}

export async function deleteExistingReservation(id: number): Promise<boolean> {
  return deleteReservation(id);
}
