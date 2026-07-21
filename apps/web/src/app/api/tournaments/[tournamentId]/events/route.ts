import { NextRequest, NextResponse } from 'next/server';
import { eventService, eventRepository } from '../../../../../lib/container';
import { CreateEventSchema } from '../../../../../modules/tournaments/validators/event.schema';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ tournamentId: string }> }) => {
  const { tournamentId } = await params;
  const events = await eventRepository.findByTournamentId(tournamentId);
  return NextResponse.json({ data: events }, { status: 200 });
};

export const POST = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ tournamentId: string }> }) => {
  try {
    const { tournamentId } = await params;
    const body = await req.json();
    const data = CreateEventSchema.parse({ ...body, tournamentId });
    const event = await eventService.createEvent(tournamentId, data as never, user.sub);
    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
