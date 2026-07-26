import { connectDB } from '../../../lib/mongodb';
import { PlayerLicenseRepository } from '../repositories/PlayerLicenseRepository';
import { IPlayerLicense, LicenseStatus } from '../models/PlayerLicense';
import { PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { auditService } from '../../iam/services/audit.service';
import { notificationService } from '../../notifications/services/notification.service';
import { DisciplinaryRepository } from '../repositories/DisciplinaryRepository';

export class PlayerLicenseService {
  constructor(
    private readonly licenseRepo: PlayerLicenseRepository,
    private readonly disciplinaryRepo: DisciplinaryRepository
  ) {}

  async issueLicense(
    data: Partial<IPlayerLicense>,
    issuedBy: string
  ): Promise<IPlayerLicense> {
    await connectDB();

    // Check player is not blacklisted
    if (data.playerId && data.federationId) {
      const isBlacklisted = await this.disciplinaryRepo.isPlayerBlacklisted(
        String(data.playerId),
        String(data.federationId)
      );
      if (isBlacklisted) {
        throw new Error('Cannot issue license: player is blacklisted from this federation.');
      }

      // Generate license number
      const prefix = String(data.federationId).slice(-4).toUpperCase();
      const suffix = Date.now().toString().slice(-6);
      data.licenseNumber = data.licenseNumber || `LIC-${prefix}-${suffix}`;
    }

    const license = await this.licenseRepo.create({ ...data, createdBy: issuedBy });

    await auditService.logAction({
      actorId: issuedBy,
      action: 'LICENSE_ISSUED',
      entityId: license.id,
      entityType: 'PlayerLicense',
      metadata: { licenseNumber: license.licenseNumber, type: license.type },
    });

    return license;
  }

  async renewLicense(id: string, renewedBy: string): Promise<IPlayerLicense | null> {
    await connectDB();
    const license = await this.licenseRepo.findById(id);
    if (!license) throw new Error('License not found');

    const newExpiry = new Date(license.expiryDate);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    const updated = await this.licenseRepo.update(id, {
      $set: {
        status: 'Active',
        renewedAt: new Date(),
        expiryDate: newExpiry,
        updatedBy: renewedBy,
      },
    });

    if (updated) {
      await auditService.logAction({
        actorId: renewedBy,
        action: 'LICENSE_RENEWED',
        entityId: id,
        entityType: 'PlayerLicense',
        metadata: { newExpiry },
      });
    }

    return updated;
  }

  async suspendLicense(id: string, reason: string, suspendedBy: string): Promise<IPlayerLicense | null> {
    await connectDB();
    const updated = await this.licenseRepo.updateStatus(id, 'Suspended', reason);

    if (updated) {
      await auditService.logAction({
        actorId: suspendedBy,
        action: 'LICENSE_SUSPENDED',
        entityId: id,
        entityType: 'PlayerLicense',
        metadata: { reason },
      });
    }

    return updated;
  }

  async revokeLicense(id: string, revokedBy: string): Promise<IPlayerLicense | null> {
    await connectDB();
    const updated = await this.licenseRepo.updateStatus(id, 'Revoked');

    if (updated) {
      await auditService.logAction({
        actorId: revokedBy,
        action: 'LICENSE_REVOKED',
        entityId: id,
        entityType: 'PlayerLicense',
      });
    }

    return updated;
  }

  async getLicensesByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IPlayerLicense>> {
    await connectDB();
    return this.licenseRepo.findByFederation(federationId, options);
  }

  async getPlayerLicenses(playerId: string): Promise<IPlayerLicense[]> {
    await connectDB();
    return this.licenseRepo.findByPlayer(playerId);
  }

  async getActiveLicense(playerId: string, federationId: string): Promise<IPlayerLicense | null> {
    await connectDB();
    return this.licenseRepo.findActiveByPlayer(playerId, federationId);
  }

  async getExpiringSoon(federationId: string, daysAhead: number = 30): Promise<IPlayerLicense[]> {
    await connectDB();
    return this.licenseRepo.findExpiringSoon(federationId, daysAhead);
  }

  async verifyPlayerEligibility(
    playerId: string,
    federationId: string
  ): Promise<{ eligible: boolean; reason?: string }> {
    await connectDB();

    const isSuspended = await this.disciplinaryRepo.isPlayerSuspended(playerId);
    if (isSuspended) return { eligible: false, reason: 'Player is currently suspended.' };

    const isBlacklisted = await this.disciplinaryRepo.isPlayerBlacklisted(playerId, federationId);
    if (isBlacklisted) return { eligible: false, reason: 'Player is blacklisted from this federation.' };

    const activeLicense = await this.licenseRepo.findActiveByPlayer(playerId, federationId);
    if (!activeLicense) return { eligible: false, reason: 'No active license found for this player.' };

    return { eligible: true };
  }
}
