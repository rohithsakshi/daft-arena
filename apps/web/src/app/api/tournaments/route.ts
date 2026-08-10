// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { tournamentService } from '../../../lib/container';
import { CreateTournamentSchema } from '../../../modules/tournaments/validators/tournament.schema';
import { withPermission } from '../../../modules/iam/guards/permission.guard';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const query = searchParams.get('query') || undefined;

  const result = await tournamentService.listTournaments({ page, limit, query });
  return NextResponse.json(result, { status: 200 });
};

export const POST = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }) => {
  try {
    const body = await req.json();
    const data = CreateTournamentSchema.parse(body);
    const tournament = await tournamentService.createTournament(data as any, user.sub || (user as any).id || 'system');
    return NextResponse.json({ data: tournament }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('Tournament Validation Error Issues:', JSON.stringify(error.issues, null, 2));
      const message = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      return NextResponse.json({ error: message || 'Validation Error', message, details: error.issues }, { status: 400 });
    }
    console.error('Tournament Creation Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 });
  }
});
