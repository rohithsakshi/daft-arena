import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: {
      activeCampaigns: 3,
      totalInvestment: 25000,
      estimatedReach: 150000
    }
  });
}
