import { connectDB } from '../../../lib/mongodb';
import { DisciplinaryRepository } from '../repositories/DisciplinaryRepository';
import { IDisciplinaryRecord, DisciplinaryActionType } from '../models/DisciplinaryRecord';
import { PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { auditService } from '../../iam/services/audit.service';
import { notificationService } from '../../notifications/services/notification.service';
import { liveUpdateService } from '../../realtime';

export class DisciplinaryService {
  constructor(private readonly disciplinaryRepo: DisciplinaryRepository) {}

  async issueAction(
    data: Partial<IDisciplinaryRecord>,
    issuedBy: string
  ): Promise<IDisciplinaryRecord> {
    await connectDB();

    if (data.actionType === 'Suspension' && data.suspensionDays) {
      const start = data.suspensionStartDate || new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + data.suspensionDays);
      data.suspensionStartDate = start;
      data.suspensionEndDate = end;
    }

    const record = await this.disciplinaryRepo.create({
      ...data,
      issuedBy,
      issuedAt: new Date(),
      status: 'Active',
      createdBy: issuedBy,
    });

    await auditService.logAction({
      actorId: issuedBy,
      action: 'DISCIPLINARY_ACTION_ISSUED',
      entityId: record.id,
      entityType: 'DisciplinaryRecord',
      metadata: { actionType: record.actionType, severity: record.status },
    });

    await liveUpdateService.broadcastAnnouncement(
      `Disciplinary action issued: ${record.actionType}`
    );

    return record;
  }

  async processAppeal(
    id: string,
    decision: 'Upheld' | 'Overturned',
    appealDecision: string,
    decidedBy: string
  ): Promise<IDisciplinaryRecord | null> {
    await connectDB();

    const updated = await this.disciplinaryRepo.update(id, {
      $set: {
        status: decision,
        appealDecision,
        appealDecidedAt: new Date(),
        updatedBy: decidedBy,
      },
    });

    if (updated) {
      await auditService.logAction({
        actorId: decidedBy,
        action: 'DISCIPLINARY_APPEAL_DECIDED',
        entityId: id,
        entityType: 'DisciplinaryRecord',
        metadata: { decision, appealDecision },
      });
    }

    return updated;
  }

  async getByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IDisciplinaryRecord>> {
    await connectDB();
    return this.disciplinaryRepo.findByFederation(federationId, options);
  }

  async getPlayerHistory(playerId: string): Promise<IDisciplinaryRecord[]> {
    await connectDB();
    return this.disciplinaryRepo.findByPlayer(playerId);
  }

  async checkPlayerStatus(
    playerId: string,
    federationId: string
  ): Promise<{ isSuspended: boolean; isBlacklisted: boolean }> {
    await connectDB();
    const [isSuspended, isBlacklisted] = await Promise.all([
      this.disciplinaryRepo.isPlayerSuspended(playerId),
      this.disciplinaryRepo.isPlayerBlacklisted(playerId, federationId),
    ]);
    return { isSuspended, isBlacklisted };
  }
}
