import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db/mongoose';
import { UserModel } from '../../../../modules/iam/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { email, secret } = body;

    if (secret !== 'temp_secret_123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const result = await UserModel.deleteOne({ email });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
