import { NextRequest, NextResponse } from 'next/server';
import { registrationService } from '../../../../lib/container';
import { UpdateRegistrationSchema } from '../../../../modules/tournaments/validators/event.schema';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException } from '../../../../modules/core/exceptions';
import { RegistrationStatus } from '../../../../modules/core/enums';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const registration = await registrationService.getRegistration(id);
    return NextResponse.json({ data: registration }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

const StatusChangeSchema = z.object({
  status: z.nativeEnum(RegistrationStatus),
  reason: z.string().optional()
});

export const PUT = withPermission('MANAGE_REGISTRATIONS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    
    if (body.status) {
      const { status, reason } = StatusChangeSchema.parse(body);
      const registration = await registrationService.updateRegistrationStatus(id, status, user.sub, reason);
      return NextResponse.json({ data: registration }, { status: 200 });
    }

    // Otherwise it's a general update (not supported in current service method, but would go here)
    // The instructions specified status updates are key.
    return NextResponse.json({ error: 'Only status updates are supported on this endpoint currently' }, { status: 400 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
});
