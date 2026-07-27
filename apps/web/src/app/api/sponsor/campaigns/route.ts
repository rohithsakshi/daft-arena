import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { SponsorCampaignModel } from '@/modules/sponsor/models/Campaign';
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
    await connectToDatabase();
    const user = await getUserFromReq(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const campaigns = await SponsorCampaignModel
      .find({ sponsorUserId: user.sub })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: campaigns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getUserFromReq(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, description, bannerUrl, logoUrl, sports, targetAudience, startDate, endDate, priority, ctaUrl } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'name, startDate and endDate are required' }, { status: 400 });
    }

    const campaign = await SponsorCampaignModel.create({
      sponsorUserId: user.sub,
      name,
      description,
      bannerUrl,
      logoUrl,
      sports: sports || [],
      targetAudience: targetAudience || 'PLAYERS',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      priority: priority || 5,
      ctaUrl,
      status: 'Draft',
    });

    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
