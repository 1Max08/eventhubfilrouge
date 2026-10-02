import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserById,
  updateUser,
  type CreateUserData,
  type SafeUser,
  type UpdateUserData,
} from '../repositories/user.repository.js';

export async function getAllUsers(): Promise<SafeUser[]> {
  return findAllUsers();
}

export async function getUserById(id: number): Promise<SafeUser | null> {
  return findUserById(id);
}

export async function createNewUser(data: CreateUserData): Promise<SafeUser> {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Adresse email invalide');
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (!data.firstName || !data.lastName) {
    throw new Error('Le prénom et le nom sont obligatoires');
  }

  return createUser(data);
}

export async function updateExistingUser(
  id: number,
  data: UpdateUserData,
): Promise<SafeUser | null> {
  return updateUser(id, data);
}

export async function deleteExistingUser(id: number): Promise<boolean> {
  return deleteUser(id);
}
