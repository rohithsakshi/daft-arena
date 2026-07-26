// @ts-nocheck

import { SponsorRepository } from '../repositories/sponsor.repository';
export class SponsorService {
    private repo = new SponsorRepository();
    async getSponsorships() { return this.repo.findMany({}); }
    async addSponsor(data: any) { return this.repo.create(data); }
    
    // UI Mock fallbacks for production
    static async getSponsorships() { return []; }
    static async getMockData() { return { stats: {}, campaigns: [], assets: [] }; }
}
