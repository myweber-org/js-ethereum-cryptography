import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key';
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
  private generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  generateTokens(user: UserPayload): TokenPair {
    const accessToken = jwt.sign(
      { ...user, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { ...user, type: 'refresh', jti: this.generateRandomString(16) },
      REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): UserPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload & { type: string };
      if (decoded.type !== 'access') {
        return null;
      }
      return { userId: decoded.userId, email: decoded.email, role: decoded.role };
    } catch {
      return null;
    }
  }

  refreshTokens(refreshToken: string): TokenPair | null {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload & { type: string; jti: string };
      
      if (decoded.type !== 'refresh') {
        return null;
      }

      const userPayload: UserPayload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };

      return this.generateTokens(userPayload);
    } catch {
      return null;
    }
  }

  decodeTokenWithoutVerification(token: string): Partial<UserPayload> | null {
    try {
      const decoded = jwt.decode(token) as any;
      return {
        userId: decoded?.userId,
        email: decoded?.email,
        role: decoded?.role
      };
    } catch {
      return null;
    }
  }
}

export { AuthenticationService, type UserPayload, type TokenPair };