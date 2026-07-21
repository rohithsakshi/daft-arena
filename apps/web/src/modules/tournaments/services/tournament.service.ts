import { TournamentRepository, TournamentEventRepository } from '../repositories';
import { ITournament } from '../models/Tournament';
import { TournamentStatus } from '../../core/enums';
import { NotFoundException, ConflictException, BusinessRuleException } from '../../core/exceptions';
import { QueryOptionsDto } from '../../core/dto';
import { PaginatedResponse } from '../../core/interfaces';

export class TournamentService {
  constructor(
    private readonly tournamentRepo: TournamentRepository,
    private readonly eventRepo: TournamentEventRepository
  ) {}

  async createTournament(data: Partial<ITournament>, userId: string): Promise<ITournament> {
    const existing = await this.tournamentRepo.findBySlug(data.slug!);
    if (existing) {
      throw new ConflictException(`Tournament with slug ${data.slug} already exists`);
    }

    return this.tournamentRepo.create({
      ...data,
      status: TournamentStatus.Draft,
      createdBy: userId,
      updatedBy: userId
    });
  }

  async getTournament(id: string): Promise<ITournament> {
    const tournament = await this.tournamentRepo.findById(id);
    if (!tournament) throw new NotFoundException('Tournament');
    return tournament;
  }

  async updateTournament(id: string, data: Partial<ITournament>, userId: string): Promise<ITournament> {
    const existing = await this.getTournament(id);
    
    // Prevent modifying core dates if live or completed
    if (
      (existing.status === TournamentStatus.Live || existing.status === TournamentStatus.Completed) &&
      (data.tournamentDates || data.registrationWindow)
    ) {
      throw new BusinessRuleException('Cannot modify dates for a Live or Completed tournament');
    }

    const updated = await this.tournamentRepo.update(id, { ...data, updatedBy: userId });
    if (!updated) throw new NotFoundException('Tournament');
    return updated;
  }

  // --- STATE MACHINE ---
  
  private validateTransition(current: TournamentStatus, next: TournamentStatus) {
    const allowedTransitions: Record<TournamentStatus, TournamentStatus[]> = {
      [TournamentStatus.Draft]: [TournamentStatus.Published, TournamentStatus.Cancelled],
      [TournamentStatus.Published]: [TournamentStatus.RegistrationOpen, TournamentStatus.Draft, TournamentStatus.Cancelled],
      [TournamentStatus.RegistrationOpen]: [TournamentStatus.RegistrationClosed, TournamentStatus.Cancelled],
      [TournamentStatus.RegistrationClosed]: [TournamentStatus.Seeding, TournamentStatus.RegistrationOpen, TournamentStatus.Cancelled],
      [TournamentStatus.Seeding]: [TournamentStatus.Scheduling, TournamentStatus.RegistrationClosed, TournamentStatus.Cancelled],
      [TournamentStatus.Scheduling]: [TournamentStatus.Live, TournamentStatus.Seeding, TournamentStatus.Cancelled],
      [TournamentStatus.Live]: [TournamentStatus.Completed, TournamentStatus.Cancelled],
      [TournamentStatus.Completed]: [TournamentStatus.Archived],
      [TournamentStatus.Cancelled]: [TournamentStatus.Draft], // Restore from cancel
      [TournamentStatus.Archived]: [] // Terminal state
    };

    if (!allowedTransitions[current]?.includes(next)) {
      throw new BusinessRuleException(`Invalid status transition from ${current} to ${next}`);
    }
  }

  async changeStatus(id: string, newStatus: TournamentStatus, userId: string): Promise<ITournament> {
    const tournament = await this.getTournament(id);
    this.validateTransition(tournament.status, newStatus);
    
    // Additional business rules per state transition could be added here
    if (newStatus === TournamentStatus.Published) {
      const events = await this.eventRepo.findByTournamentId(id);
      if (events.length === 0) {
        throw new BusinessRuleException('Cannot publish a tournament with no events');
      }
    }

    const updated = await this.tournamentRepo.update(id, { status: newStatus, updatedBy: userId });
    return updated!;
  }

  async listTournaments(options: QueryOptionsDto): Promise<PaginatedResponse<ITournament>> {
    const { query, ...paginateOptions } = options;
    if (query) {
      const { data, ...meta } = await this.tournamentRepo.search(query, ['name', 'slug', 'description'], {}, paginateOptions);
      return { data, meta };
    }
    const { data, ...meta } = await this.tournamentRepo.paginate({}, paginateOptions);
    return { data, meta };
  }

  async deleteDraft(id: string, userId: string): Promise<boolean> {
    const existing = await this.getTournament(id);
    if (existing.status !== TournamentStatus.Draft) {
      throw new BusinessRuleException('Only Draft tournaments can be permanently deleted');
    }
    
    // Delete associated events first
    await this.eventRepo.updateMany({ tournamentId: id }, { isDeleted: true, updatedBy: userId });
    
    await this.tournamentRepo.update(id, { updatedBy: userId });
    return this.tournamentRepo.delete(id);
  }
}
