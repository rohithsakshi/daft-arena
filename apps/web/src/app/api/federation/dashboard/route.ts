import { NextResponse } from 'next/server';
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
