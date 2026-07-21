import { NextRequest, NextResponse } from 'next/server';
import { venueService } from '../../../../lib/container';
import { NotFoundException } from '../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ playingAreaId: string }> }) => {
  try {
    const { playingAreaId } = await params;
    const area = await venueService.getPlayingArea(playingAreaId);
    return NextResponse.json({ data: area }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
