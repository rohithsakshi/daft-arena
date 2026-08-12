import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Fetch all players
    const players = await UserModel.find({
      $or: [
        { systemRole: 'PLAYER' },
        { systemRole: { $exists: false } }
      ]
    }).select('name email tenantId').lean();

    const formatted = players.map((p: any) => ({
      id: p._id.toString(),
      name: p.name || p.email.split('@')[0],
      email: p.email,
      tenantId: p.tenantId ? p.tenantId.toString() : null
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
