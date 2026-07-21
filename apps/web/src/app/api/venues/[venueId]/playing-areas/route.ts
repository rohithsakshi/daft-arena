import { NextRequest, NextResponse } from 'next/server';
import { venueService } from '../../../../../lib/container';
import { CreatePlayingAreaSchema } from '../../../../../modules/tournaments/validators/venue.schema';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ venueId: string }> }) => {
  const { venueId } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const query = searchParams.get('query') || undefined;

  const result = await venueService.listPlayingAreas(venueId, { page, limit, query });
  return NextResponse.json(result, { status: 200 });
};

export const POST = withPermission('MANAGE_VENUES', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ venueId: string }> }) => {
  try {
    const { venueId } = await params;
    const body = await req.json();
    const data = CreatePlayingAreaSchema.parse({ ...body, venueId });
    const area = await venueService.createPlayingArea(venueId, data as never, user.sub);
    return NextResponse.json({ data: area }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 });
  }
});
