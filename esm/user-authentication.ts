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
};import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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

    req.user = decoded as { id: string; email: string };
    next();
  });
};

export const generateToken = (userId: string, userEmail: string): string => {
  return jwt.sign(
    { id: userId, email: userEmail },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';
const users: Map<string, { passwordHash: string; refreshToken?: string }> = new Map();

interface LoginRequest {
    username: string;
    password: string;
}

interface TokenPayload {
    username: string;
    role: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password }: LoginRequest = req.body;
        
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        const user = users.get(username);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign(
            { username, role: 'user' } as TokenPayload,
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { username } as TokenPayload,
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        users.set(username, user);

        res.json({
            accessToken,
            refreshToken,
            expiresIn: 900
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refreshToken = (req: Request, res: Response): void => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token is required' });
            return;
        }

        let payload: TokenPayload;
        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;
        } catch (error) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        const user = users.get(payload.username);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        const newAccessToken = jwt.sign(
            { username: payload.username, role: 'user' } as TokenPayload,
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({
            accessToken: newAccessToken,
            expiresIn: 900
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const registerUser = async (username: string, password: string): Promise<boolean> => {
    if (users.has(username)) {
        return false;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    users.set(username, { passwordHash });
    return true;
};