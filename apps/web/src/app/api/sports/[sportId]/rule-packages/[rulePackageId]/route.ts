import { NextRequest, NextResponse } from 'next/server';
import { rulePackageService } from '../../../../../../lib/container';
import { UpdateRulePackageSchema } from '../../../../../../modules/sports/validators/rulePackage.schema';
import { withPermission } from '../../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { NotFoundException, BusinessRuleException } from '../../../../../../modules/core/exceptions';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ sportId: string, rulePackageId: string }> }) => {
  try {
    const { rulePackageId } = await params;
    const pkg = await rulePackageService.getPackage(rulePackageId);
    return NextResponse.json({ data: pkg }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ sportId: string, rulePackageId: string }> }) => {
  try {
    const { rulePackageId } = await params;
    const body = await req.json();
    const data = UpdateRulePackageSchema.parse(body);

    const pkg = await rulePackageService.updatePackage(rulePackageId, data as never, user.sub as string);
    return NextResponse.json({ data: pkg }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    if (error instanceof BusinessRuleException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 422 });
    }
    const message = error instanceof Error ? (error as Error).message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
