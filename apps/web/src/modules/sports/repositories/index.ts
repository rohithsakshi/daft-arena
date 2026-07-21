import { BaseRepository } from '../../../lib/db/BaseRepository';
import { SportModel, ISport } from '../models/Sport';
import { RulePackageModel, IRulePackage } from '../models/RulePackage';
import { ClientSession } from 'mongoose';

export class SportRepository extends BaseRepository<ISport> {
  constructor() {
    super(SportModel);
  }

  async findBySlug(slug: string, session?: ClientSession): Promise<ISport | null> {
    return this.findOne({ slug }, { session });
  }

  async findActive(session?: ClientSession): Promise<ISport[]> {
    return this.findMany({ isActive: true }, { sort: { sortOrder: 1 }, session });
  }
}

export class RulePackageRepository extends BaseRepository<IRulePackage> {
  constructor() {
    super(RulePackageModel);
  }

  async findVersions(sportId: string, name: string, session?: ClientSession): Promise<IRulePackage[]> {
    return this.findMany(
      { sportId, name }, 
      { sort: { packageVersion: -1 }, session }
    );
  }

  async findPublished(sportId: string, session?: ClientSession): Promise<IRulePackage[]> {
    return this.findMany(
      { sportId, status: 'Published' }, 
      { session }
    );
  }
}
