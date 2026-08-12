// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/db/mongoose';
import { TournamentModel } from '../../../../../../modules/tournaments/models/Tournament';
import { withAuth } from '../../../../../../modules/iam/guards/auth.guard';

/**
 * POST /api/superadmin/tournaments/[id]/restore
 * Restores a soft-deleted tournament within its 30-day retention window.
 * Super admin only.
 */
export const POST = withAuth(async (req: NextRequest, user: { sub: string; role: string }, { params }: { params: Promise<{ id: string }> }) => {
  // Only TOURNAMENT_ADMIN or SUPERADMIN can restore
  if (!['TOURNAMENT_ADMIN', 'SUPERADMIN'].includes(user.role?.toUpperCase())) {
    return NextResponse.json({ error: 'Forbidden — super admin access required' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    // Bypass the soft-delete pre-find hook using setOptions
    const tournament = await TournamentModel.findOne({ _id: id }).setOptions({ _includeDeleted: true });

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    if (!tournament.deletedAt) {
      return NextResponse.json({ error: 'Tournament is not deleted — no restore needed.' }, { status: 400 });
    }

    // Check if still within 30-day window
    const daysSinceDeletion = (Date.now() - tournament.deletedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDeletion > 30) {
      return NextResponse.json({
        error: 'The 30-day restoration window has expired. This tournament has been permanently purged.',
      }, { status: 410 });
    }

    // Restore: clear deletedAt and deletedBy
    await TournamentModel.findByIdAndUpdate(id, {
      $unset: { deletedAt: '', deletedBy: '' },
    });

    return NextResponse.json({
      message: `Tournament "${tournament.name}" has been successfully restored.`,
      tournament: { id: tournament._id, name: tournament.name, status: tournament.status },
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Restore tournament error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
