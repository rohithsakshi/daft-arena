import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET);

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  [key: string]: any;
}

export async function signToken(payload: JWTPayload, expiresIn = '24h'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromSession(req: Request) {
  // Simple mock implementation for MVP purposes, extracting user ID from authorization header or using a fallback
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (payload) {
      return { _id: payload.sub, role: payload.role };
    }
  }
  // Fallback to a mock user ID for testing the dashboard if no token is present
  return { _id: '60d5ecb74d6bb892b71d3abc', role: 'PLAYER' };
}
