const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'web', 'src');

const files = {
  // SERVICES
  'modules/federation/services/FederationDocumentService.ts': `import { connectDB } from '../../../lib/mongodb';
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
      await liveUpdateService.broadcastAnnouncement(\`New Document Published: \${doc.title}\`);
    }
    return doc;
  }
}
`,

  'modules/federation/services/OfficialCertificationService.ts': `import { connectDB } from '../../../lib/mongodb';
import { OfficialCertificationRepository } from '../repositories/OfficialCertificationRepository';
import { IOfficialCertification } from '../models/OfficialCertification';
import { auditService } from '../../iam/services/audit.service';

export class OfficialCertificationService {
  constructor(private readonly certRepo: OfficialCertificationRepository) {}

  async issueCertification(data: Partial<IOfficialCertification>, issuedBy: string): Promise<IOfficialCertification> {
    await connectDB();
    const cert = await this.certRepo.create({ ...data, createdBy: issuedBy });
    await auditService.logAction({
      actorId: issuedBy, action: 'CERTIFICATION_ISSUED', entityId: cert.id, entityType: 'OfficialCertification'
    });
    return cert;
  }
}
`,

  'modules/federation/services/PlayerTransferService.ts': `import { connectDB } from '../../../lib/mongodb';
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
`,

  'modules/federation/services/index.ts': `export * from './FederationService';
export * from './RankingService';
export * from './PlayerLicenseService';
export * from './ApprovalWorkflowService';
export * from './DisciplinaryService';
export * from './FederationDocumentService';
export * from './OfficialCertificationService';
export * from './PlayerTransferService';
`,

  // API ROUTES
  'app/api/federation/dashboard/route.ts': `import { NextResponse } from 'next/server';
import { FederationService } from '@/modules/federation/services/FederationService';
import { FederationRepository } from '@/modules/federation/repositories/FederationRepository';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const federationId = searchParams.get('federationId');
  if (!federationId) return NextResponse.json({ error: 'Missing federationId' }, { status: 400 });
  
  const repo = new FederationRepository();
  const service = new FederationService(repo);
  const stats = await service.getDashboardStats(federationId);
  return NextResponse.json(stats);
}
`,

  // FRONTEND PAGES
  'app/(workspace)/workspace/federation/national/page.tsx': `import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Users, ShieldAlert, FileText, Trophy } from 'lucide-react';

export default function NationalFederationPage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="National Federation Dashboard" description="Manage all affiliated states, national rankings, and policies." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticWidget title="Affiliated States" value="28" icon={Users} />
        <StatisticWidget title="Active Workflows" value="14" icon={FileText} />
        <StatisticWidget title="Open Incidents" value="3" icon={ShieldAlert} />
        <StatisticWidget title="Ranked Players" value="1,245" icon={Trophy} />
      </div>
    </div>
  );
}
`,
  'app/(workspace)/workspace/federation/state/page.tsx': `import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Users, FileText } from 'lucide-react';

export default function StateAssociationPage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="State Association Dashboard" description="Manage district associations and state-level governance." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticWidget title="Affiliated Districts" value="12" icon={Users} />
        <StatisticWidget title="Pending Approvals" value="5" icon={FileText} />
      </div>
    </div>
  );
}
`,
  'app/(workspace)/workspace/federation/district/page.tsx': `import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Users, FileText } from 'lucide-react';

export default function DistrictAssociationPage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="District Association Dashboard" description="Manage clubs, academies, and local events." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticWidget title="Affiliated Clubs" value="45" icon={Users} />
        <StatisticWidget title="Local Events" value="8" icon={FileText} />
      </div>
    </div>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(srcDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filePath);
}
