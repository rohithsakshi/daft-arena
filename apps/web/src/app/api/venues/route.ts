import { NextRequest, NextResponse } from 'next/server';
import { venueService } from '../../../lib/container';
import { CreateVenueSchema } from '../../../modules/tournaments/validators/venue.schema';
import { withAuth } from '../../../modules/iam/guards/auth.guard';
import { withPermission } from '../../../modules/iam/guards/permission.guard';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const query = searchParams.get('query') || undefined;

  const result = await venueService.listVenues({ page, limit, query });
  return NextResponse.json(result, { status: 200 });
};

export const POST = withPermission('MANAGE_VENUES', async (req: NextRequest, user: { sub: string }) => {
  try {
    const body = await req.json();
    const data = CreateVenueSchema.parse(body);
    const venue = await venueService.createVenue(data as any, user.sub);
    return NextResponse.json({ data: venue }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 });
  }
});
