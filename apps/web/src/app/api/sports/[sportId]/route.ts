import { NextRequest, NextResponse } from 'next/server';
import { sportService } from '../../../../lib/container';
import { UpdateSportSchema } from '../../../../modules/sports/validators/sport.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ sportId: string }> }) => {
  try {
    const { sportId } = await params;
    const sport = await sportService.getSport(sportId);
    return NextResponse.json({ data: sport }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ sportId: string }> }) => {
  try {
    const { sportId } = await params;
    const body = await req.json();
    const data = UpdateSportSchema.parse(body);

    const sport = await sportService.updateSport(sportId, data as never, user.sub as string);
    return NextResponse.json({ data: sport }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    const message = error instanceof Error ? (error as Error).message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});

export const DELETE = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ sportId: string }> }) => {
  try {
    const { sportId } = await params;
    await sportService.deleteSport(sportId, user.sub as string);
    return NextResponse.json({ message: 'Sport deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
