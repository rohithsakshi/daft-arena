import { NextRequest, NextResponse } from 'next/server';
import { rulePackageService } from '../../../../../../../lib/container';
import { withPermission } from '../../../../../../../modules/iam/guards/permission.guard';
import { NotFoundException, BusinessRuleException, ValidationException } from '../../../../../../../modules/core/exceptions';

export const POST = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const pkg = await rulePackageService.publishPackage(id, user.sub as string);
    return NextResponse.json({ data: pkg, message: 'Rule package published successfully' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof NotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ValidationException) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof BusinessRuleException) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
