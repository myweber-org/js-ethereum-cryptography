
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
};import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export class AuthenticationService {
  private users = new Map<string, { passwordHash: string; role: string }>();

  async registerUser(username: string, password: string, role: string = 'user'): Promise<boolean> {
    if (this.users.has(username)) {
      return false;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    this.users.set(username, { passwordHash, role });
    return true;
  }

  async authenticateUser(credentials: UserCredentials): Promise<string | null> {
    const user = this.users.get(credentials.username);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    const payload: TokenPayload = {
      userId: `user_${Date.now()}`,
      username: credentials.username,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  validateToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  getUserRole(username: string): string | undefined {
    return this.users.get(username)?.role;
  }
}