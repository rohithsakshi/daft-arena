// @ts-nocheck
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: {
      revenue: 154000,
      pending: 3200,
      refunds: 450
    }
  });
}
