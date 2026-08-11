import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlayerModel } from '@/modules/player/models/Player.schema';
import { UserModel } from '@/modules/iam/models/User';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Fetch players sorted by points descending
    const players = await PlayerModel.find()
      .sort({ points: -1, wins: -1 }) // Sort by points, then by wins as tie-breaker
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar location') // Get public user info
      .lean();

    const total = await PlayerModel.countDocuments();

    return NextResponse.json({
      success: true,
      data: players,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
