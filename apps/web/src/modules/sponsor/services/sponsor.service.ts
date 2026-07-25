export class SponsorService {
  static async getMockData(moduleName: string) {
    return {
      status: 'active',
      module: moduleName,
      timestamp: new Date().toISOString()
    };
  }
}
