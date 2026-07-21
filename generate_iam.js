const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'apps', 'web', 'src', 'modules', 'iam');

const files = {
  'dtos/user.dto.ts': `
import { z } from 'zod';
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserDto = z.infer<typeof UserSchema>;
`,
  'repositories/user.repository.ts': `
import { PrismaClient } from '@prisma/client';
export class UserRepository {
  constructor(private prisma: PrismaClient) {}
  async findById(id: string) { return this.prisma.user.findUnique({ where: { id } }); }
  async findByEmail(email: string) { return this.prisma.user.findUnique({ where: { email } }); }
}
`,
  'services/auth.service.ts': `
export class AuthenticationService {
  constructor() {}
  async login() { return { token: 'mock-token' }; }
  async logout() {}
}
`,
  'services/authorization.service.ts': `
export class AuthorizationService {
  constructor() {}
  async checkPermission(userId: string, permission: string) { return true; }
}
`,
  'guards/auth.guard.ts': `
export function authGuard(req: any) { return true; }
`,
  'api/auth.controller.ts': `
export class AuthController {
  login(req: any) { return { success: true }; }
}
`,
  'types/index.ts': `
export interface IAuth { user: any; }
`,
  'schemas/index.ts': `
export * from '../dtos/user.dto';
`,
  'seed/seed.ts': `
export async function seedIam() { console.log('Seeding IAM'); }
`,
  '__tests__/auth.test.ts': `
describe('Auth', () => { it('should pass', () => { expect(1).toBe(1); }); });
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}
console.log('IAM boilerplate generated successfully.');
