
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  role: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Authentication token required' });
      return;
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT secret not configured');
      }

      const decoded = jwt.verify(token, secret) as UserPayload;
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        res.status(500).json({ error: 'Authentication failed' });
      }
    }
  };
};

export const generateToken = (payload: UserPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not configured');
  }

  return jwt.sign(payload, secret, { expiresIn: '24h' });
};import { Request, Response, NextFunction } from 'express';
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

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = decoded as UserPayload;
    next();
  });
};

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};