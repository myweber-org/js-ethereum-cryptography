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