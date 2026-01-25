
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  };
};

export const generateToken = (userData: UserPayload): string => {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
};

export const validateUserRole = (user: UserPayload, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(user.role);
};