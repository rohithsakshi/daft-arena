import { NextRequest, NextResponse } from 'next/server';
import { venueService } from '../../../../lib/container';
import { NotFoundException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const area = await venueService.getPlayingArea(id);
    return NextResponse.json({ data: area }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
