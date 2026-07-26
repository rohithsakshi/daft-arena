// @ts-nocheck

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
}