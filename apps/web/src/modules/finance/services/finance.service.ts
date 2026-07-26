// @ts-nocheck

import { FinanceRepository } from '../repositories/finance.repository';
export class FinanceService {
    private repo = new FinanceRepository();
    async getTransactions() { return this.repo.findMany({}); }
    async processPayment(data: any) { return this.repo.create(data); }
    async getInvoices() { return this.repo.findMany({}); }
    
    static async getMockData() { return [] as any; }
}
