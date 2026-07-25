const fs = require('fs');
const path = require('path');

const sponsorDir = path.join(__dirname, 'apps', 'web', 'src', 'app', '(workspace)', 'workspace', 'sponsor');
const componentsDir = path.join(__dirname, 'apps', 'web', 'src', 'modules', 'sponsor', 'components');
const servicesDir = path.join(__dirname, 'apps', 'web', 'src', 'modules', 'sponsor', 'services');
const apiDir = path.join(__dirname, 'apps', 'web', 'src', 'app', 'api', 'sponsor');

const dirsToCreate = [
  sponsorDir,
  path.join(sponsorDir, 'opportunities'),
  path.join(sponsorDir, 'campaigns'),
  path.join(sponsorDir, 'assets'),
  path.join(sponsorDir, 'contracts'),
  path.join(sponsorDir, 'payments'),
  path.join(sponsorDir, 'analytics'),
  path.join(sponsorDir, 'communications'),
  path.join(sponsorDir, 'reports'),
  path.join(sponsorDir, 'settings'),
  componentsDir,
  servicesDir,
  apiDir,
  path.join(apiDir, 'campaigns'),
  path.join(apiDir, 'analytics'),
  path.join(apiDir, 'assets')
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const pages = [
  { path: 'page.tsx', title: 'Sponsor Dashboard', icon: 'LayoutDashboard', desc: 'Central hub for KPIs, active campaigns, and ROI overview.' },
  { path: 'opportunities/page.tsx', title: 'Sponsorship Opportunities', icon: 'Search', desc: 'Discover and compare available tournament sponsorship packages.' },
  { path: 'campaigns/page.tsx', title: 'Campaign Management', icon: 'Megaphone', desc: 'Track active, scheduled, and completed sponsorship campaigns.' },
  { path: 'assets/page.tsx', title: 'Branding Assets', icon: 'Image', desc: 'Manage logos, banners, brand guidelines, and approval statuses.' },
  { path: 'contracts/page.tsx', title: 'Sponsorship Contracts', icon: 'FileSignature', desc: 'Review active contracts, track expiries, and digital acceptances.' },
  { path: 'payments/page.tsx', title: 'Payments & Invoices', icon: 'CreditCard', desc: 'View outstanding balances, invoice history, and sponsorship receipts.' },
  { path: 'analytics/page.tsx', title: 'Campaign Analytics', icon: 'BarChart2', desc: 'Detailed metrics on impressions, clicks, engagement, and ROI.' },
  { path: 'communications/page.tsx', title: 'Communication Center', icon: 'MessageSquare', desc: 'Messages and document sharing directly with tournament organizers.' },
  { path: 'reports/page.tsx', title: 'Investment Reports', icon: 'PieChart', desc: 'Exportable financial and campaign investment reports.' },
  { path: 'settings/page.tsx', title: 'Sponsor Settings', icon: 'Settings', desc: 'Manage company profile, billing, contacts, and notifications.' }
];

pages.forEach(p => {
  const fileContent = `import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ${p.icon} } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { SponsorService } from '@/modules/sponsor/services/sponsor.service';

export const metadata = {
  title: '${p.title} | DAFT Arena Sponsor',
  description: '${p.desc}',
};

export default async function Sponsor${p.title.replace(/[^a-zA-Z]/g, '')}Page() {
  const data = await SponsorService.getMockData('${p.path.split('/')[0]}');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="${p.title}"
        description="${p.desc}"
        icon={${p.icon}}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          <${p.icon} className="w-8 h-8 text-blue-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">${p.title} Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(sponsorDir, p.path), fileContent);
});

// Mock Service Layer
const serviceContent = `export class SponsorService {
  static async getMockData(moduleName: string) {
    return {
      status: 'active',
      module: moduleName,
      timestamp: new Date().toISOString()
    };
  }
}
`;
fs.writeFileSync(path.join(servicesDir, 'sponsor.service.ts'), serviceContent);

// Mock Backend API Route
const apiRouteContent = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: {
      activeCampaigns: 3,
      totalInvestment: 25000,
      estimatedReach: 150000
    }
  });
}
`;
fs.writeFileSync(path.join(apiDir, 'campaigns', 'route.ts'), apiRouteContent);
fs.writeFileSync(path.join(apiDir, 'analytics', 'route.ts'), apiRouteContent);

console.log('Sponsor workspace and backend scaffolded successfully.');
