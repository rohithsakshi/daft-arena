import { NextRequest, NextResponse } from 'next/server';
import { venueService } from '../../../../../lib/container';
import { CreatePlayingAreaSchema } from '../../../../../modules/tournaments/validators/venue.schema';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const query = searchParams.get('query') || undefined;

  const result = await venueService.listPlayingAreas(id, { page, limit, query });
  return NextResponse.json(result, { status: 200 });
};

export const POST = withPermission('MANAGE_VENUES', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = CreatePlayingAreaSchema.parse({ ...body, venueId: id });
    const area = await venueService.createPlayingArea(id, data as any, user.sub);
    return NextResponse.json({ data: area }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
});
