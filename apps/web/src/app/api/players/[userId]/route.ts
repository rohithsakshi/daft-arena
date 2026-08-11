import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlayerModel } from '@/modules/player/models/Player.schema';
import { UserModel } from '@/modules/iam/models/User';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { MatchStatus } from '@/modules/core/enums';

export async function GET(req: Request, props: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB();
    const { userId } = await props.params;

    // Fetch the User
    const user = await UserModel.findById(userId).select('-hashedPassword');
    if (!user) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Fetch or create the Player stats record
    let player = await PlayerModel.findOne({ userId });
    
    // Fetch recent matches
    // 1. Find all registrations for this user
    const registrations = await RegistrationModel.find({ participantIds: userId }).select('_id tournamentId eventId');
    const registrationIds = registrations.map(r => r._id);

    // 2. Find matches where this user's registration was participant1 or participant2
    const matches = await MatchModel.find({
      $or: [
        { participant1Id: { $in: registrationIds } },
        { participant2Id: { $in: registrationIds } }
      ],
      status: MatchStatus.Completed
    })
      .populate('tournamentId', 'name')
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .sort({ endTime: -1 })
      .limit(10)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: {
        profile: user,
        stats: player || {
          totalMatches: 0,
          wins: 0,
          losses: 0,
          points: 0,
          rank: 0,
          rating: 0
        },
        recentMatches: matches
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
