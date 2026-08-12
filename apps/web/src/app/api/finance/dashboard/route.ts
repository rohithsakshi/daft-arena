import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { PaymentModel } from '@/modules/finance/models/Payment.schema';
import { UserModel } from '@/modules/iam/models/User';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all payments
    const payments = await PaymentModel.find({}).sort({ createdAt: -1 }).lean();

    let totalRevenue = 0;
    let pendingAmount = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;

    const formattedPayments = [];

    for (const p of payments) {
      const amount = p.amount || 0;
      if (p.status === 'APPROVED') {
        totalRevenue += amount;
        successfulCount++;
      } else if (p.status === 'PENDING') {
        pendingAmount += amount;
        pendingCount++;
      } else {
        rejectedCount++;
      }

      // Resolve player name
      let playerName = 'Unknown Player';
      let playerEmail = '';
      if (p.playerId) {
        const player = await UserModel.findById(p.playerId).select('name email').lean();
        if (player) {
          playerName = player.name || player.email.split('@')[0];
          playerEmail = player.email;
        }
      }

      // Resolve tournament name
      let tournamentName = 'General Payment';
      if (p.tournamentId) {
        const tournament = await TournamentModel.findById(p.tournamentId).select('name').lean();
        if (tournament) {
          tournamentName = tournament.name;
        }
      }

      formattedPayments.push({
        id: p._id.toString(),
        playerId: p.playerId,
        playerName,
        playerEmail,
        tournamentId: p.tournamentId,
        tournamentName,
        utr: p.utr,
        amount,
        screenshotUrl: p.screenshotUrl || '',
        status: p.status,
        remarks: p.remarks || '',
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()
      });
    }

    // Mock chart data (last 7 days of revenue trends)
    const chartData = [
      { date: 'Aug 06', amount: Math.round(totalRevenue * 0.1) },
      { date: 'Aug 07', amount: Math.round(totalRevenue * 0.15) },
      { date: 'Aug 08', amount: Math.round(totalRevenue * 0.12) },
      { date: 'Aug 09', amount: Math.round(totalRevenue * 0.25) },
      { date: 'Aug 10', amount: Math.round(totalRevenue * 0.18) },
      { date: 'Aug 11', amount: Math.round(totalRevenue * 0.2) },
      { date: 'Aug 12', amount: totalRevenue }
    ];

    return NextResponse.json({
      summary: {
        totalRevenue,
        pendingAmount,
        successfulCount,
        pendingCount,
        rejectedCount,
        totalCount: payments.length
      },
      payments: formattedPayments,
      chartData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
