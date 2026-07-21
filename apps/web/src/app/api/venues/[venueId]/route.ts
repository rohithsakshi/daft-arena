import { NextRequest, NextResponse } from 'next/server';
import { venueService } from '../../../../lib/container';
import { UpdateVenueSchema } from '../../../../modules/tournaments/validators/venue.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ venueId: string }> }) => {
  try {
    const { venueId } = await params;
    const venue = await venueService.getVenue(venueId);
    return NextResponse.json({ data: venue }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_VENUES', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ venueId: string }> }) => {
  try {
    const { venueId } = await params;
    const body = await req.json();
    const data = UpdateVenueSchema.parse(body);
    const venue = await venueService.updateVenue(venueId, data as never, user.sub);
    return NextResponse.json({ data: venue }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    return NextResponse.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 });
  }
});
