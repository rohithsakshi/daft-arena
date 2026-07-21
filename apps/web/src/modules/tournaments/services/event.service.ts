import { TournamentEventRepository, TournamentRepository } from '../repositories';
import { ITournamentEvent } from '../models/Event';
import { NotFoundException, BusinessRuleException } from '../../core/exceptions';
import { TournamentStatus } from '../../core/enums';

export class EventService {
  constructor(
    private readonly eventRepo: TournamentEventRepository,
    private readonly tournamentRepo: TournamentRepository
  ) {}

  async createEvent(tournamentId: string, data: Partial<ITournamentEvent>, userId: string): Promise<ITournamentEvent> {
    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament');
    
    if (tournament.status === TournamentStatus.Live || tournament.status === TournamentStatus.Completed) {
      throw new BusinessRuleException('Cannot add events to a Live or Completed tournament');
    }

    return this.eventRepo.create({
      ...data,
      tournamentId,
      createdBy: userId,
      updatedBy: userId
    });
  }

  async getEvent(id: string): Promise<ITournamentEvent> {
    const event = await this.eventRepo.findById(id);
    if (!event) throw new NotFoundException('TournamentEvent');
    return event;
  }

  async updateEvent(id: string, data: Partial<ITournamentEvent>, userId: string): Promise<ITournamentEvent> {
    const existing = await this.getEvent(id);
    const tournament = await this.tournamentRepo.findById(existing.tournamentId.toString());
    
    if (tournament && (tournament.status === TournamentStatus.Live || tournament.status === TournamentStatus.Completed)) {
      throw new BusinessRuleException('Cannot modify events in a Live or Completed tournament');
    }

    const updated = await this.eventRepo.update(id, { ...data, updatedBy: userId });
    return updated!;
  }

  async deleteEvent(id: string, userId: string): Promise<boolean> {
    const existing = await this.getEvent(id);
    const tournament = await this.tournamentRepo.findById(existing.tournamentId.toString());
    
    if (tournament && tournament.status !== TournamentStatus.Draft) {
      throw new BusinessRuleException('Events can only be deleted while the tournament is in Draft status');
    }

    await this.eventRepo.update(id, { updatedBy: userId });
    return this.eventRepo.delete(id);
  }
}
