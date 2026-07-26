import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { FederationModel, IFederation, FederationType } from '../models/Federation';

export class FederationRepository extends BaseRepository<IFederation> {
  constructor() {
    super(FederationModel);
  }

  async findByType(type: FederationType, options?: PaginateOptions): Promise<IFederation[]> {
    return this.findMany({ type }, options);
  }

  async findChildren(parentId: string): Promise<IFederation[]> {
    return this.findMany({ parentId });
  }

  async findByCode(code: string): Promise<IFederation | null> {
    return this.findOne({ code: code.toUpperCase() });
  }

  async getHierarchy(federationId: string): Promise<IFederation[]> {
    const hierarchy: IFederation[] = [];
    let current = await this.findById(federationId);
    while (current) {
      hierarchy.unshift(current);
      if (current.parentId) {
        current = await this.findById(String(current.parentId));
      } else {
        break;
      }
    }
    return hierarchy;
  }

  async paginateByType(
    type: FederationType,
    filter: Record<string, unknown> = {},
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IFederation>> {
    return this.paginate({ ...filter, type }, options);
  }

  async searchFederations(
    query: string,
    filter: Record<string, unknown> = {},
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IFederation>> {
    return this.search(query, ['name', 'shortName', 'code', 'affiliationNumber'], filter, options);
  }
}
