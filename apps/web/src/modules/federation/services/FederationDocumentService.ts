import { connectDB } from '../../../lib/mongodb';
import { FederationDocumentRepository } from '../repositories/FederationDocumentRepository';
import { IFederationDocument, DocumentCategory } from '../models/FederationDocument';
import { PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { auditService } from '../../iam/services/audit.service';
import { liveUpdateService } from '../../realtime';

export class FederationDocumentService {
  constructor(private readonly docRepo: FederationDocumentRepository) {}

  async createDocument(data: Partial<IFederationDocument>, createdBy: string): Promise<IFederationDocument> {
    await connectDB();
    const doc = await this.docRepo.create({ ...data, createdBy });
    await auditService.logAction({
      actorId: createdBy, action: 'DOCUMENT_CREATED', entityId: doc.id, entityType: 'FederationDocument'
    });
    return doc;
  }

  async publishDocument(id: string, publishedBy: string): Promise<IFederationDocument | null> {
    await connectDB();
    const doc = await this.docRepo.publish(id, publishedBy);
    if (doc) {
      await auditService.logAction({
        actorId: publishedBy, action: 'DOCUMENT_PUBLISHED', entityId: doc.id, entityType: 'FederationDocument'
      });
      await liveUpdateService.broadcastAnnouncement(`New Document Published: ${doc.title}`);
    }
    return doc;
  }
}
