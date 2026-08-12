import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import mongoose from 'mongoose';

/**
 * POST /api/superadmin/migrate/tournaments-soft-delete
 *
 * One-time migration: stamps deletedAt: null on every Tournament document
 * that is missing the field, so the new pre-find hook can match them correctly.
 * Safe to run multiple times (idempotent).
 */
export async function POST(_req: NextRequest) {
  try {
    await connectToDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }

    const tournaments = db.collection('tournaments');

    // Patch all documents that don't yet have deletedAt
    const result = await tournaments.updateMany(
      { deletedAt: { $exists: false } },
      { $set: { deletedAt: null, deletedBy: null } }
    );

    return NextResponse.json({
      message: 'Migration complete.',
      matched: result.matchedCount,
      modified: result.modifiedCount,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
