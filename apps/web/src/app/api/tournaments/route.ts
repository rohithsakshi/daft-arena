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
    const tournament = await tournamentService.createTournament(data as any, user.sub);
    return NextResponse.json({ data: tournament }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
});
