import { NextRequest, NextResponse } from 'next/server';
import { eventService, eventRepository } from '../../../../../lib/container';
import { CreateEventSchema } from '../../../../../modules/tournaments/validators/event.schema';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const events = await eventRepository.findByTournamentId(id);
  return NextResponse.json({ data: events }, { status: 200 });
};

export const POST = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = CreateEventSchema.parse({ ...body, tournamentId: id });
    const event = await eventService.createEvent(id, data as any, user.sub);
    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
