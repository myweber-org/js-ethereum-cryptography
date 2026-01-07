import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = decoded as UserPayload;
    next();
  });
};

export const generateAccessToken = (userData: UserPayload): string => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT secret key not configured');
  }

  return jwt.sign(userData, secretKey, { expiresIn: '1h' });
};