import { NextResponse } from 'next/server';
import { AIInsightRepository } from '@/modules/ai/repositories/AIInsightRepository';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const entityId = searchParams.get('entityId');
  const entityType = searchParams.get('entityType');
  
  if (!entityId || !entityType) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const repo = new AIInsightRepository();
  const insights = await repo.findByEntity(entityId, entityType);
  return NextResponse.json(insights);
}
