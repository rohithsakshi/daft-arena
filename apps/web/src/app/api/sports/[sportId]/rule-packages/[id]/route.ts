import { NextRequest, NextResponse } from 'next/server';
import { rulePackageService } from '../../../../../../lib/container';
import { UpdateRulePackageSchema } from '../../../../../../modules/sports/validators/rulePackage.schema';
import { withPermission } from '../../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const pkg = await rulePackageService.getPackage(id);
    return NextResponse.json({ data: pkg }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateRulePackageSchema.parse(body);

    const pkg = await rulePackageService.updatePackage(id, data as any, user.sub as string);
    return NextResponse.json({ data: pkg }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    if (error instanceof BusinessRuleException) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
