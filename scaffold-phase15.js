const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'web', 'src');

const files = {
  // MODELS
  'modules/organizations/models/index.ts': `import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(['Club', 'Academy', 'District', 'State', 'National']),
  parentOrgId: z.string().optional(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type IOrganization = z.infer<typeof OrganizationSchema>;

export const TeamSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  organizationId: z.string(),
  captainId: z.string().optional(),
  coachId: z.string().optional(),
  members: z.array(z.string()),
  category: z.string(),
  status: z.enum(['Active', 'Inactive']),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ITeam = z.infer<typeof TeamSchema>;

export const TransferSchema = z.object({
  id: z.string().optional(),
  playerId: z.string(),
  fromOrgId: z.string().optional(),
  toOrgId: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  effectiveDate: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ITransfer = z.infer<typeof TransferSchema>;
`,

  // REPOSITORIES
  'modules/organizations/repositories/OrganizationRepository.ts': `import { IOrganization } from '../models';

export class OrganizationRepository {
  private static organizations: IOrganization[] = [];
  
  async findById(id: string): Promise<IOrganization | null> {
    return OrganizationRepository.organizations.find(o => o.id === id) || null;
  }

  async findAll(): Promise<IOrganization[]> {
    return OrganizationRepository.organizations;
  }

  async create(org: IOrganization): Promise<IOrganization> {
    const newOrg = { ...org, id: \`org_\${Math.random().toString(36).substr(2, 9)}\`, createdAt: new Date().toISOString() };
    OrganizationRepository.organizations.push(newOrg);
    return newOrg;
  }
}
`,
  'modules/organizations/repositories/TeamRepository.ts': `import { ITeam } from '../models';

export class TeamRepository {
  private static teams: ITeam[] = [];
  
  async findByOrganization(orgId: string): Promise<ITeam[]> {
    return TeamRepository.teams.filter(t => t.organizationId === orgId);
  }

  async create(team: ITeam): Promise<ITeam> {
    const newTeam = { ...team, id: \`team_\${Math.random().toString(36).substr(2, 9)}\`, createdAt: new Date().toISOString() };
    TeamRepository.teams.push(newTeam);
    return newTeam;
  }
}
`,

  // SERVICES
  'modules/organizations/services/OrganizationService.ts': `import { IOrganization, ITeam, ITransfer } from '../models';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { liveUpdateService } from '@/modules/realtime';

export class OrganizationService {
  private orgRepo = new OrganizationRepository();
  private teamRepo = new TeamRepository();

  async getOrganization(id: string) {
    return this.orgRepo.findById(id);
  }

  async createOrganization(data: IOrganization) {
    const org = await this.orgRepo.create(data);
    await liveUpdateService.broadcastAnnouncement(\`New Organization Created: \${org.name}\`);
    return org;
  }

  async getTeams(orgId: string) {
    return this.teamRepo.findByOrganization(orgId);
  }

  async createTeam(data: ITeam) {
    return this.teamRepo.create(data);
  }
}
`,

  // API ROUTES
  'app/api/organizations/route.ts': `import { NextResponse } from 'next/server';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';

export async function GET(req: Request) {
  // Return dummy or empty for now
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = new OrganizationService();
  const org = await service.createOrganization(data);
  return NextResponse.json(org, { status: 201 });
}
`,

  // FRONTEND
  'app/(workspace)/workspace/organizations/[orgId]/page.tsx': `import React from 'react';
import { OrgDashboard } from '@/modules/organizations/components/OrgDashboard';

export default function OrganizationPage({ params }: { params: { orgId: string } }) {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
        Organization Dashboard
      </h1>
      <OrgDashboard orgId={params.orgId} />
    </div>
  );
}
`,
  'modules/organizations/components/OrgDashboard.tsx': `'use client';
import React, { useEffect, useState } from 'react';

export function OrgDashboard({ orgId }: { orgId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium">Teams</h3>
        <p className="text-3xl font-bold text-white mt-2">0</p>
      </div>
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium">Members</h3>
        <p className="text-3xl font-bold text-white mt-2">0</p>
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
