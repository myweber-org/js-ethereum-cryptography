import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;

    req.currentUser = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // In a real application, you would check user roles from database
  const isAdmin = checkUserAdminStatus(req.currentUser.userId);
  
  if (!isAdmin) {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }

  next();
};

const checkUserAdminStatus = (userId: string): boolean => {
  // Mock implementation - replace with actual database query
  const adminUsers = ['admin-123', 'admin-456'];
  return adminUsers.includes(userId);
};