
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
}import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(user: UserPayload): string {
  return jwt.sign(
    {
      sub: user.userId,
      email: user.email,
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      type: 'refresh'
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    if (decoded.type !== 'access') {
      return null;
    }

    return {
      userId: decoded.sub as string,
      email: decoded.email as string,
      role: decoded.role as string
    };
  } catch (error) {
    return null;
  }
}

export function refreshAccessToken(refreshToken: string): string | null {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    
    if (decoded.type !== 'refresh') {
      return null;
    }

    return generateAccessToken({
      userId: decoded.sub as string,
      email: '',
      role: 'user'
    });
  } catch (error) {
    return null;
  }
}import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

interface UserPayload {
    userId: string;
    email: string;
}

export class AuthService {
    private users = new Map<string, { email: string; passwordHash: string }>();

    async register(email: string, password: string): Promise<string> {
        const existingUser = Array.from(this.users.values()).find(u => u.email === email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = `user_${Date.now()}`;
        
        this.users.set(userId, { email, passwordHash });
        
        return this.generateToken({ userId, email });
    }

    async login(email: string, password: string): Promise<string> {
        const userEntry = Array.from(this.users.entries())
            .find(([_, user]) => user.email === email);

        if (!userEntry) {
            throw new Error('Invalid credentials');
        }

        const [userId, user] = userEntry;
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        return this.generateToken({ userId, email });
    }

    validateToken(token: string): UserPayload | null {
        try {
            return jwt.verify(token, SECRET_KEY) as UserPayload;
        } catch {
            return null;
        }
    }

    private generateToken(payload: UserPayload): string {
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
    }
}