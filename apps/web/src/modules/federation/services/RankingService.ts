import { connectDB } from '../../../lib/mongodb';
import { RankingRepository } from '../repositories/RankingRepository';
import { SeasonRepository } from '../repositories/SeasonRepository';
import {
  IRankingEntry,
  RankingCategory,
  RankingGender,
  RankingAgeCategory,
} from '../models/RankingEntry';
import { ISeason } from '../models/Season';
import { PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { auditService } from '../../iam/services/audit.service';

export class RankingService {
  constructor(
    private readonly rankingRepo: RankingRepository,
    private readonly seasonRepo: SeasonRepository
  ) {}

  async createSeason(data: Partial<ISeason>, createdBy: string): Promise<ISeason> {
    await connectDB();

    // Only one active season per federation+sport
    if (data.federationId && data.sportId) {
      const existingActive = await this.seasonRepo.findActiveSeason(
        String(data.federationId),
        String(data.sportId)
      );
      if (existingActive) {
        throw new Error('An active season already exists for this federation and sport.');
      }
    }

    const season = await this.seasonRepo.create({ ...data, createdBy });

    await auditService.logAction({
      actorId: createdBy,
      action: 'SEASON_CREATED',
      entityId: season.id,
      entityType: 'Season',
      metadata: { name: season.name },
    });

    return season;
  }

  async closeSeason(seasonId: string, closedBy: string): Promise<ISeason | null> {
    await connectDB();
    const season = await this.seasonRepo.closeSeason(seasonId, closedBy);

    if (season) {
      // Freeze rankings for this season
      await this.rankingRepo.freezeRankings(seasonId, String(season.federationId));

      await auditService.logAction({
        actorId: closedBy,
        action: 'SEASON_CLOSED',
        entityId: seasonId,
        entityType: 'Season',
        metadata: { name: season.name },
      });
    }

    return season;
  }

  async getSeasons(federationId: string, options: PaginateOptions = {}): Promise<PaginatedResult<ISeason>> {
    await connectDB();
    return this.seasonRepo.paginateByFederation(federationId, options);
  }

  async getActiveSeason(federationId: string, sportId: string): Promise<ISeason | null> {
    await connectDB();
    return this.seasonRepo.findActiveSeason(federationId, sportId);
  }

  async getRankings(
    federationId: string,
    seasonId: string,
    category: RankingCategory,
    gender: RankingGender,
    ageCategory: RankingAgeCategory,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IRankingEntry>> {
    await connectDB();
    return this.rankingRepo.findRankings(federationId, seasonId, category, gender, ageCategory, options);
  }

  async getPlayerRankings(playerId: string, federationId: string): Promise<IRankingEntry[]> {
    await connectDB();
    return this.rankingRepo.findPlayerRankings(playerId, federationId);
  }

  async upsertRanking(
    data: Partial<IRankingEntry>,
    updatedBy: string
  ): Promise<IRankingEntry> {
    await connectDB();
    const entry = await this.rankingRepo.upsertRanking(data);

    await auditService.logAction({
      actorId: updatedBy,
      action: 'RANKING_UPDATED',
      entityId: entry.id,
      entityType: 'RankingEntry',
      metadata: { rank: entry.rank, points: entry.points },
    });

    return entry;
  }
}
