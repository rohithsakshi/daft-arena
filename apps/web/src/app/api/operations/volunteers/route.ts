// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { OperationsService } from '../../../../modules/operations/services/OperationsService';

export async function GET(req: NextRequest) {
  try {
    const service = new OperationsService();
    const data = await service.getVolunteers('default');
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
