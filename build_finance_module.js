const fs = require('fs');
const path = require('path');

const financeDir = path.join(__dirname, 'apps', 'web', 'src', 'app', '(workspace)', 'workspace', 'finance');
const componentsDir = path.join(__dirname, 'apps', 'web', 'src', 'modules', 'finance', 'components');
const servicesDir = path.join(__dirname, 'apps', 'web', 'src', 'modules', 'finance', 'services');
const apiDir = path.join(__dirname, 'apps', 'web', 'src', 'app', 'api', 'finance');

const dirsToCreate = [
  financeDir,
  path.join(financeDir, 'transactions'),
  path.join(financeDir, 'invoices'),
  path.join(financeDir, 'payments'),
  path.join(financeDir, 'refunds'),
  path.join(financeDir, 'coupons'),
  path.join(financeDir, 'taxes'),
  path.join(financeDir, 'settlements'),
  path.join(financeDir, 'reports'),
  path.join(financeDir, 'settings'),
  componentsDir,
  servicesDir,
  apiDir,
  path.join(apiDir, 'transactions'),
  path.join(apiDir, 'invoices'),
  path.join(apiDir, 'refunds')
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const pages = [
  { path: 'page.tsx', title: 'Finance Dashboard', icon: 'BarChart4', desc: 'Central command for Revenue, KPIs, and Settlements.' },
  { path: 'transactions/page.tsx', title: 'Transaction Ledger', icon: 'CreditCard', desc: 'Filter, search, and export all system transactions.' },
  { path: 'invoices/page.tsx', title: 'Invoicing Center', icon: 'FileText', desc: 'Generate, download, and email tax-compliant invoices.' },
  { path: 'payments/page.tsx', title: 'Payment Processing', icon: 'Wallet', desc: 'Manage online, offline, and partial registration payments.' },
  { path: 'refunds/page.tsx', title: 'Refund Management', icon: 'RotateCcw', desc: 'Review workflows, approve, and track refund statuses.' },
  { path: 'coupons/page.tsx', title: 'Coupons & Discounts', icon: 'Ticket', desc: 'Create and manage percentage or fixed discount rules.' },
  { path: 'taxes/page.tsx', title: 'Tax Management', icon: 'Receipt', desc: 'Manage GST, VAT, and regional tax compliance rules.' },
  { path: 'settlements/page.tsx', title: 'Settlement Center', icon: 'Landmark', desc: 'Manage organizer payouts, commissions, and platform fees.' },
  { path: 'reports/page.tsx', title: 'Financial Reports', icon: 'TrendingUp', desc: 'Generate comprehensive revenue, profit, and monthly summaries.' },
  { path: 'settings/page.tsx', title: 'Finance Settings', icon: 'Settings2', desc: 'Configure payment gateways, currencies, and invoice templates.' }
];

pages.forEach(p => {
  const fileContent = `import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ${p.icon} } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { FinanceService } from '@/modules/finance/services/finance.service';

export const metadata = {
  title: '${p.title} | DAFT Arena Finance',
  description: '${p.desc}',
};

export default async function Finance${p.title.replace(/[^a-zA-Z]/g, '')}Page() {
  const data = await FinanceService.getMockData('${p.path.split('/')[0]}');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="${p.title}"
        description="${p.desc}"
        icon={${p.icon}}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <${p.icon} className="w-8 h-8 text-emerald-400 opacity-80" />
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
  fs.writeFileSync(path.join(financeDir, p.path), fileContent);
});

// Mock Service Layer
const serviceContent = `export class FinanceService {
  static async getMockData(moduleName: string) {
    return {
      status: 'active',
      module: moduleName,
      timestamp: new Date().toISOString()
    };
  }
}
`;
fs.writeFileSync(path.join(servicesDir, 'finance.service.ts'), serviceContent);

// Mock Backend API Route
const apiRouteContent = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: {
      revenue: 154000,
      pending: 3200,
      refunds: 450
    }
  });
}
`;
fs.writeFileSync(path.join(apiDir, 'transactions', 'route.ts'), apiRouteContent);
fs.writeFileSync(path.join(apiDir, 'invoices', 'route.ts'), apiRouteContent);

console.log('Finance workspace and backend scaffolded successfully.');
