import { pool } from '../config/database.js';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string | null;
  startDate: Date;
  endDate: Date;
  capacity: number;
  price: string;
  organizerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventData {
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
  organizerId: number;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  price?: number;
}

export async function findAllEvents(): Promise<Event[]> {
  const result = await pool.query<Event>(`
    SELECT
      id,
      title,
      description,
      location,
      start_date AS "startDate",
      end_date AS "endDate",
      capacity,
      price,
      organizer_id AS "organizerId",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM events
    ORDER BY start_date ASC
  `);

  return result.rows;
}

export async function findEventById(id: number): Promise<Event | null> {
  const result = await pool.query<Event>(
    `
      SELECT
        id,
        title,
        description,
        location,
        start_date AS "startDate",
        end_date AS "endDate",
        capacity,
        price,
        organizer_id AS "organizerId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM events
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createEvent(data: CreateEventData): Promise<Event> {
  const result = await pool.query<Event>(
    `
      INSERT INTO events (
        title,
        description,
        location,
        start_date,
        end_date,
        capacity,
        price,
        organizer_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        title,
        description,
        location,
        start_date AS "startDate",
        end_date AS "endDate",
        capacity,
        price,
        organizer_id AS "organizerId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      data.title,
      data.description,
      data.location ?? null,
      data.startDate,
      data.endDate,
      data.capacity,
      data.price,
      data.organizerId,
    ],
  );

  return result.rows[0];
}

export async function updateEvent(
  id: number,
  data: UpdateEventData,
): Promise<Event | null> {
  const result = await pool.query<Event>(
    `
      UPDATE events
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        location = COALESCE($3, location),
        start_date = COALESCE($4, start_date),
        end_date = COALESCE($5, end_date),
        capacity = COALESCE($6, capacity),
        price = COALESCE($7, price),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING
        id,
        title,
        description,
        location,
        start_date AS "startDate",
        end_date AS "endDate",
        capacity,
        price,
        organizer_id AS "organizerId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      data.title,
      data.description,
      data.location,
      data.startDate,
      data.endDate,
      data.capacity,
      data.price,
      id,
    ],
  );

  return result.rows[0] ?? null;
}

export async function deleteEvent(id: number): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM events
      WHERE id = $1
    `,
    [id],
  );

  return result.rowCount === 1;
}
