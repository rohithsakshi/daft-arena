import { BaseRepository } from '../../../lib/db/BaseRepository';
import { VenueModel, IVenue } from '../models/Venue';
import { PlayingAreaModel, IPlayingArea } from '../models/PlayingArea';
import { TournamentModel, ITournament } from '../models/Tournament';
import { TournamentEventModel, ITournamentEvent } from '../models/Event';
import { RegistrationModel, IRegistration } from '../models/Registration';

export class VenueRepository extends BaseRepository<IVenue> {
  constructor() {
    super(VenueModel);
  }
}

export class PlayingAreaRepository extends BaseRepository<IPlayingArea> {
  constructor() {
    super(PlayingAreaModel);
  }
}

export class TournamentRepository extends BaseRepository<ITournament> {
  constructor() {
    super(TournamentModel);
  }

  async findBySlug(slug: string): Promise<ITournament | null> {
    return this.findOne({ slug });
  }
}

export class TournamentEventRepository extends BaseRepository<ITournamentEvent> {
  constructor() {
    super(TournamentEventModel);
  }
  
  async findByTournamentId(tournamentId: string): Promise<ITournamentEvent[]> {
    return this.findMany({ tournamentId });
  }
}

export class RegistrationRepository extends BaseRepository<IRegistration> {
  constructor() {
    super(RegistrationModel);
  }
  
  async findByTournamentId(tournamentId: string): Promise<IRegistration[]> {
    return this.findMany({ tournamentId });
  }
  
  async findByEventId(eventId: string): Promise<IRegistration[]> {
    return this.findMany({ eventId });
  }
}
