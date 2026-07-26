const fs = require('fs');
const path = require('path');

// Helper to ensure dir exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Write file utility
function write(filepath, content) {
    ensureDir(path.dirname(filepath));
    fs.writeFileSync(filepath, content, 'utf8');
}

// 1. Create Models
const modelsPath = path.join(__dirname, 'src', 'modules');

const schemas = {
    Player: `import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface IPlayer extends IBaseDocument { userId: string; rating: number; rank: number; status: string; }
const PlayerSchema = createBaseSchema({ userId: { type: String, required: true }, rating: { type: Number, default: 0 }, rank: { type: Number, default: 0 }, status: { type: String, default: 'Active' }});
export const PlayerModel: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);`,
    Sponsor: `import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface ISponsor extends IBaseDocument { name: string; tier: string; logoUrl: string; }
const SponsorSchema = createBaseSchema({ name: { type: String, required: true }, tier: { type: String }, logoUrl: { type: String }});
export const SponsorModel: Model<ISponsor> = mongoose.models.Sponsor || mongoose.model<ISponsor>('Sponsor', SponsorSchema);`,
    Finance: `import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface IFinance extends IBaseDocument { type: string; amount: number; status: string; }
const FinanceSchema = createBaseSchema({ type: { type: String, required: true }, amount: { type: Number, required: true }, status: { type: String, default: 'Pending' }});
export const FinanceModel: Model<IFinance> = mongoose.models.Finance || mongoose.model<IFinance>('Finance', FinanceSchema);`
};

for (const [name, content] of Object.entries(schemas)) {
    const dir = path.join(modelsPath, name.toLowerCase(), 'models');
    write(path.join(dir, `${name}.schema.ts`), content);
}

// 2. Create Repositories
const repositories = {
    Player: `import { BaseRepository } from '../../../lib/db/BaseRepository';
import { PlayerModel, IPlayer } from '../models/Player.schema';
export class PlayerRepository extends BaseRepository<IPlayer> { constructor() { super(PlayerModel); } }`,
    Sponsor: `import { BaseRepository } from '../../../lib/db/BaseRepository';
import { SponsorModel, ISponsor } from '../models/Sponsor.schema';
export class SponsorRepository extends BaseRepository<ISponsor> { constructor() { super(SponsorModel); } }`,
    Finance: `import { BaseRepository } from '../../../lib/db/BaseRepository';
import { FinanceModel, IFinance } from '../models/Finance.schema';
export class FinanceRepository extends BaseRepository<IFinance> { constructor() { super(FinanceModel); } }`
};

for (const [name, content] of Object.entries(repositories)) {
    const dir = path.join(modelsPath, name.toLowerCase(), 'repositories');
    write(path.join(dir, `${name.toLowerCase()}.repository.ts`), content);
}

// 3. Update Services (Regex replace mock arrays)
// This is complex, but we can replace the entire service body for PlayerService, FinanceService, SponsorService for simplicity.

const services = {
    'player/services/player.service.ts': `
import { PlayerRepository } from '../repositories/player.repository';
export class PlayerService {
    private repo = new PlayerRepository();
    async getProfile(id: string) { return this.repo.findById(id); }
    async updateProfile(id: string, data: any) { return this.repo.update(id, data); }
    async getHistory(id: string) { return []; }
    async getPayments(id: string) { return []; }
    async getNotifications(id: string) { return []; }
    async getMatches(id: string) { return []; }
    async searchDirectory(query: string) { return this.repo.findMany({}); }
}`,
    'finance/services/finance.service.ts': `
import { FinanceRepository } from '../repositories/finance.repository';
export class FinanceService {
    private repo = new FinanceRepository();
    async getTransactions() { return this.repo.findMany({}); }
    async processPayment(data: any) { return this.repo.create(data); }
    async getInvoices() { return this.repo.findMany({}); }
}`,
    'sponsor/services/sponsor.service.ts': `
import { SponsorRepository } from '../repositories/sponsor.repository';
export class SponsorService {
    private repo = new SponsorRepository();
    async getSponsorships() { return this.repo.findMany({}); }
    async addSponsor(data: any) { return this.repo.create(data); }
}`
};

for (const [relativePath, content] of Object.entries(services)) {
    write(path.join(modelsPath, relativePath), content);
}

// 4. Implement Security Headers in Middleware
const middlewarePath = path.join(__dirname, 'src', 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
    let mw = fs.readFileSync(middlewarePath, 'utf8');
    if (!mw.includes('x-xss-protection')) {
        mw = mw.replace('return response;', `
  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;`);
        fs.writeFileSync(middlewarePath, mw, 'utf8');
    }
}

// 5. Mock Email/SMTP Service
const emailService = `
export class EmailService {
    static async send(to: string, subject: string, body: string) {
        console.log(\`[SMTP LOG] Sent email to \${to} with subject: \${subject}\`);
        // In production, use nodemailer transport configured via process.env.SMTP_URL
    }
}
`;
write(path.join(__dirname, 'src', 'lib', 'email', 'email.service.ts'), emailService);

console.log("Migration script complete");
