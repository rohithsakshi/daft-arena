// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { tournamentService } from '../../../../lib/container';
import { UpdateTournamentSchema } from '../../../../modules/tournaments/validators/tournament.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../modules/core/exceptions';
import connectToDatabase from '../../../../lib/db/mongoose';
import { TournamentModel } from '../../../../modules/tournaments/models/Tournament';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ tournamentId: string }> }) => {
  try {
    const { tournamentId } = await params;
    if (!tournamentId || tournamentId === 'undefined' || tournamentId.length !== 24) {
      return NextResponse.json({ error: 'Invalid tournament ID' }, { status: 400 });
    }
    const tournament = await tournamentService.getTournament(tournamentId);
    return NextResponse.json({ data: tournament }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    console.error('GET Tournament Error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ tournamentId: string }> }) => {
  try {
    const { tournamentId } = await params;
    const body = await req.json();
    const data = UpdateTournamentSchema.parse(body);
    const tournament = await tournamentService.updateTournament(tournamentId, data as never, user.sub);
    return NextResponse.json({ data: tournament }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 });
  }
});

/**
 * DELETE — Soft delete tournament (30-day retention).
 * The document is NOT removed from MongoDB. Instead, `deletedAt` is stamped.
 * Super admins can restore within 30 days. After that a cron purges it.
 */
export const DELETE = withPermission('MANAGE_TOURNAMENTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ tournamentId: string }> }) => {
  try {
    const { tournamentId } = await params;
    await connectToDatabase();

    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Compute purge date (30 days from now)
    const purgeDate = new Date();
    purgeDate.setDate(purgeDate.getDate() + 30);

    // Soft delete — stamp deletedAt, record who deleted it
    await TournamentModel.findByIdAndUpdate(tournamentId, {
      deletedAt: new Date(),
      deletedBy: user.sub,
    });

    return NextResponse.json({
      message: 'Tournament has been deleted and will be permanently removed after 30 days.',
      purgeDate: purgeDate.toISOString(),
      canRestore: true,
      restoreInfo: 'To restore this tournament within 30 days, contact your Super Administrator and provide the tournament name and deletion date.',
    }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    if (error instanceof BusinessRuleException) return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
