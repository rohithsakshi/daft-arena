import { NextRequest, NextResponse } from 'next/server';
import { PaymentRepository } from '../../../../modules/finance/repositories/payment.repository';

const paymentRepo = new PaymentRepository();

export async function POST(req: NextRequest) {
  try {
    let paymentId = '';
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const json = await req.json();
      paymentId = json.paymentId;
    } else {
      const formData = await req.formData();
      paymentId = formData.get('paymentId') as string;
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
    }

    const payment = await paymentRepo.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    await paymentRepo.update(paymentId, { status: 'REJECTED' });
    
    return NextResponse.json({ success: true, status: 'REJECTED' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
