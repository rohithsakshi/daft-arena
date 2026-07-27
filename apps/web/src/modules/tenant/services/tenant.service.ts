import { TenantRepository } from '../repositories/tenant.repository';
import { LicenseRepository } from '../repositories/license.repository';
import { ITenant } from '../models/TenantModel';

export class TenantService {
  constructor(
    private tenantRepository: TenantRepository,
    private licenseRepository: LicenseRepository
  ) {}

  async getTenantByDomain(domain: string): Promise<ITenant | null> {
    return this.tenantRepository.findByDomain(domain);
  }

  async validateTenantLicense(tenantId: string): Promise<boolean> {
    const license = await this.licenseRepository.findActiveLicenseForTenant(tenantId);
    return !!license;
  }
}
