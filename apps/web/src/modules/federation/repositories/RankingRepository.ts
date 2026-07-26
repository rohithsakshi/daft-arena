import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { RankingEntryModel, IRankingEntry, RankingCategory, RankingGender, RankingAgeCategory } from '../models/RankingEntry';

export class RankingRepository extends BaseRepository<IRankingEntry> {
  constructor() {
    super(RankingEntryModel);
  }

  async findRankings(
    federationId: string,
    seasonId: string,
    category: RankingCategory,
    gender: RankingGender,
    ageCategory: RankingAgeCategory,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IRankingEntry>> {
    return this.paginate(
      { federationId, seasonId, category, gender, ageCategory, isFrozen: false },
      { ...options, sort: { rank: 1 } }
    );
  }

  async findPlayerRankings(playerId: string, federationId: string): Promise<IRankingEntry[]> {
    return this.findMany({ playerId, federationId }, { sort: { effectiveDate: -1 } });
  }

  async freezeRankings(seasonId: string, federationId: string): Promise<number> {
    return this.updateMany({ seasonId, federationId }, { $set: { isFrozen: true } });
  }

  async upsertRanking(
    data: Partial<IRankingEntry>
  ): Promise<IRankingEntry> {
    const existing = await this.findOne({
      federationId: data.federationId,
      seasonId: data.seasonId,
      playerId: data.playerId,
      category: data.category,
      gender: data.gender,
      ageCategory: data.ageCategory,
    });

    if (existing) {
      const updated = await this.update(existing.id!, {
        $set: {
          previousRank: existing.rank,
          ...data,
        },
      });
      return updated!;
    }

    return this.create(data);
  }
}
