import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import type { UserRole } from '../repositories/user.repository.js';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface LoginResult {
  user: AuthUser;
  token: string;
}

export async function registerUser(data: RegisterData): Promise<AuthUser> {
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [data.email],
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new Error('Cette adresse email est déjà utilisée');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await pool.query<AuthUser>(
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
        role
    `,
    [
      data.email,
      hashedPassword,
      data.firstName,
      data.lastName,
      data.role ?? 'PARTICIPANT',
    ],
  );

  return result.rows[0];
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  const result = await pool.query<{
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }>(
    `
      SELECT
        id,
        email,
        password,
        first_name AS "firstName",
        last_name AS "lastName",
        role
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET n'est pas configuré");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: '2h',
    },
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token,
  };
}
