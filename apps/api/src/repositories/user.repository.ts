import { pool } from '../config/database.js';

export type UserRole = 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export async function findAllUsers(): Promise<SafeUser[]> {
  const result = await pool.query<SafeUser>(`
    SELECT
      id,
      email,
      first_name AS "firstName",
      last_name AS "lastName",
      role,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM users
    ORDER BY id ASC
  `);

  return result.rows;
}

export async function findUserById(id: number): Promise<SafeUser | null> {
  const result = await pool.query<SafeUser>(
    `
      SELECT
        id,
        email,
        first_name AS "firstName",
        last_name AS "lastName",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createUser(data: CreateUserData): Promise<SafeUser> {
  const result = await pool.query<SafeUser>(
    `
      INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        email,
        first_name AS "firstName",
        last_name AS "lastName",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role ?? 'PARTICIPANT',
    ],
  );

  return result.rows[0];
}

export async function updateUser(
  id: number,
  data: UpdateUserData,
): Promise<SafeUser | null> {
  const result = await pool.query<SafeUser>(
    `
      UPDATE users
      SET
        email = COALESCE($1, email),
        password = COALESCE($2, password),
        first_name = COALESCE($3, first_name),
        last_name = COALESCE($4, last_name),
        role = COALESCE($5, role),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING
        id,
        email,
        first_name AS "firstName",
        last_name AS "lastName",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [data.email, data.password, data.firstName, data.lastName, data.role, id],
  );

  return result.rows[0] ?? null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result.rowCount === 1;
}
