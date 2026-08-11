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
  // Try Authorization header first
  const authHeader = req.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Fallback to checking cookies
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:daft_token|daft_superadmin_token|token)=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      return { _id: payload.sub, role: payload.role };
    }
  }
  
  // Fallback to a mock user ID for testing the dashboard if no token is present
  return { _id: '60d5ecb74d6bb892b71d3abc', role: 'PLAYER' };
}
