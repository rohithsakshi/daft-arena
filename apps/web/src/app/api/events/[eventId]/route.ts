import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '../../../../lib/container';
import { UpdateEventSchema } from '../../../../modules/tournaments/validators/event.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) => {
  try {
    const { eventId } = await params;
    const event = await eventService.getEvent(eventId);
    return NextResponse.json({ data: event }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ eventId: string }> }) => {
  try {
    const { eventId } = await params;
    const body = await req.json();
    const data = UpdateEventSchema.parse(body);
    const event = await eventService.updateEvent(eventId, data as never, user.sub);
    return NextResponse.json({ data: event }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 });
  }
});

export const DELETE = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ eventId: string }> }) => {
  try {
    const { eventId } = await params;
    await eventService.deleteEvent(eventId, user.sub);
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
