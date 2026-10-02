import { pool } from '../config/database.js';

export interface Reservation {
  id: number;
  quantity: number;
  userId: number;
  eventId: number;
  createdAt: Date;
}

export interface CreateReservationData {
  quantity: number;
  userId: number;
  eventId: number;
}

export interface UpdateReservationData {
  quantity?: number;
}

export async function findAllReservations(): Promise<Reservation[]> {
  const result = await pool.query<Reservation>(`
    SELECT
      id,
      quantity,
      user_id AS "userId",
      event_id AS "eventId",
      created_at AS "createdAt"
    FROM reservations
    ORDER BY id ASC
  `);

  return result.rows;
}

export async function findReservationById(
  id: number,
): Promise<Reservation | null> {
  const result = await pool.query<Reservation>(
    `
      SELECT
        id,
        quantity,
        user_id AS "userId",
        event_id AS "eventId",
        created_at AS "createdAt"
      FROM reservations
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createReservation(
  data: CreateReservationData,
): Promise<Reservation> {
  const result = await pool.query<Reservation>(
    `
      INSERT INTO reservations (
        quantity,
        user_id,
        event_id
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        quantity,
        user_id AS "userId",
        event_id AS "eventId",
        created_at AS "createdAt"
    `,
    [data.quantity, data.userId, data.eventId],
  );

  return result.rows[0];
}

export async function updateReservation(
  id: number,
  data: UpdateReservationData,
): Promise<Reservation | null> {
  const result = await pool.query<Reservation>(
    `
      UPDATE reservations
      SET quantity = COALESCE($1, quantity)
      WHERE id = $2
      RETURNING
        id,
        quantity,
        user_id AS "userId",
        event_id AS "eventId",
        created_at AS "createdAt"
    `,
    [data.quantity, id],
  );

  return result.rows[0] ?? null;
}

export async function deleteReservation(id: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM reservations WHERE id = $1`, [
    id,
  ]);

  return result.rowCount === 1;
}
