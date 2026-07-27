import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectToDatabase from '@/lib/db/mongoose';
import { UserRepository } from '@/modules/iam/repositories/user.repository';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('daft_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const userRepo = new UserRepository();
    const user = await userRepo.findById(String(payload.sub));

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: String(user.id || (user as any)._id),
        name: user.name,
        email: user.email,
        role: user.systemRole || payload.role || 'PLAYER',
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted ?? false,
        authProvider: user.authProvider,
        sports: (user as any).sports || [],
        phone: (user as any).phone || '',
        location: (user as any).location || '',
        bio: (user as any).bio || '',
      },
    });
  } catch (error: any) {
    console.error('Auth/me error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
