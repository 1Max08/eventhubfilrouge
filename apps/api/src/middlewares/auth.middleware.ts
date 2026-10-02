import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type UserRole = 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN';

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({
      message: "Token d'authentification manquant",
    });
    return;
  }

  const token = authorization.substring(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({
      message: "JWT_SECRET n'est pas configuré",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (
      typeof decoded.userId !== 'number' ||
      !['PARTICIPANT', 'ORGANIZER', 'ADMIN'].includes(decoded.role)
    ) {
      res.status(401).json({
        message: 'Token invalide',
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({
      message: 'Token invalide ou expiré',
    });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        message: 'Authentification requise',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Accès interdit',
      });
      return;
    }

    next();
  };
}
