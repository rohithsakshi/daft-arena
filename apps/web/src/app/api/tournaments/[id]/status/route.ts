import { NextRequest, NextResponse } from 'next/server';
import { tournamentService } from '../../../../../lib/container';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { NotFoundException, BusinessRuleException } from '../../../../../modules/core/exceptions';
import { TournamentStatus } from '../../../../../modules/core/enums';
import { z } from 'zod';

const StatusChangeSchema = z.object({
  status: z.nativeEnum(TournamentStatus)
});

export const POST = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = StatusChangeSchema.parse(body);
    
    const tournament = await tournamentService.changeStatus(id, status, user.sub);
    return NextResponse.json({ data: tournament }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
