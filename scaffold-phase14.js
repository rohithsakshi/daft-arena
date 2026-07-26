const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'web', 'src');

const files = {
  // Realtime Index
  'modules/realtime/index.ts': `export * from './interfaces';
export * from './providers/DefaultRealTimeProvider';
`,
  // Repositories
  'modules/operations/repositories/IncidentRepository.ts': `import { IIncident } from '../models';

export class IncidentRepository {
  private static incidents: IIncident[] = []; // In-memory fallback for now
  
  async findAll(tournamentId: string): Promise<IIncident[]> {
    return IncidentRepository.incidents.filter(i => i.tournamentId === tournamentId);
  }
  
  async create(incident: IIncident): Promise<IIncident> {
    IncidentRepository.incidents.push(incident);
    return incident;
  }
}
`,
  'modules/operations/repositories/CheckInRepository.ts': `import { ICheckIn } from '../models';

export class CheckInRepository {
  private static checkIns: ICheckIn[] = [];
  
  async findAll(tournamentId: string): Promise<ICheckIn[]> {
    return CheckInRepository.checkIns.filter(c => c.tournamentId === tournamentId);
  }
  
  async create(checkIn: ICheckIn): Promise<ICheckIn> {
    CheckInRepository.checkIns.push(checkIn);
    return checkIn;
  }
}
`,
  'modules/operations/repositories/CourtRepository.ts': `import { ICourtStatus } from '../models';

export class CourtRepository {
  private static courts: ICourtStatus[] = [];
  
  async findAll(tournamentId: string): Promise<ICourtStatus[]> {
    return CourtRepository.courts;
  }
}
`,
  // Operations API
  'app/api/operations/incidents/route.ts': `import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
  
  const service = new OperationsService();
  const incidents = await service.getIncidents(tournamentId);
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = new OperationsService();
  const incident = await service.createIncident(data);
  return NextResponse.json(incident, { status: 201 });
}
`,
  'app/api/operations/check-ins/route.ts': `import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
  
  const service = new OperationsService();
  const checkIns = await service.getCheckIns(tournamentId);
  return NextResponse.json(checkIns);
}
`,
  'app/api/operations/courts/route.ts': `import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
  
  const service = new OperationsService();
  const courts = await service.getCourts(tournamentId);
  return NextResponse.json(courts);
}
`,
  'app/api/operations/dashboard/route.ts': `import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
  
  const service = new OperationsService();
  const dashboard = await service.getDashboardData(tournamentId);
  return NextResponse.json(dashboard);
}
`,
  // Frontend Components
  'app/(workspace)/workspace/tournaments/[tournamentId]/operations/page.tsx': `import React from 'react';
import { DashboardView } from '@/modules/operations/components/DashboardView';

export default function OperationsPage({ params }: { params: { tournamentId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
        Tournament Operations
      </h1>
      <DashboardView tournamentId={params.tournamentId} />
    </div>
  );
}
`,
  'modules/operations/components/DashboardView.tsx': `'use client';
import React, { useEffect, useState } from 'react';

export function DashboardView({ tournamentId }: { tournamentId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(\`/api/operations/dashboard?tournamentId=\${tournamentId}\`)
      .then(r => r.json())
      .then(setData);
  }, [tournamentId]);

  if (!data) return <div className="text-white">Loading Operations Dashboard...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Live Matches" value={data.liveMatchesCount} />
      <StatCard title="Delayed Matches" value={data.delayedMatchesCount} />
      <StatCard title="Open Incidents" value={data.openIncidentsCount} />
      <StatCard title="Players Checked In" value={data.checkedInPlayersCount} />
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
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
