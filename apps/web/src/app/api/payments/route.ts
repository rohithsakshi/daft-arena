import { NextRequest, NextResponse } from 'next/server';
import { PaymentRepository } from '../../../modules/finance/repositories/payment.repository';
import { verifyToken } from '../../../lib/auth/jwt';

const paymentRepo = new PaymentRepository();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const user = await verifyToken(authHeader.replace('Bearer ', ''));
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { tournamentId, amount, utr, screenshotUrl } = data;

    if (!tournamentId || !utr || !amount) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const payment = await paymentRepo.create({
      playerId: user.sub,
      tournamentId,
      amount,
      utr,
      screenshotUrl,
      status: 'PENDING'
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error: any) {
    console.error('Payment Submission Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
