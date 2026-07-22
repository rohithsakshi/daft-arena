import { BaseRepository } from '../../../lib/db/BaseRepository';
import { BracketModel, IBracket } from '../models/Bracket';
import { DrawModel, IDraw } from '../models/Draw';
import { RoundModel, IRound } from '../models/Round';
import { MatchModel, IMatch } from '../models/Match';
import { SeedModel, ISeed } from '../models/Seed';
import { ProgressionRuleModel, IProgressionRule } from '../models/ProgressionRule';
import { ByeModel, IBye } from '../models/Bye';

export class BracketRepository extends BaseRepository<IBracket> {
  constructor() {
    super(BracketModel);
  }

  async findByEventId(eventId: string): Promise<IBracket[]> {
    return this.findMany({ eventId });
  }
}

export class DrawRepository extends BaseRepository<IDraw> {
  constructor() {
    super(DrawModel);
  }

  async findByBracketId(bracketId: string): Promise<IDraw[]> {
    return this.findMany({ bracketId });
  }

  async findPrimaryDraw(bracketId: string): Promise<IDraw | null> {
    return this.findOne({ bracketId, isPrimary: true });
  }
}

export class RoundRepository extends BaseRepository<IRound> {
  constructor() {
    super(RoundModel);
  }

  async findByDrawId(drawId: string): Promise<IRound[]> {
    return this.findMany({ drawId });
  }
}

export class MatchRepository extends BaseRepository<IMatch> {
  constructor() {
    super(MatchModel);
  }

  async findByDrawId(drawId: string): Promise<IMatch[]> {
    return this.findMany({ drawId });
  }

  async findByRoundId(roundId: string): Promise<IMatch[]> {
    return this.findMany({ roundId });
  }
}

export class SeedRepository extends BaseRepository<ISeed> {
  constructor() {
    super(SeedModel);
  }

  async findByBracketId(bracketId: string): Promise<ISeed[]> {
    return this.findMany({ bracketId });
  }
}

export class ProgressionRuleRepository extends BaseRepository<IProgressionRule> {
  constructor() {
    super(ProgressionRuleModel);
  }

  async findByBracketId(bracketId: string): Promise<IProgressionRule[]> {
    return this.findMany({ bracketId });
  }
}

export class ByeRepository extends BaseRepository<IBye> {
  constructor() {
    super(ByeModel);
  }

  async findByDrawId(drawId: string): Promise<IBye[]> {
    return this.findMany({ drawId });
  }
}
