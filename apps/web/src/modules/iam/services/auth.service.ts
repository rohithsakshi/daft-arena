import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { AuditService } from './audit.service';
import { LoginDto } from '../dtos';
import * as bcrypt from 'bcryptjs';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod');

export class AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private auditService: AuditService
  ) {}

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepository.findByEmail(dto.email);
    
    // Mitigate timing attacks by always hashing, even if user doesn't exist
    let isValidPassword = false;
    if (user && user.hashedPassword) {
      isValidPassword = await bcrypt.compare(dto.password, user.hashedPassword);
    } else {
      await bcrypt.compare(dto.password, await bcrypt.hash('dummy_password', 10));
    }

    if (!user || !isValidPassword) {
      await this.auditService.logAction({ action: 'FAILED_LOGIN', metadata: { email: dto.email, reason: 'invalid_credentials' }, ipAddress });
      throw new Error('Invalid credentials');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const token = await new jose.SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    await this.sessionRepository.create({
      userId: user.id,
      token,
      ipAddress,
      userAgent,
      expiresAt,
    });

    await this.auditService.logAction({ actorId: user.id, action: 'LOGIN', ipAddress });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async logout(token: string, userId?: string, ipAddress?: string) {
    if (!token) return;
    await this.sessionRepository.invalidateToken(token);
    if (userId) {
      await this.auditService.logAction({ actorId: userId, action: 'LOGOUT', ipAddress });
    }
  }

  async forceLogoutAll(userId: string) {
    await this.sessionRepository.invalidateAllUserSessions(userId);
    await this.auditService.logAction({ actorId: userId, action: 'FORCE_LOGOUT_ALL' });
  }

  async validateSession(token: string) {
    if (!token) return null;
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      const session = await this.sessionRepository.findByToken(token);
      if (!session || !session.isValid || session.expiresAt < new Date()) {
        return null;
      }
      
      return payload;
    } catch (e) {
      return null;
    }
  }
}
