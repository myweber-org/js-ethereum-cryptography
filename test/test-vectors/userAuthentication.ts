import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '1h';

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
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
}

export function validateToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload & { jti: string; iat: number };
    const { jti, iat, ...userPayload } = decoded;
    return userPayload;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}