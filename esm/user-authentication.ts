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

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
      }

      req.user = decoded as UserPayload;
      next();
    }
  );
};

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    user,
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
};