import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/modules/iam/models/User';
import { verifyToken } from '@/lib/auth/jwt';

async function getUserFromReq(req: NextRequest) {
  const cookie = req.cookies.get('token')?.value || req.cookies.get('session')?.value;
  const header = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookie || header;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromReq(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await UserModel.findById(user.sub).select('-password -passwordHash').lean();
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromReq(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const allowedFields = [
      'name', 'avatar', 'phone', 'bio', 'city', 'state', 'country',
      'sports', 'dateOfBirth', 'gender',
      'emergencyContact', 'medicalDetails',
    ];

    const update: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    const updated = await UserModel.findByIdAndUpdate(
      user.sub,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password -passwordHash');

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
