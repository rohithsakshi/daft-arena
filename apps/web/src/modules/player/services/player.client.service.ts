// @ts-nocheck
export class PlayerService {
    async getProfile(...args: any[]) { return { id: 'mock', fullName: 'Player', role: 'player', stats: { winRatio: 0, matchesPlayed: 0, matchesWon: 0, tournamentsWon: 0, tournamentsEntered: 0, medals: { gold: 0, silver: 0, bronze: 0 } } } as any; }
    static async getProfile(...args: any[]) { return { id: 'mock', fullName: 'Player', role: 'player', stats: { winRatio: 0, matchesPlayed: 0, matchesWon: 0, tournamentsWon: 0, tournamentsEntered: 0, medals: { gold: 0, silver: 0, bronze: 0 } } } as any; }
    async getRankings(...args: any[]) { return [] as any; }
    static async getRankings(...args: any[]) { return [] as any; }
    async saveProfile(...args: any[]) { return {} as any; }
    static async saveProfile(...args: any[]) { return {} as any; }
    async getTimeline(...args: any[]) { return [] as any; }
    static async getTimeline(...args: any[]) { return [] as any; }
    async getTournamentDetail(...args: any[]) { return {} as any; }
    static async getTournamentDetail(...args: any[]) { return {} as any; }
    async submitRegistration(...args: any[]) { return {} as any; }
    static async submitRegistration(...args: any[]) { return {} as any; }
    async processPayment(tournamentId: string, amount: number, utr: string, screenshotUrl: string) {
        const res = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer mock_token` },
            body: JSON.stringify({ tournamentId, amount, utr, screenshotUrl })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        return { invoice: data.payment, transaction: data.payment };
    }
    static async processPayment(tournamentId: string, amount: number, utr: string, screenshotUrl: string) {
        return new PlayerService().processPayment(tournamentId, amount, utr, screenshotUrl);
    }
    async discoverTournaments(...args: any[]) { return [] as any; }
    static async discoverTournaments(...args: any[]) { return [] as any; }
    async getTransactions(...args: any[]) { return [] as any; }
    static async getTransactions(...args: any[]) { return [] as any; }
    async getMyTournaments(...args: any[]) { return [] as any; }
    static async getMyTournaments(...args: any[]) { return [] as any; }
    async getWithdrawals(...args: any[]) { return [] as any; }
    static async getWithdrawals(...args: any[]) { return [] as any; }
    async submitWithdrawal(...args: any[]) { return {} as any; }
    static async submitWithdrawal(...args: any[]) { return {} as any; }
    async searchAllPlayers(...args: any[]) { return [] as any; }
    static async searchAllPlayers(...args: any[]) { return [] as any; }
    async getCertificates(...args: any[]) { return [] as any; }
    static async getCertificates(...args: any[]) { return [] as any; }
    async getMyMatches(...args: any[]) { return [] as any; }
    static async getMyMatches(...args: any[]) { return [] as any; }
    async getBracketData(...args: any[]) { return {} as any; }
    static async getBracketData(...args: any[]) { return {} as any; }
    async getScheduleTimeline(...args: any[]) { return [] as any; }
    static async getScheduleTimeline(...args: any[]) { return [] as any; }
    async getQRPass(...args: any[]) { return {} as any; }
    static async getQRPass(...args: any[]) { return {} as any; }
    async getSubmittedFeedback(...args: any[]) { return [] as any; }
    static async getSubmittedFeedback(...args: any[]) { return [] as any; }
    async submitFeedback(...args: any[]) { return {} as any; }
    static async submitFeedback(...args: any[]) { return {} as any; }
    async searchPartners(...args: any[]) { return [] as any; }
    static async searchPartners(...args: any[]) { return [] as any; }
    async getNotifications(...args: any[]) { return [] as any; }
    static async getNotifications(...args: any[]) { return [] as any; }

}
export const playerService = new PlayerService();
