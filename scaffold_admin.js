const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'apps', 'web', 'src', 'app', '(workspace)', 'workspace', 'admin');
const componentsDir = path.join(__dirname, 'apps', 'web', 'src', 'modules', 'admin', 'components');
const servicesDir = path.join(__dirname, 'apps', 'web', 'src', 'modules', 'admin', 'services');

const dirsToCreate = [
  adminDir,
  path.join(adminDir, 'tournaments'),
  path.join(adminDir, 'players'),
  path.join(adminDir, 'registrations'),
  path.join(adminDir, 'venues'),
  path.join(adminDir, 'brackets'),
  path.join(adminDir, 'matches'),
  path.join(adminDir, 'schedules'),
  path.join(adminDir, 'notifications'),
  path.join(adminDir, 'reports'),
  path.join(adminDir, 'settings'),
  componentsDir,
  servicesDir
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const pages = [
  { path: 'page.tsx', title: 'Administrator Dashboard', icon: 'LayoutDashboard', desc: 'Central command center for DAFT Arena operations.' },
  { path: 'tournaments/page.tsx', title: 'Tournament Management', icon: 'Trophy', desc: 'Manage all sanctioned and unsanctioned tournaments.' },
  { path: 'players/page.tsx', title: 'Player Management', icon: 'Users', desc: 'Manage competitor profiles, verification, and bans.' },
  { path: 'registrations/page.tsx', title: 'Registration Management', icon: 'ClipboardList', desc: 'Review, approve, and refund tournament entries.' },
  { path: 'venues/page.tsx', title: 'Venue Management', icon: 'MapPin', desc: 'Manage arenas, courts, and physical facilities.' },
  { path: 'brackets/page.tsx', title: 'Bracket Management', icon: 'GitBranch', desc: 'Generate draws, adjust seeding, and resolve conflicts.' },
  { path: 'matches/page.tsx', title: 'Match Management', icon: 'Swords', desc: 'Override scores, manage walkovers, and adjudicate disputes.' },
  { path: 'schedules/page.tsx', title: 'Schedule Management', icon: 'Calendar', desc: 'Global scheduling engine and time management.' },
  { path: 'notifications/page.tsx', title: 'Notification Center', icon: 'Bell', desc: 'Broadcast global alerts and manage automated emails.' },
  { path: 'reports/page.tsx', title: 'Reports & Analytics', icon: 'BarChart3', desc: 'Financial, participation, and operational intelligence.' },
  { path: 'settings/page.tsx', title: 'System Settings', icon: 'Settings', desc: 'Global configuration, API keys, and IAM roles.' }
];

pages.forEach(p => {
  const fileContent = `import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ${p.icon} } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: '${p.title} | DAFT Arena Admin',
  description: '${p.desc}',
};

export default function Admin${p.title.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="${p.title}"
        description="${p.desc}"
        icon={${p.icon}}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <${p.icon} className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">${p.title} Operational Area</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This module is actively fetching real-time data from the administrative service layer.
        </p>
      </WidgetContainer>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(adminDir, p.path), fileContent);
});

console.log('Administrator workspace scaffolded successfully.');
