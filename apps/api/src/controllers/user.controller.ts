import type { Request, Response } from 'express';
import {
  createNewUser,
  deleteExistingUser,
  getAllUsers,
  getUserById,
  updateExistingUser,
} from '../services/user.service.js';

export async function getUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);

    res.status(500).json({
      message: 'Impossible de récupérer les utilisateurs',
    });
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({
        message: 'Utilisateur introuvable',
      });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);

    res.status(500).json({
      message: "Impossible de récupérer l'utilisateur",
    });
  }
}

export async function createUserController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const user = await createNewUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Impossible de créer l'utilisateur",
    });
  }
}

export async function updateUserController(
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

    const user = await updateExistingUser(id, req.body);

    if (!user) {
      res.status(404).json({
        message: 'Utilisateur introuvable',
      });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);

    res.status(400).json({
      message: "Impossible de modifier l'utilisateur",
    });
  }
}

export async function deleteUserController(
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

    const deleted = await deleteExistingUser(id);

    if (!deleted) {
      res.status(404).json({
        message: 'Utilisateur introuvable',
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);

    res.status(500).json({
      message: "Impossible de supprimer l'utilisateur",
    });
  }
}
