import type { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service.js';

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const user = await registerUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Impossible de créer le compte',
    });
  }
}

export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Email et mot de passe obligatoires',
      });
      return;
    }

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error) {
    console.error('Error logging in:', error);

    res.status(401).json({
      message:
        error instanceof Error ? error.message : 'Authentification impossible',
    });
  }
}
