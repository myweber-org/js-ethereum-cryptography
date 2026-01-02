import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // In a real application, you would check user roles from database
  // This is a simplified example
  const isAdmin = checkUserAdminStatus(req.user.id);
  
  if (!isAdmin) {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }

  next();
};

function checkUserAdminStatus(userId: string): boolean {
  // Mock implementation - replace with actual database query
  const adminUsers = ['admin-id-1', 'admin-id-2'];
  return adminUsers.includes(userId);
}