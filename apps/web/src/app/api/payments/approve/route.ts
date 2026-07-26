import { NextRequest, NextResponse } from 'next/server';
import { PaymentRepository } from '../../../../modules/finance/repositories/payment.repository';
// import { RegistrationRepository } from ... 
// import { EmailService } from ...

const paymentRepo = new PaymentRepository();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const paymentId = formData.get('paymentId') as string;

    if (!paymentId) return NextResponse.redirect(new URL('/workspace/admin/payments', req.url));

    const payment = await paymentRepo.findById(paymentId);
    if (!payment) return NextResponse.redirect(new URL('/workspace/admin/payments', req.url));

    await paymentRepo.update(paymentId, { status: 'APPROVED' });
    
    // In a real flow:
    // 1. Update Registration Status to 'REGISTERED'
    // 2. Send email notification via EmailService
    // 3. Log Audit Activity

    return NextResponse.redirect(new URL('/workspace/admin/payments', req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL('/workspace/admin/payments', req.url));
  }
}
