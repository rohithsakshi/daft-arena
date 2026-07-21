import { RulePackageRepository } from '../repositories';
import { IRulePackage } from '../models/RulePackage';
import { ConflictException, NotFoundException, BusinessRuleException, ValidationException } from '../../core/exceptions';

export class RulePackageService {
  constructor(private readonly rulePackageRepository: RulePackageRepository) {}

  async createPackage(sportId: string, data: Partial<IRulePackage>, userId: string): Promise<IRulePackage> {
    const existingVersions = await this.rulePackageRepository.findVersions(sportId, data.name!);
    
    if (existingVersions.some(v => v.packageVersion === data.packageVersion)) {
      throw new ConflictException(`Rule Package ${data.name} version ${data.packageVersion} already exists`);
    }

    if (data.parentPackageId) {
      const parent = await this.rulePackageRepository.findById(data.parentPackageId as string);
      if (!parent) throw new NotFoundException('Parent Rule Package');
      
      // Inheritance logic: merge parent configs with provided overrides
      // (Simplified for this boilerplate)
      data = { ...parent, ...data, id: undefined, _id: undefined };
    }

    return this.rulePackageRepository.create({
      ...data,
      sportId,
      status: 'Draft',
      createdBy: userId,
      updatedBy: userId
    });
  }

  async updatePackage(id: string, data: Partial<IRulePackage>, userId: string): Promise<IRulePackage> {
    const existing = await this.getPackage(id);
    
    if (existing.status !== 'Draft') {
      throw new BusinessRuleException('Only Draft packages can be modified. Create a new version instead.');
    }

    const updated = await this.rulePackageRepository.update(id, {
      ...data,
      updatedBy: userId
    });

    return updated!;
  }

  async publishPackage(id: string, userId: string): Promise<IRulePackage> {
    const existing = await this.getPackage(id);
    
    if (existing.status === 'Published') {
      throw new BusinessRuleException('Package is already published');
    }

    // Configuration Validation Rules
    this.validateConfiguration(existing);

    // Find if there is an active version of this package and deprecate it
    const activePackages = await this.rulePackageRepository.findMany({ 
      sportId: existing.sportId, 
      name: existing.name, 
      status: 'Published' 
    });

    await this.rulePackageRepository.withTransaction(async (session) => {
      for (const pkg of activePackages) {
        await this.rulePackageRepository.update(pkg.id!, { status: 'Deprecated', updatedBy: userId }, { session });
      }

      await this.rulePackageRepository.update(id, { 
        status: 'Published',
        publishedAt: new Date(),
        publishedBy: userId,
        updatedBy: userId
      }, { session });
    });

    return this.getPackage(id);
  }

  async getPackage(id: string): Promise<IRulePackage> {
    const pkg = await this.rulePackageRepository.findById(id);
    if (!pkg) {
      throw new NotFoundException('Rule Package');
    }
    return pkg;
  }

  private validateConfiguration(pkg: IRulePackage) {
    if (!pkg.scoringSystem || pkg.scoringSystem.sets < 1) {
      throw new ValidationException('Invalid scoring configuration');
    }
    if (!pkg.matchFormats || pkg.matchFormats.length === 0) {
      throw new ValidationException('At least one match format is required');
    }
    // ... Additional complex domain validations
  }
}
