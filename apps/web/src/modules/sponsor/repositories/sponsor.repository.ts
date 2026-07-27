// @ts-nocheck
import { BaseRepository } from '../../../lib/db/BaseRepository';
import { SponsorModel, ISponsor } from '../models/Sponsor.schema';
export class SponsorRepository extends BaseRepository<ISponsor> { constructor() { super(SponsorModel); } }
