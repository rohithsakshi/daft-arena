import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { NotificationModel } from '@/modules/notifications/models/Notification';
import { verifyToken } from '@/lib/auth/jwt';

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (payload?.sub) return payload.sub;
  }
  // Cookie fallback
  const token = req.cookies.get('token')?.value || req.cookies.get('session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sub) return payload.sub;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const filter: any = { targetUserId: userId };
    if (status && (status === 'UNREAD' || status === 'READ')) {
      filter.status = status;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      NotificationModel.countDocuments(filter),
      NotificationModel.countDocuments({ targetUserId: userId, status: 'UNREAD' }),
    ]);

    return NextResponse.json({ success: true, data: notifications, total, unreadCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { ids, markAll } = body;

    if (markAll) {
      await NotificationModel.updateMany({ targetUserId: userId, status: 'UNREAD' }, { status: 'READ' });
    } else if (ids?.length) {
      await NotificationModel.updateMany({ _id: { $in: ids }, targetUserId: userId }, { status: 'READ' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
