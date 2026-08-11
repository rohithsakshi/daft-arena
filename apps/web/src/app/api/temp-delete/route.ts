import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db/mongoose';
import { UserModel } from '../../../modules/iam/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const email = req.nextUrl.searchParams.get('email');
    if (email) {
      const result = await UserModel.deleteOne({ email });
      return NextResponse.json({ success: true, result });
    }
    return NextResponse.json({ success: false, message: 'No email provided' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
