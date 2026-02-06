import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '1h';

interface UserPayload {
    userId: string;
    email: string;
    role: string;
}

export function generateToken(user: UserPayload): string {
    const tokenId = uuidv4();
    const payload = {
        ...user,
        jti: tokenId,
        iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): UserPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload & { jti: string; iat: number };
        const { jti, iat, ...userPayload } = decoded;
        return userPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class AuthenticationService {
  private generateAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  private generateRefreshToken(payload: UserPayload): string {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  generateTokenPair(user: UserPayload): TokenPair {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, SECRET_KEY) as UserPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET_KEY) as UserPayload;
    } catch (error) {
      return null;
    }
  }

  refreshAccessToken(refreshToken: string): TokenPair | null {
    const payload = this.verifyRefreshToken(refreshToken);
    
    if (!payload) {
      return null;
    }

    return this.generateTokenPair(payload);
  }

  generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }
}

export { AuthenticationService, UserPayload, TokenPair };