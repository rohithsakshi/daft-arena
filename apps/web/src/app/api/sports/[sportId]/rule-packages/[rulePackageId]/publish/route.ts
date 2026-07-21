import { NextRequest, NextResponse } from 'next/server';
import { rulePackageService } from '../../../../../../../lib/container';
import { withPermission } from '../../../../../../../modules/iam/guards/permission.guard';
import { NotFoundException, BusinessRuleException, ValidationException } from '../../../../../../../modules/core/exceptions';

export const POST = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ sportId: string, rulePackageId: string }> }) => {
  try {
    const { rulePackageId } = await params;
    const pkg = await rulePackageService.publishPackage(rulePackageId, user.sub as string);
    return NextResponse.json({ data: pkg, message: 'Rule package published successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
    if (error instanceof ValidationException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
    if (error instanceof BusinessRuleException) {
      return NextResponse.json({ error: (error as Error).message }, { status: 422 });
    }
    const message = error instanceof Error ? (error as Error).message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
