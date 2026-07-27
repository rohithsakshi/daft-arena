import connectToDatabase from '@/lib/db/mongoose';
import { AdvertisementModel } from '../models/Advertisement';

export class AdServingEngine {
  /**
   * Fetches active advertisements relevant to a player based on their sports interests.
   */
  static async getAdsForPlayer(playerSports: string[], limit: number = 3) {
    try {
      await connectToDatabase();
      const now = new Date();
      
      const ads = await AdvertisementModel.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        targetAudience: 'PLAYER',
        $or: [
          { sportsCategory: { $size: 0 } }, // Generic ads (no specific sport)
          { sportsCategory: { $in: playerSports } } // Sport-specific ads matching player
        ]
      })
      .sort({ priority: -1 })
      .limit(limit)
      .lean();

      return ads;
    } catch (error) {
      console.error('[Ad Engine] Failed to fetch ads for player:', error);
      return [];
    }
  }

  /**
   * Fetches active advertisements relevant to a specific tournament context.
   */
  static async getAdsForTournament(sportCategory: string, limit: number = 3) {
    try {
      await connectToDatabase();
      const now = new Date();
      
      const ads = await AdvertisementModel.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        $or: [
          { sportsCategory: { $size: 0 } },
          { sportsCategory: sportCategory }
        ]
      })
      .sort({ priority: -1 })
      .limit(limit)
      .lean();

      return ads;
    } catch (error) {
      console.error('[Ad Engine] Failed to fetch ads for tournament:', error);
      return [];
    }
  }
}
