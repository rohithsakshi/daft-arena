import { RegistrationRepository, TournamentEventRepository, TournamentRepository } from '../repositories';
import { IRegistration } from '../models/Registration';
import { RegistrationStatus, TournamentStatus } from '../../core/enums';
import { NotFoundException, BusinessRuleException, ConflictException } from '../../core/exceptions';
import { QueryOptionsDto } from '../../core/dto';
import { PaginatedResponse } from '../../core/interfaces';

export class RegistrationService {
  constructor(
    private readonly registrationRepo: RegistrationRepository,
    private readonly eventRepo: TournamentEventRepository,
    private readonly tournamentRepo: TournamentRepository
  ) {}

  async createRegistration(
    tournamentId: string, 
    eventId: string, 
    data: Partial<IRegistration>, 
    userId: string
  ): Promise<IRegistration> {
    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament');
    
    if (tournament.status !== TournamentStatus.RegistrationOpen) {
      throw new BusinessRuleException('Tournament registration is not currently open');
    }

    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException('TournamentEvent');

    // Check entry limits
    const currentRegistrations = await this.registrationRepo.count({ eventId, status: { $ne: RegistrationStatus.Cancelled } });
    
    let initialStatus = RegistrationStatus.Pending;
    if (event.maxEntries > 0 && currentRegistrations >= event.maxEntries) {
      initialStatus = RegistrationStatus.Waitlisted;
    }

    try {
      const registration = await this.registrationRepo.create({
        ...data,
        tournamentId,
        eventId,
        status: initialStatus,
        paymentStatus: 'Pending',
        auditLog: [{
          status: initialStatus,
          changedBy: userId,
          changedAt: new Date(),
          reason: 'Initial Registration'
        }],
        createdBy: userId,
        updatedBy: userId
      });
      return registration;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
        throw new ConflictException('Participant is already registered for this event');
      }
      throw error;
    }
  }

  async getRegistration(id: string): Promise<IRegistration> {
    const registration = await this.registrationRepo.findById(id);
    if (!registration) throw new NotFoundException('Registration');
    return registration;
  }

  async updateRegistrationStatus(id: string, newStatus: RegistrationStatus, userId: string, reason?: string): Promise<IRegistration> {
    const registration = await this.getRegistration(id);
    
    if (registration.status === newStatus) {
      return registration;
    }

    const updated = await this.registrationRepo.update(id, { 
      status: newStatus,
      $push: {
        auditLog: {
          status: newStatus,
          changedBy: userId,
          changedAt: new Date(),
          reason
        }
      },
      updatedBy: userId 
    } as Record<string, unknown>);

    return updated!;
  }

  async listRegistrations(options: QueryOptionsDto & { tournamentId?: string, eventId?: string }): Promise<PaginatedResponse<IRegistration>> {
    const { tournamentId, eventId, ...paginateOptions } = options;
    const filter: Record<string, unknown> = {};
    
    if (tournamentId) filter.tournamentId = tournamentId;
    if (eventId) filter.eventId = eventId;
    
    // Fallback: If search term 'query' is provided but unhandled here
    // You'd typically use repository.search(), but we are just filtering.
    
    const { data, ...meta } = await this.registrationRepo.paginate(filter, paginateOptions);
    return { data, meta };
  }
}
