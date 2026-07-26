import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { FederationDocumentModel, IFederationDocument, DocumentCategory, DocumentStatus } from '../models/FederationDocument';

export class FederationDocumentRepository extends BaseRepository<IFederationDocument> {
  constructor() {
    super(FederationDocumentModel);
  }

  async findByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IFederationDocument>> {
    return this.paginate({ federationId }, { ...options, sort: { publishedAt: -1 } });
  }

  async findPublished(
    federationId: string,
    category?: DocumentCategory
  ): Promise<IFederationDocument[]> {
    const filter: Record<string, unknown> = { federationId, status: 'Published' };
    if (category) filter.category = category;
    return this.findMany(filter, { sort: { publishedAt: -1 } });
  }

  async publish(id: string, publishedBy: string): Promise<IFederationDocument | null> {
    return this.update(id, {
      $set: { status: 'Published', publishedAt: new Date(), publishedBy },
    });
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await FederationDocumentModel.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).exec();
  }

  async searchDocuments(
    federationId: string,
    query: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IFederationDocument>> {
    return this.search(
      query,
      ['title', 'referenceNumber', 'description', 'tags'],
      { federationId },
      options
    );
  }
}
