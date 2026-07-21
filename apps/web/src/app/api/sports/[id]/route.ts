import { NextRequest, NextResponse } from 'next/server';
import { sportService } from '../../../../lib/container';
import { UpdateSportSchema } from '../../../../modules/sports/validators/sport.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const sport = await sportService.getSport(id);
    return NextResponse.json({ data: sport }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateSportSchema.parse(body);

    const sport = await sportService.updateSport(id, data as any, user.sub as string);
    return NextResponse.json({ data: sport }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});

export const DELETE = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await sportService.deleteSport(id, user.sub as string);
    return NextResponse.json({ message: 'Sport deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
