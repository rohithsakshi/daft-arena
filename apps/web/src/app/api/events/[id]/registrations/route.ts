import { NextRequest, NextResponse } from 'next/server';
import { registrationService } from '../../../../../lib/container';
import { CreateRegistrationSchema } from '../../../../../modules/tournaments/validators/event.schema';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException, ConflictException } from '../../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const result = await registrationService.listRegistrations({ page, limit, eventId: id });
  return NextResponse.json(result, { status: 200 });
};

export const POST = withPermission('MANAGE_REGISTRATIONS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = CreateRegistrationSchema.parse({ ...body, eventId: id });
    const registration = await registrationService.createRegistration(data.tournamentId, id, data as any, user.sub);
    return NextResponse.json({ data: registration }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    if (error instanceof NotFoundException) return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof BusinessRuleException || error instanceof ConflictException) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
