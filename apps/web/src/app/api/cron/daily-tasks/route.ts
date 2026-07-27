import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { TenantModel } from '@/modules/tenant/models/TenantModel';
import { AuditService } from '@/modules/audit/services/AuditService';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    // Basic security for the cron endpoint
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${config.JWT_SECRET}`) { // Using JWT secret as a placeholder for a CRON_SECRET
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const now = new Date();
    
    // 1. Suspend Expired Organizations
    const expiredTenants = await TenantModel.find({
      status: 'ACTIVE',
      expiryDate: { $lt: now }
    });

    for (const tenant of expiredTenants) {
      tenant.status = 'SUSPENDED';
      await tenant.save();
      
      await AuditService.log({
        action: 'SUBSCRIPTION_SUSPENDED',
        tenantId: tenant._id.toString(),
        details: { reason: 'Expiry date passed', expiryDate: tenant.expiryDate }
      });
      
      console.log(`[CRON] Suspended tenant ${tenant.name}`);
    }

    // 2. Renewal Reminders (30, 15, 7, 3, 1 days)
    // For MVP, we will just log that reminders would be sent.
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoon = await TenantModel.find({
      status: 'ACTIVE',
      expiryDate: { $gt: now, $lte: thirtyDaysFromNow }
    });

    for (const tenant of expiringSoon) {
      const daysLeft = Math.ceil((tenant.expiryDate!.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if ([30, 15, 7, 3, 1].includes(daysLeft)) {
        console.log(`[CRON] Sending ${daysLeft}-day renewal reminder to ${tenant.contactEmail}`);
        // Integration with email/notification service goes here
      }
    }

    return NextResponse.json({ 
      success: true, 
      suspendedCount: expiredTenants.length,
      remindersSentCount: expiringSoon.length 
    });
  } catch (error: any) {
    console.error('Daily Cron Error:', error);
    return NextResponse.json({ success: false, error: 'Cron failed' }, { status: 500 });
  }
}
