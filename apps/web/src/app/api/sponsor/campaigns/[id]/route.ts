import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { SponsorCampaignModel } from '@/modules/sponsor/models/Campaign';
import { verifyToken } from '@/lib/auth/jwt';

async function getUserFromReq(req: NextRequest) {
  const cookie = req.cookies.get('token')?.value 
    || req.cookies.get('session')?.value 
    || req.cookies.get('daft_token')?.value 
    || req.cookies.get('daft_superadmin_token')?.value;
  const header = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookie || header;
  if (!token) {
    // Return mock user for local testing if no token is found
    return { sub: 'mock_sponsor_123', role: 'SPONSOR' };
  }
  return verifyToken(token);
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const user = await getUserFromReq(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const { id } = params;
    
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify it belongs to this sponsor
    const campaign = await SponsorCampaignModel.findOne({ _id: id, sponsorUserId: user.sub });
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    campaign.status = status;
    await campaign.save();

    return NextResponse.json({ success: true, data: campaign });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
