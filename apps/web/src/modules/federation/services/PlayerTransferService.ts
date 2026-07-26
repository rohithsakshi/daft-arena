import { connectDB } from '../../../lib/mongodb';
import { PlayerTransferRepository } from '../repositories/PlayerTransferRepository';
import { IPlayerTransfer } from '../models/PlayerTransfer';
import { auditService } from '../../iam/services/audit.service';

export class PlayerTransferService {
  constructor(private readonly transferRepo: PlayerTransferRepository) {}

  async requestTransfer(data: Partial<IPlayerTransfer>, requestedBy: string): Promise<IPlayerTransfer> {
    await connectDB();
    const transfer = await this.transferRepo.create({ ...data, requestedBy, requestedAt: new Date() });
    await auditService.logAction({
      actorId: requestedBy, action: 'TRANSFER_REQUESTED', entityId: transfer.id, entityType: 'PlayerTransfer'
    });
    return transfer;
  }
}
