import { NextRequest, NextResponse } from 'next/server';
import { tournamentService } from '../../../../lib/container';
import { UpdateTournamentSchema } from '../../../../modules/tournaments/validators/tournament.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const tournament = await tournamentService.getTournament(id);
    return NextResponse.json({ data: tournament }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateTournamentSchema.parse(body);
    const tournament = await tournamentService.updateTournament(id, data as any, user.sub);
    return NextResponse.json({ data: tournament }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
});

export const DELETE = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await tournamentService.deleteDraft(id, user.sub);
    return NextResponse.json({ message: 'Draft deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
